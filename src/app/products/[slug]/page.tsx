import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, MapPin, MessageCircle, Store, X } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Product, StoreInfo } from '@/types';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const [{ data: productData, error: productError }, { data: storeData, error: storeError }] =
    await Promise.all([
      supabase.from('products').select('*, category:categories(*)').eq('slug', slug).maybeSingle(),
      supabase.from('store_info').select('*').eq('id', 1).maybeSingle(),
    ]);

  if (productError) throw productError;
  if (storeError) throw storeError;
  if (!productData) notFound();

  const product: Product = productData;
  const store: StoreInfo = storeData ?? {
    id: 1,
    name: 'Toko Anda',
    promo_text: '',
    hero_title: '',
    hero_description: '',
    whatsapp_number: '',
    address: '',
    instagram_url: '',
    about_description: '',
    opening_hours: '',
    advantages: [],
    map_url: '',
  };
  const formattedPrice = `Rp ${Number(product.price).toLocaleString('id-ID')}`;
  const waMessage = encodeURIComponent(
    `Halo ${store.name}, saya tertarik dengan ${product.title} (${formattedPrice}). Apakah stok masih tersedia?`,
  );
  const waUrl = store.whatsapp_number
    ? `https://wa.me/${store.whatsapp_number}?text=${waMessage}`
    : null;

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-stone-900">
      <header className="border-b border-stone-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-emerald-950">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Kembali ke katalog
          </Link>
          <Link href="/" className="inline-flex min-w-0 items-center gap-2 font-serif text-base font-semibold text-emerald-950 sm:text-lg">
            <Store aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="truncate">{store.name}</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="mb-5 text-xs font-medium text-stone-500">
          <Link href="/" className="hover:text-emerald-900">Katalog</Link>
          <span className="mx-2">/</span>
          {product.category?.name ?? 'Produk'}
        </p>

        <article className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 sm:aspect-square">
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center py-2 lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
              {product.category?.name ?? 'Pilihan toko'}
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 text-2xl font-semibold text-emerald-950 sm:text-3xl">{formattedPrice}</p>

            <p className={`mt-5 inline-flex w-fit items-center gap-2 border px-3 py-1.5 text-sm ${
              product.is_available
                ? 'border-emerald-900/20 bg-emerald-900/5 text-emerald-950'
                : 'border-stone-300 bg-stone-100 text-stone-600'
            }`}>
              {product.is_available
                ? <Check aria-hidden="true" className="h-4 w-4" />
                : <X aria-hidden="true" className="h-4 w-4" />}
              {product.is_available ? 'Tersedia' : 'Stok sedang habis'}
            </p>

            <div className="mt-8 border-t border-stone-300 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Tentang produk</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-stone-700">
                {product.description || 'Informasi lebih lanjut tentang produk ini dapat ditanyakan langsung kepada pemilik toko.'}
              </p>
            </div>

            {product.is_available && waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-fit"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Pesan lewat WhatsApp
              </a>
            ) : (
              <p className="mt-8 text-sm text-stone-500">
                {product.is_available ? 'Nomor WhatsApp toko belum diatur.' : 'Silakan tanyakan kembali saat stok tersedia.'}
              </p>
            )}
            {store.address && (
              <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-stone-500">
                <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
                {store.address}
              </p>
            )}
          </div>
        </article>
      </div>

      <footer className="border-t border-stone-200 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{store.name}</span>
          <Link href="/" className="font-medium text-emerald-900 hover:underline">Lihat produk lainnya</Link>
        </div>
      </footer>
    </main>
  );
}
