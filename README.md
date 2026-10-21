<div align="center">

# 🚀 The Serverless Odyssey

### Full-Stack Serverless Application — Proyek Perkuliahan

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Edge_Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

**Menjelajahi era baru pengembangan web tanpa server — scalable, aman, dan efisien.**

[Demo Live](https://your-app.vercel.app) · [Laporan Bug](https://github.com/byutrials-prog/my-serverless-app/issues) · [Request Fitur](https://github.com/byutrials-prog/my-serverless-app/issues)

</div>

---

## 📖 Deskripsi Proyek

**The Serverless Odyssey** adalah aplikasi web full-stack modern yang dibangun di atas ekosistem serverless cloud. Proyek ini dirancang sebagai eksplorasi mendalam terhadap arsitektur tanpa server (_serverless_) menggunakan teknologi edge-first, database cloud terkelola, dan CDN media pintar.

Proyek ini membuktikan bahwa aplikasi produksi-siap dapat dibangun **tanpa mengelola server fisik sama sekali**.

---

## 🏛️ Arsitektur 4 Pilar

```
┌─────────────────────────────────────────────────────────────┐
│                    THE SERVERLESS ODYSSEY                    │
│                    Arsitektur 4 Pilar                        │
└─────────────────────────────────────────────────────────────┘
         │                │               │              │
    ┌────▼────┐      ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
    │  Next.js │      │Supabase │    │Cloudinar│   │  Vercel  │
    │    16    │      │  Cloud  │    │   CDN   │   │  Edge    │
    │ App Rtr  │      │Postgres │    │  Media  │   │ Runtime  │
    └─────────┘      └─────────┘    └─────────┘   └─────────┘
    Frontend +        Database +     Asset +        Hosting +
    API Routes        Auth +         Image Optim.   CI/CD +
    (TypeScript)      RLS Policy     Upload          CDN Global
```

| Pilar | Teknologi | Peran |
|-------|-----------|-------|
| 🎨 **Frontend + API** | Next.js 16 App Router | Server Components, API Routes, Edge Middleware |
| 🗄️ **Database + Auth** | Supabase Cloud PostgreSQL | RLS, Realtime, Auth, Row-Level Security |
| 🖼️ **Media CDN** | Cloudinary | Upload, Transformasi Gambar, Optimasi Otomatis |
| ⚡ **Edge Deployment** | Vercel Edge Runtime | CI/CD Otomatis, Preview Deployments, Global CDN |

---

## 🗂️ Struktur Direktori

```
my-serverless-app/
├── src/
│   ├── app/                  # Next.js 16 App Router
│   │   ├── layout.tsx        # Root Layout
│   │   ├── page.tsx          # Home Page
│   │   └── api/              # API Route Handlers
│   ├── components/           # Reusable UI Components
│   ├── lib/                  # Utility & Client Config
│   │   ├── supabase.ts       # Supabase Client
│   │   └── cloudinary.ts     # Cloudinary Config
│   └── types/                # TypeScript Type Definitions
├── public/                   # Static Assets
├── .env.example              # ✅ Template variabel lingkungan (aman di-commit)
├── .env.local                # 🔒 Secrets lokal (TIDAK di-commit)
├── .gitignore                # Konfigurasi pengabaian Git
├── next.config.ts            # Konfigurasi Next.js
├── tailwind.config.ts        # Konfigurasi Tailwind CSS
├── tsconfig.json             # Konfigurasi TypeScript
└── package.json              # Dependensi Proyek
```

---

## ⚙️ Setup Lokal

### Prasyarat

Pastikan kamu sudah menginstall:
- [Node.js](https://nodejs.org/) `>= 20.x`
- [npm](https://npmjs.com/) `>= 10.x`
- Akun [Supabase](https://supabase.com/) (gratis)
- Akun [Cloudinary](https://cloudinary.com/) (gratis)

### Langkah Instalasi

**1. Clone repositori**
```bash
git clone https://github.com/byutrials-prog/my-serverless-app.git
cd my-serverless-app
```

**2. Install dependensi**
```bash
npm install
```

**3. Konfigurasi variabel lingkungan**
```bash
# Salin template ke file lokal
cp .env.example .env.local
```

Buka `.env.local` dan isi nilai nyata untuk setiap variabel:

| Variabel | Sumber |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Console → Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Console → Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Console → Dashboard |

**4. Jalankan server development**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu.

---

## 🌿 Aturan Git Branch

Proyek ini mengikuti **Git Flow** yang disederhanakan:

```
main ─────────────────────────────────────────────► Production
  └── develop ──────────────────────────────────── Integration
        ├── feature/nama-fitur ────────────────── Fitur Baru
        └── fix/nama-bug ──────────────────────── Bug Fix
```

| Langkah | Perintah | Keterangan |
|---------|----------|------------|
| **1. Buat branch baru** | `git checkout -b feature/nama-fitur develop` | Selalu dari `develop`, bukan `main` |
| **2. Commit perubahan** | `git commit -m "feat: deskripsi singkat"` | Gunakan [Conventional Commits](https://www.conventionalcommits.org/) |
| **3. Push ke remote** | `git push origin feature/nama-fitur` | Push branch fitur ke GitHub |
| **4. Buat Pull Request** | Via GitHub UI | PR dari `feature/` → `develop` → `main` |

### Format Pesan Commit

```
feat:     ✨ Fitur baru
fix:      🐛 Perbaikan bug
docs:     📝 Perubahan dokumentasi
style:    💄 Formatting, tanpa perubahan logika
refactor: ♻️  Refactor kode
test:     ✅ Menambah atau memperbaiki test
chore:    🔧 Update dependencies, konfigurasi
```

---

## 🚀 Deployment ke Vercel

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Deploy ke production
vercel --prod
```

Atau hubungkan repositori GitHub ke [Vercel Dashboard](https://vercel.com/dashboard) untuk **auto-deploy** setiap push ke `main`.

> ⚠️ **Penting:** Tambahkan semua variabel dari `.env.local` ke Vercel Dashboard → Project → Settings → Environment Variables.

---

## 🔒 Keamanan & DevSecOps

- ✅ Semua secrets dikelola via Environment Variables
- ✅ `.env*.local` tidak pernah di-commit (dilindungi `.gitignore`)
- ✅ Supabase Row Level Security (RLS) aktif di semua tabel
- ✅ API Routes dilindungi dengan validasi server-side
- ✅ `.env.example` publik hanya berisi placeholder

---

## 👤 Author

**byutrials-prog**
- GitHub: [@byutrials-prog](https://github.com/byutrials-prog)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

---

<div align="center">
  <sub>Built with ❤️ as part of <strong>The Serverless Odyssey</strong> — Proyek Perkuliahan</sub>
</div>
