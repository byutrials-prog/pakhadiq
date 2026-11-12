'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { CheckCircle2, ImagePlus } from 'lucide-react';
import { createProductAction, updateProductAction } from '@/app/actions/productActions';
import type { Category, Product } from '@/types';

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const previewUrl = imagePreview ?? product?.image_url ?? null;

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      event.target.value = '';
      setMessage({ text: 'Gunakan gambar JPG, PNG, WebP, atau AVIF.', error: true });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = '';
      setMessage({ text: 'Ukuran gambar maksimal 5 MB.', error: true });
      return;
    }
    setMessage(null);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = product
        ? await updateProductAction(formData)
        : await createProductAction(formData);

      if (!result.success) {
        setMessage({ text: result.error, error: true });
        return;
      }

      if (!product) {
        form.reset();
        setImagePreview(null);
      }
      setMessage({
        text: result.warning ?? (product ? 'Perubahan produk tersimpan.' : 'Produk berhasil ditambahkan.'),
        error: Boolean(result.warning),
      });
      router.refresh();
    });
  }

  const stockId = `stock-${product?.id ?? 'new'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      {message && (
        <p
          role={message.error ? 'alert' : 'status'}
          className={`rounded-md border px-3 py-2 text-sm ${
            message.error
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {message.text}
        </p>
      )}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Nama produk</span>
        <input
          required
          maxLength={120}
          name="title"
          defaultValue={product?.title}
          placeholder="Contoh: Sambal Roa 150 ml"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Harga (Rp)</span>
          <input
            required
            min="0"
            step="1"
            type="number"
            name="price"
            defaultValue={product?.price}
            placeholder="25000"
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Kategori</span>
          <select
            name="categoryId"
            defaultValue={product?.category_id ?? ''}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
          >
            <option value="">Tanpa kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Deskripsi</span>
        <textarea
          rows={3}
          maxLength={2000}
          name="description"
          defaultValue={product?.description}
          placeholder="Bahan, ukuran, rasa, dan cerita singkat produk."
          className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
        />
      </label>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-stone-700">
          Foto produk {product ? '(opsional)' : ''}
        </span>
        <label className="flex min-h-28 cursor-pointer items-center justify-center gap-4 rounded-md border border-dashed border-stone-300 bg-stone-50 p-4 transition hover:border-emerald-800">
          {previewUrl ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
              <Image src={previewUrl} alt="Pratinjau produk" fill sizes="80px" className="object-cover" />
            </div>
          ) : (
            <ImagePlus aria-hidden="true" className="h-7 w-7 text-stone-400" />
          )}
          <span className="text-sm text-stone-600">
            Pilih JPG, PNG, WebP, atau AVIF
            <span className="mt-1 block text-xs text-stone-500">Maksimal 5 MB</span>
          </span>
          <input
            required={!product}
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleImageChange}
            className="sr-only"
          />
        </label>
      </div>

      <label htmlFor={stockId} className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
        <input
          id={stockId}
          type="checkbox"
          name="isAvailable"
          value="true"
          defaultChecked={product?.is_available ?? true}
          className="h-4 w-4 accent-emerald-800"
        />
        Stok tersedia
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
      >
        {message && !message.error && <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
        {isPending ? 'Menyimpan…' : product ? 'Simpan perubahan' : 'Tambah produk'}
      </button>
    </form>
  );
}
