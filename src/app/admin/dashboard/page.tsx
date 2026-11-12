import { redirect } from 'next/navigation';
import { getAdminContext } from '@/lib/supabase/admin';
import ProductForm from './ProductForm';
import StoreSettingsForm from './StoreSettingsForm';
import DeleteProductButton from './DeleteProductButton';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, LogOut, Package, Store } from 'lucide-react';
import type { StoreInfo, Category, Product } from '@/types';

export default async function AdminDashboardPage() {
  const admin = await getAdminContext();
  if (!admin) redirect('/admin/login?error=unauthorized');
  const { supabase, user } = admin;

  const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }, { data: storeData, error: storeError }] =
    await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('store_info').select('*').eq('id', 1).maybeSingle(),
    ]);

  if (productsError) throw productsError;
  if (categoriesError) throw categoriesError;
  if (storeError) throw storeError;

  const products: Product[] = productsData ?? [];
  const categories: Category[] = categoriesData ?? [];
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

  return (
    <main className="min-h-screen bg-[#f6f4ee] px-4 py-6 text-stone-900 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-stone-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
              <Store aria-hidden="true" className="h-4 w-4" />
              {store.name}
            </Link>
            <h1 className="mt-5 font-serif text-3xl tracking-tight sm:text-4xl">Ruang pengelola</h1>
            <p className="mt-2 text-sm text-stone-600">Masuk sebagai {user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
            >
              Lihat katalog <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </Link>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3.5 py-2 text-sm font-medium text-stone-700 transition hover:bg-white"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" /> Keluar
              </button>
            </form>
          </div>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="space-y-8">
            <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Katalog</p>
                <h2 className="mt-1 font-serif text-xl text-stone-900">Tambah produk</h2>
              </div>
              <ProductForm categories={categories} />
            </section>
            <StoreSettingsForm initialData={store} />
          </div>

          <section className="rounded-lg border border-stone-200 bg-white">
            <div className="flex items-end justify-between gap-4 border-b border-stone-200 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Inventaris</p>
                <h2 className="mt-1 font-serif text-xl text-stone-900">Produk toko</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-stone-600">
                <Package aria-hidden="true" className="h-4 w-4" /> {products.length}
              </span>
            </div>
            {products.length === 0 ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <p className="font-serif text-lg text-stone-800">Etalase masih kosong.</p>
                <p className="mt-1 text-sm text-stone-500">Produk baru yang ditambahkan akan muncul di sini.</p>
              </div>
            ) : (
              <ul className="divide-y divide-stone-200">
                {products.map((product) => (
                  <li key={product.id} className="p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-100">
                        <Image src={product.image_url} alt={product.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-stone-900">{product.title}</h3>
                        <p className="mt-1 text-sm text-stone-600">
                          Rp {Number(product.price).toLocaleString('id-ID')}
                          <span className="mx-2 text-stone-300">·</span>
                          {product.is_available ? 'Tersedia' : 'Habis'}
                        </p>
                      </div>
                      <DeleteProductButton productId={product.id} />
                    </div>
                    <details className="group mt-3">
                      <summary className="w-fit cursor-pointer list-none text-sm font-medium text-emerald-900 underline decoration-emerald-900/30 underline-offset-4 hover:decoration-emerald-900">
                        Edit produk
                      </summary>
                      <div className="mt-4 rounded-md bg-stone-50 p-4">
                        <ProductForm categories={categories} product={product} />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
