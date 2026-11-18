# Skill Coach API

Backend Express + TypeScript untuk PRD Skill Coach. Menggunakan PostgreSQL/Prisma, pg-boss, JWT access 15 menit dan refresh 7 hari, Argon2id, Zod, S3-compatible presigned upload, serta Nebius melalui OpenAI SDK.

## Struktur source

```text
src/
  ai/
    prompts/                 # Panduan prompt UI, kode, esai
    review-schemas.ts        # Kontrak output review Zod
  config.ts                 # Validasi environment
  jobs/
    review-worker.ts         # Worker pg-boss
  features/
    auth/                    # Route, controller, service auth
    users/                   # Profil, kuota, presigned upload
    projects/                # CRUD proyek
    versions/                # Versi, retry, progress, queue
    reviews/                 # Feedback review
    portfolio/               # Profil publik
    health/                  # Dependency healthcheck
  app.ts                     # Bootstrap Express, middleware, dan pemasangan router
  server.ts                  # Entry point HTTP
```

`app.ts` memasang router per domain dan mengelola middleware bersama. Setiap fitur memisahkan route, controller, dan service. Model database didefinisikan terpusat di `prisma/schema.prisma`.

## Menjalankan lokal

1. Gunakan Node.js 20+ dan PostgreSQL 16. Salin `.env.example` menjadi `.env`, isi `DATABASE_URL`, kedua secret JWT (minimal 32 karakter), konfigurasi storage, dan kunci Nebius. Untuk Supabase, `DATABASE_URL` dipakai aplikasi; isi `DIRECT_URL` dengan direct connection atau session pooler port `5432` untuk migrasi. Hindari transaction pooler port `6543` untuk Prisma Migrate.
2. Dari folder ini jalankan `pnpm install`, `pnpm db:generate`, `pnpm db:migrate`, lalu `pnpm dev`.
3. Jalankan worker dalam proses terminal terpisah dengan `npm run worker`. Production: build lalu jalankan API dan worker sebagai dua service terpisah (`npm start` dan `npm run start:worker`).

Migrasi awal berada di `prisma/migrations/`. Untuk local/demo, isi `SEED_EMAIL`, `SEED_USERNAME`, dan `SEED_PASSWORD` di `.env`, lalu jalankan `pnpm db:seed`. Seeder melakukan upsert satu user dan kuota bulan berjalan, serta menolak berjalan saat `NODE_ENV=production`.

Jalankan `pnpm format` untuk merapikan format file TypeScript atau `pnpm format:check` untuk memeriksa formatnya.

Queue worker dan API memakai database yang sama. Bucket harus private. Presigned PUT URL berlaku 5 menit, mengikat `Content-Type` dan `Content-Length` yang diminta, serta membatasi unggahan sampai 5 MB. Klien harus mengirim file dengan header yang sama. Key upload dibatasi ke prefix user. Worker memproses PNG/JPEG/WebP dengan model vision, teks biasa, dan ekstraksi teks PDF sampai 30 halaman pertama. PDF hasil scan tanpa teks belum diproses OCR.

## Endpoint

OpenAPI 3.1 contract: [`openapi.yaml`](./openapi.yaml).

Publik: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /health`, `GET /public/p/:username`.

Bearer access token: `GET/PATCH /me`, `GET /me/quota`, `POST /uploads/presign`, `GET/POST /projects`, `PATCH/DELETE /projects/:id`, `POST /projects/:id/versions`, `GET /versions/:id`, `POST /versions/:id/retry`, `GET /projects/:id/progress`, `POST /reviews/:id/feedback`.

Request body divalidasi Zod; ukuran JSON dibatasi 1 MB. Error konsisten berbentuk `{success:false,error:{code,message,details},meta:{requestId,timestamp}}`. Semua akses proyek/versi/review dibatasi berdasarkan pemilik.

## Catatan operasional

- Jalankan migrasi Prisma sebelum memulai API/worker.
- `MONTHLY_REVIEW_LIMIT` default 10. Kuota dicek saat enqueue dan dikonsumsi ketika review berhasil.
- Tes tenant integration memerlukan database yang bisa dijangkau dan `RUN_INTEGRATION_TESTS=1`; tes biasa dijalankan dengan `pnpm test`.
- Feedback mendukung satu rating per review/pengguna. Worker menyimpan jumlah token dari respons Nebius. Isi `NEBIUS_INPUT_COST_PER_MILLION` dan `NEBIUS_OUTPUT_COST_PER_MILLION` sesuai tarif aktif untuk mengaktifkan estimasi biaya; nilai default 0.
- Integrasi Nebius memakai endpoint OpenAI-compatible `chat.completions`. `NEBIUS_MODEL_TEXT_BASE_URL` dan `NEBIUS_MODEL_VISION_BASE_URL` dapat menunjuk endpoint berbeda; jika tidak diisi, keduanya memakai `NEBIUS_BASE_URL` (default `https://api.tokenfactory.nebius.com/v1/`). Isi model ID yang tersedia pada akun di `NEBIUS_MODEL_TEXT` dan `NEBIUS_MODEL_VISION`.
- Worker mengirim gambar sebagai data URL base64 dan meminta JSON mode untuk model teks. Respons model vision tetap divalidasi sebagai JSON oleh backend tanpa mengandalkan `response_format`, karena dukungan structured output berbeda antar model.
- Referensi kontrak: `docs/PRD Teknis Backend - Skill Coach.md` pada root repo.
