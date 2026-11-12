'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { updateStoreInfoAction } from '@/app/actions/storeActions';
import type { StoreInfo } from '@/types';

export default function StoreSettingsForm({ initialData }: { initialData: StoreInfo }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateStoreInfoAction(formData);
      setMessage(result.success
        ? { text: 'Profil toko berhasil disimpan.', error: false }
        : { text: result.error ?? 'Gagal menyimpan profil toko.', error: true });
    });
  }

  const fieldClass = 'w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Informasi publik</p>
        <h2 className="mt-1 font-serif text-xl text-stone-900">Profil toko</h2>
      </div>

      {message && (
        <p
          role={message.error ? 'alert' : 'status'}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
            message.error
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {!message.error && <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
          {message.text}
        </p>
      )}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Nama toko</span>
        <input required maxLength={100} name="name" defaultValue={initialData.name} className={fieldClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">WhatsApp</span>
          <input
            required
            inputMode="tel"
            name="whatsapp_number"
            defaultValue={initialData.whatsapp_number}
            placeholder="6282247255697"
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Jam operasional</span>
          <input
            name="opening_hours"
            maxLength={160}
            defaultValue={initialData.opening_hours}
            placeholder="Senin–Sabtu, 08.00–17.00"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Pesan banner promosi (opsional)</span>
        <input
          maxLength={100}
          name="promo_text"
          defaultValue={initialData.promo_text}
          placeholder="Contoh: Gratis ongkir untuk pesanan pertama"
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Judul hero / tagline</span>
        <input required maxLength={140} name="hero_title" defaultValue={initialData.hero_title} className={fieldClass} />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Deskripsi singkat hero</span>
        <textarea
          rows={2}
          maxLength={400}
          name="hero_description"
          defaultValue={initialData.hero_description}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Tentang toko</span>
        <textarea
          rows={4}
          maxLength={1200}
          name="about_description"
          defaultValue={initialData.about_description}
          placeholder="Ceritakan siapa Anda, proses produksi, atau asal bahan."
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Keunggulan toko</span>
        <textarea
          rows={3}
          maxLength={1000}
          name="advantages"
          defaultValue={initialData.advantages.join('\n')}
          placeholder={'Bahan pilihan dari petani lokal\nDibuat segar setiap hari'}
          className={fieldClass}
        />
        <span className="block text-xs text-stone-500">Satu keunggulan per baris, maksimal 8 baris.</span>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-stone-700">Alamat</span>
        <input maxLength={300} name="address" defaultValue={initialData.address} className={fieldClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Tautan Instagram</span>
          <input
            type="url"
            name="instagram_url"
            defaultValue={initialData.instagram_url}
            placeholder="https://instagram.com/namatoko"
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Tautan Google Maps (opsional)</span>
          <input
            type="url"
            name="map_url"
            defaultValue={initialData.map_url}
            placeholder="https://maps.google.com/..."
            className={fieldClass}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? 'Menyimpan…' : 'Simpan profil'}
      </button>
    </form>
  );
}
