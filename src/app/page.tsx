import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpWideNarrow,
  Check,
  MapPin,
  MessageCircle,
  Search,
  Store,
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Category, Product, StoreInfo } from '@/types';

interface HomePageProps {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}

function catalogHref(
  current: { search?: string; sort?: string },
  category?: string,
): string {
  const params = new URLSearchParams();
  if (current.search) params.set('search', current.search);
  if (category) params.set('category', category);
  if (current.sort) params.set('sort', current.sort);
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

function productPrice(price: number): string {
  return `Rp ${Number(price).toLocaleString('id-ID')}`;
}

export default async function HomePage({ searchParams: searchPromise }: HomePageProps) {
  const searchParams = await searchPromise;
  const supabase = await createServerSupabaseClient();
  const [{ data: storeData, error: storeError }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      supabase.from('store_info').select('*').eq('id', 1).maybeSingle(),
      supabase.from('categories').select('*').order('name'),
    ]);

  if (storeError) throw storeError;
  if (categoriesError) throw categoriesError;

  const store: StoreInfo = storeData ?? {
    id: 1,
    name: 'Toko Anda',
    promo_text: '',
    hero_title: 'Produk baik, dibuat dengan sepenuh hati.',
    hero_description: 'Temukan pilihan dari usaha lokal di sekitar Anda.',
    whatsapp_number: '',
    address: '',
    instagram_url: '',
    about_description: '',
    opening_hours: '',
    advantages: [],
    map_url: '',
  };
  const categories: Category[] = categoriesData ?? [];
  const selectedCategory = categories.find((category) => category.id === searchParams.category);

  let productQuery = supabase.from('products').select('*, category:categories(*)');
  if (searchParams.search?.trim()) {
    productQuery = productQuery.ilike('title', `%${searchParams.search.trim()}%`);
  }
  if (selectedCategory) {
    productQuery = productQuery.eq('category_id', selectedCategory.id);
  }
  if (searchParams.sort === 'price_asc') {
    productQuery = productQuery.order('price', { ascending: true });
  } else if (searchParams.sort === 'price_desc') {
    productQuery = productQuery.order('price', { ascending: false });
  } else {
    productQuery = productQuery.order('created_at', { ascending: false });
  }

  const { data: productData, error: productError } = await productQuery;
  if (productError) throw productError;
  const products: Product[] = productData ?? [];
  const featuredProduct = products[0];
  const whatsappUrl = store.whatsapp_number
    ? `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(`Halo ${store.name}, saya ingin bertanya tentang produk.`)}`
    : null;
  const mapUrl = store.map_url ||
    (store.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}` : null);

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-stone-900">
      <header className="border-b border-stone-200 bg-[#f7f5ef]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${store.name}, beranda`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[#f3c878]">
              <Store aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="truncate font-serif text-lg font-semibold tracking-tight sm:text-xl">{store.name}</span>
          </Link>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
            <a href="#katalog" className="transition hover:text-emerald-950">Katalog</a>
            <a href="#cerita" className="transition hover:text-emerald-950">Cerita kami</a>
            <a href="#kontak" className="transition hover:text-emerald-950">Kunjungi toko</a>
          </nav>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Tanya pemilik</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          ) : (
            <Link href="/admin/login" className="text-sm font-medium text-emerald-950">Admin</Link>
          )}
        </div>
      </header>

      <section className="border-b border-stone-200">
        <div className={`mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 ${featuredProduct ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}>
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
              <span className="h-px w-8 bg-amber-600" />
              {store.promo_text || 'Usaha lokal, cerita yang dekat'}
            </p>
            <h1 className="font-serif text-4xl leading-[1.08] tracking-tight text-stone-950 sm:text-6xl">
              {store.hero_title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              {store.hero_description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#katalog"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Jelajahi produk <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-500"
                >
                  Hubungi kami
                </a>
              )}
            </div>
            <p className="mt-8 text-sm text-stone-500">
              {store.address && <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="h-4 w-4" />{store.address}</span>}
            </p>
          </div>

          {featuredProduct && (
            <Link
              href={`/products/${featuredProduct.slug}`}
              className="group relative mx-auto block w-full max-w-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
                <Image
                  src={featuredProduct.image_url}
                  alt={featuredProduct.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.025]"
                />
              </div>
              <div className="absolute -bottom-4 left-4 right-4 flex items-end justify-between gap-4 border border-stone-200 bg-[#fffdf8] p-4 shadow-sm sm:left-8 sm:right-8">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-900">Pilihan dari toko</p>
                  <p className="mt-1 truncate font-serif text-lg text-stone-950">{featuredProduct.title}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-stone-700">{productPrice(featuredProduct.price)}</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section id="katalog" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col justify-between gap-5 border-b border-stone-300 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">Dibuat atau dipilih dengan cermat</p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Dari etalase kami</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-600">
            Pilihan produk dari {store.name}, siap dilihat dan ditanyakan langsung kepada pemilik.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <form method="GET" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
            <label className="relative">
              <span className="sr-only">Cari produk</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                name="search"
                defaultValue={searchParams.search}
                placeholder="Cari nama produk…"
                className="w-full rounded-md border border-stone-300 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
              />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-600">
              <span className="sr-only">Urutkan harga</span>
              {searchParams.sort === 'price_desc'
                ? <ArrowDownWideNarrow aria-hidden="true" className="h-4 w-4" />
                : <ArrowUpWideNarrow aria-hidden="true" className="h-4 w-4" />}
              <select
                name="sort"
                defaultValue={searchParams.sort ?? 'newest'}
                className="min-w-36 bg-transparent py-3 text-sm outline-none"
              >
                <option value="newest">Paling baru</option>
                <option value="price_asc">Harga terendah</option>
                <option value="price_desc">Harga tertinggi</option>
              </select>
            </label>
            <button
              type="submit"
              className="rounded-md bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950"
            >
              Terapkan
            </button>
          </form>

          {categories.length > 0 && (
            <nav aria-label="Filter kategori" className="flex gap-2 overflow-x-auto pb-1">
              <Link
                href={catalogHref(searchParams)}
                aria-current={!searchParams.category ? 'page' : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  !searchParams.category
                    ? 'border-emerald-950 bg-emerald-950 text-white'
                    : 'border-stone-300 text-stone-700 hover:border-stone-500'
                }`}
              >
                Semua produk
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={catalogHref(searchParams, category.id)}
                  aria-current={searchParams.category === category.id ? 'page' : undefined}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                    searchParams.category === category.id
                      ? 'border-emerald-950 bg-emerald-950 text-white'
                      : 'border-stone-300 text-stone-700 hover:border-stone-500'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {products.length === 0 ? (
          <div className="mt-8 border-y border-stone-300 py-16 text-center">
            <p className="font-serif text-xl text-stone-800">Belum ada produk yang cocok.</p>
            <p className="mt-2 text-sm text-stone-500">Coba kata pencarian lain atau pilih kategori yang berbeda.</p>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className={`absolute left-2 top-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      product.is_available
                        ? 'bg-[#fffdf8] text-emerald-950'
                        : 'bg-stone-900/85 text-white'
                    }`}>
                      {product.is_available ? 'Tersedia' : 'Habis'}
                    </span>
                  </div>
                  <div className="pt-3">
                    <p className="text-xs text-stone-500">{product.category?.name ?? 'Pilihan toko'}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-11 font-medium leading-5 text-stone-900 transition group-hover:text-emerald-900">
                      {product.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold text-emerald-950">{productPrice(product.price)}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-stone-600 group-hover:text-emerald-900">
                      Lihat detail <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(store.about_description || store.advantages.length > 0 || store.opening_hours || store.address) && (
        <section id="cerita" className="scroll-mt-8 border-y border-stone-200 bg-[#eeece3]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">Di balik setiap pilihan</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">Cerita dari {store.name}</h2>
              {store.about_description && (
                <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-7 text-stone-700">
                  {store.about_description}
                </p>
              )}
              {store.advantages.length > 0 && (
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {store.advantages.map((advantage) => (
                    <li key={advantage} className="flex items-start gap-2 text-sm leading-6 text-stone-700">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-emerald-900" />
                      {advantage}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div id="kontak" className="scroll-mt-8 border-t border-stone-300 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <h3 className="font-serif text-xl">Mampir atau sapa kami</h3>
              <dl className="mt-5 space-y-5 text-sm">
                {store.address && (
                  <div>
                    <dt className="font-semibold text-stone-900">Alamat</dt>
                    <dd className="mt-1 text-stone-600">{store.address}</dd>
                    {mapUrl && (
                      <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-semibold text-emerald-900 underline underline-offset-4">
                        <MapPin aria-hidden="true" className="h-4 w-4" /> Buka peta
                      </a>
                    )}
                  </div>
                )}
                {store.opening_hours && (
                  <div>
                    <dt className="font-semibold text-stone-900">Jam operasional</dt>
                    <dd className="mt-1 whitespace-pre-line text-stone-600">{store.opening_hours}</dd>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 pt-1">
                  {whatsappUrl && (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
                      WhatsApp
                    </a>
                  )}
                  {store.instagram_url && (
                    <a href={store.instagram_url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-stone-400 px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-white">
                      Instagram
                    </a>
                  )}
                </div>
              </dl>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-emerald-950 px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg">{store.name}</p>
            <p className="mt-1 text-xs text-white/65">Usaha lokal, tumbuh bersama sekitar.</p>
          </div>
          <div className="flex items-center gap-5 text-sm text-white/80">
            <a href="#katalog" className="transition hover:text-white">Katalog</a>
            <a href="#cerita" className="transition hover:text-white">Tentang</a>
            <Link href="/admin/login" className="transition hover:text-white">Admin</Link>
          </div>
          <p className="text-xs text-white/55">© {new Date().getFullYear()} {store.name}</p>
        </div>
      </footer>
    </main>
  );
}
