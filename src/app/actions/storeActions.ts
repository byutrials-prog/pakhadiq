'use server';

import { revalidatePath } from 'next/cache';
import { getAdminContext } from '@/lib/supabase/admin';

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function validateOptionalUrl(value: string, label: string): void {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error();
  } catch {
    throw new Error(`${label} harus berupa URL yang diawali http:// atau https://.`);
  }
}

export async function updateStoreInfoAction(formData: FormData) {
  try {
    const admin = await getAdminContext();
    if (!admin) return { success: false, error: 'Hanya admin toko yang dapat mengubah profil.' };

    const name = getText(formData, 'name');
    const heroTitle = getText(formData, 'hero_title');
    const whatsapp = getText(formData, 'whatsapp_number').replace(/\D/g, '');
    const whatsappNumber = whatsapp.startsWith('0') ? `62${whatsapp.slice(1)}` : whatsapp;
    const instagramUrl = getText(formData, 'instagram_url');
    const mapUrl = getText(formData, 'map_url');
    const advantages = getText(formData, 'advantages')
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!name || !heroTitle) {
      return { success: false, error: 'Nama toko dan judul hero wajib diisi.' };
    }
    if (whatsappNumber.length < 8 || whatsappNumber.length > 15) {
      return { success: false, error: 'Nomor WhatsApp harus berisi 8 sampai 15 digit.' };
    }
    if (advantages.length > 8 || advantages.some((item) => item.length > 120)) {
      return { success: false, error: 'Isi maksimal 8 keunggulan, masing-masing maksimal 120 karakter.' };
    }
    validateOptionalUrl(instagramUrl, 'Tautan Instagram');
    validateOptionalUrl(mapUrl, 'Tautan peta');

    const { error } = await admin.supabase
      .from('store_info')
      .update({
        id: 1,
        name,
        promo_text: getText(formData, 'promo_text'),
        hero_title: heroTitle,
        hero_description: getText(formData, 'hero_description'),
        about_description: getText(formData, 'about_description'),
        opening_hours: getText(formData, 'opening_hours'),
        advantages,
        whatsapp_number: whatsappNumber,
        address: getText(formData, 'address'),
        instagram_url: instagramUrl,
        map_url: mapUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui profil toko.',
    };
  }
}
