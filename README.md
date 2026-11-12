# Katalog UMKM

Web profil dan katalog produk untuk usaha kecil. Pengunjung dapat melihat produk, mencari dan memfilter katalog, lalu menghubungi pemilik melalui WhatsApp. Pemilik mengelola produk dan informasi toko dari dashboard.

## Teknologi

- Next.js App Router, React, dan TypeScript
- Tailwind CSS, komponen UI, dan Lucide
- Supabase PostgreSQL, Auth, dan Row Level Security
- Cloudinary untuk upload gambar dari server
- Siap dikonfigurasi untuk deployment di Vercel

## Menjalankan secara lokal

1. Gunakan Node.js 20 atau lebih baru, lalu jalankan `npm install`.
2. Salin `.env.example` menjadi `.env.local` dan isi URL/key Supabase serta kredensial Cloudinary.
3. Jalankan isi `schema.sql` melalui Supabase SQL Editor.
4. Buat akun pemilik di Supabase Auth → Users menggunakan email/password.
5. Setelah akun dibuat, jadikan hanya akun pemilik tersebut sebagai admin melalui SQL Editor:

   ```sql
   update public.profiles
   set role = 'user'
   where role = 'admin';

   update public.profiles
   set role = 'admin'
   where email = 'email-pemilik@example.com';
   ```

   Langkah pertama diperlukan jika project sebelumnya memakai skema yang otomatis memberi role admin kepada setiap pendaftar.
6. Jalankan `npm run dev`, kemudian buka `http://localhost:3000`.

Akun baru diberi role `user`. Jangan pernah memasukkan Supabase service-role key atau Cloudinary API secret ke variabel `NEXT_PUBLIC_*`.

## Konfigurasi

| Variabel | Kegunaan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase (`NEXT_PUBLIC_SUPABASE_ANON_KEY` lama juga didukung) |
| `CLOUDINARY_URL` | URL kredensial dari Cloudinary API Keys (alternatif) |
| `CLOUDINARY_CLOUD_NAME` | Nama cloud Cloudinary (gunakan bersama dua variabel di bawah jika tanpa `CLOUDINARY_URL`) |
| `CLOUDINARY_API_KEY` | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret server-side untuk upload Cloudinary |
| `NEXT_PUBLIC_SITE_URL` | URL publik aplikasi |

Upload gambar dilakukan dari server dengan kredensial Cloudinary; secret tidak dikirim ke browser. Gambar dibatasi maksimal 5 MB.

## Fitur

- Katalog publik dengan pencarian, filter kategori, urutan harga, dan status stok
- Halaman detail produk dengan tautan pemesanan WhatsApp terisi otomatis
- Profil toko: pesan banner promosi, cerita, keunggulan, alamat, jam buka, Instagram, dan tautan peta
- Dashboard admin: autentikasi email/password, tambah/edit/hapus produk, pratinjau gambar, dan pengaturan profil
- Kebijakan RLS membatasi perubahan data ke profil ber-role `admin`

## Pemeriksaan dan deployment

```bash
npm run lint
npm run build
```

Untuk Vercel, impor project lalu tambahkan variabel lingkungan yang sama melalui **Project Settings → Environment Variables**. Terapkan `schema.sql` pada project Supabase production dan promosikan akun pemilik secara manual seperti langkah di atas.
