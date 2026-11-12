'use server';

import { revalidatePath } from 'next/cache';
import { deleteImageFromCloudinary, uploadImageToCloudinary } from '@/lib/cloudinary';
import { getAdminContext } from '@/lib/supabase/admin';

type ActionResult = { success: true; warning?: string } | { success: false; error: string };

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function getProductFields(formData: FormData) {
  const title = formData.get('title');
  const categoryId = formData.get('categoryId');
  const rawPrice = formData.get('price');
  const description = formData.get('description');

  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Nama produk wajib diisi.');
  }
  if (typeof rawPrice !== 'string' || rawPrice.trim() === '') {
    throw new Error('Harga produk wajib diisi.');
  }

  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Harga harus berupa angka nol atau lebih.');
  }

  return {
    title: title.trim(),
    categoryId: typeof categoryId === 'string' && categoryId ? categoryId : null,
    price,
    description: typeof description === 'string' ? description.trim() : '',
    isAvailable: formData.get('isAvailable') === 'true',
  };
}

function getImageFile(formData: FormData): File | null {
  const image = formData.get('image');
  return image instanceof File && image.size > 0 ? image : null;
}

function createSlug(title: string): string {
  const base = title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'produk';

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function refreshCatalog() {
  revalidatePath('/');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/admin/dashboard');
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  let uploadedPublicId: string | null = null;
  try {
    const admin = await getAdminContext();
    if (!admin) return { success: false, error: 'Hanya admin toko yang dapat mengelola produk.' };

    const fields = getProductFields(formData);
    const image = getImageFile(formData);
    if (!image) return { success: false, error: 'Foto produk wajib diunggah.' };

    const uploaded = await uploadImageToCloudinary(image, 'products');
    uploadedPublicId = uploaded.publicId;

    const { error } = await admin.supabase.from('products').insert({
      title: fields.title,
      slug: createSlug(fields.title),
      category_id: fields.categoryId,
      price: fields.price,
      description: fields.description,
      image_url: uploaded.url,
      image_public_id: uploaded.publicId,
      is_available: fields.isAvailable,
    });

    if (error) {
      try {
        await deleteImageFromCloudinary(uploaded.publicId);
      } catch (cleanupError) {
        return {
          success: false,
          error: `${error.message} Gambar sementara juga gagal dihapus: ${errorMessage(cleanupError, 'kesalahan tidak diketahui')}`,
        };
      }
      return { success: false, error: error.message };
    }

    uploadedPublicId = null;
    refreshCatalog();
    return { success: true };
  } catch (error) {
    let message = errorMessage(error, 'Gagal menambahkan produk.');
    if (uploadedPublicId) {
      try {
        await deleteImageFromCloudinary(uploadedPublicId);
      } catch (cleanupError) {
        message += ` Gambar sementara gagal dihapus: ${errorMessage(cleanupError, 'kesalahan tidak diketahui')}`;
      }
    }
    return { success: false, error: message };
  }
}

export async function updateProductAction(formData: FormData): Promise<ActionResult> {
  let uploadedPublicId: string | null = null;
  try {
    const admin = await getAdminContext();
    if (!admin) return { success: false, error: 'Hanya admin toko yang dapat mengelola produk.' };

    const id = formData.get('id');
    if (typeof id !== 'string' || !id) {
      return { success: false, error: 'Produk yang akan diperbarui tidak valid.' };
    }

    const fields = getProductFields(formData);
    const { data: currentProduct, error: lookupError } = await admin.supabase
      .from('products')
      .select('image_public_id')
      .eq('id', id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!currentProduct) return { success: false, error: 'Produk tidak ditemukan.' };

    const image = getImageFile(formData);
    const uploaded = image ? await uploadImageToCloudinary(image, 'products') : null;
    uploadedPublicId = uploaded?.publicId ?? null;

    const { error } = await admin.supabase
      .from('products')
      .update({
        title: fields.title,
        category_id: fields.categoryId,
        price: fields.price,
        description: fields.description,
        is_available: fields.isAvailable,
        ...(uploaded ? { image_url: uploaded.url, image_public_id: uploaded.publicId } : {}),
      })
      .eq('id', id);

    if (error) throw error;

    uploadedPublicId = null;
    let warning: string | undefined;
    if (uploaded && currentProduct.image_public_id) {
      try {
        await deleteImageFromCloudinary(currentProduct.image_public_id);
      } catch (cleanupError) {
        warning = `Produk tersimpan, tetapi gambar lama gagal dihapus: ${errorMessage(cleanupError, 'kesalahan tidak diketahui')}`;
      }
    }

    refreshCatalog();
    return { success: true, warning };
  } catch (error) {
    let message = errorMessage(error, 'Gagal memperbarui produk.');
    if (uploadedPublicId) {
      try {
        await deleteImageFromCloudinary(uploadedPublicId);
      } catch (cleanupError) {
        message += ` Gambar sementara gagal dihapus: ${errorMessage(cleanupError, 'kesalahan tidak diketahui')}`;
      }
    }
    return { success: false, error: message };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    const admin = await getAdminContext();
    if (!admin) return { success: false, error: 'Hanya admin toko yang dapat mengelola produk.' };
    if (!id) return { success: false, error: 'Produk yang akan dihapus tidak valid.' };

    const { data: product, error: lookupError } = await admin.supabase
      .from('products')
      .select('image_public_id')
      .eq('id', id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!product) return { success: false, error: 'Produk tidak ditemukan.' };

    const { error } = await admin.supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    refreshCatalog();
    try {
      await deleteImageFromCloudinary(product.image_public_id);
      return { success: true };
    } catch (cleanupError) {
      return {
        success: true,
        warning: `Produk dihapus, tetapi gambar di Cloudinary gagal dihapus: ${errorMessage(cleanupError, 'kesalahan tidak diketahui')}`,
      };
    }
  } catch (error) {
    return { success: false, error: errorMessage(error, 'Gagal menghapus produk.') };
  }
}
