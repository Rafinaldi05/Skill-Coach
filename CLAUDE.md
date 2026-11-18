# Skill Coach — Konteks & Aturan Frontend (adjie-fe)

## 1. Struktur Monorepo
- **Package Manager & Build:** `pnpm` Workspaces + Turborepo + TypeScript.
- `apps/web`: **Area Kerja Utama (Frontend)** — React, Vite, TypeScript, Tailwind CSS, TanStack Query[cite: 1].
- `apps/api`: Backend (Express, Prisma/Drizzle, pg-boss) — **Read-only / Jangan dimodifikasi**[cite: 1].
- `packages/shared`: Single Source of Truth (Skema Zod, tipe TS, konstanta status)[cite: 1, 2].

## 2. Aturan Kode & Kontrak Data
- **Sumber Tipe Data:** Selalu impor tipe (`ReviewOutput`, dll.) dan skema validasi langsung dari `@skill-coach/shared` (`packages/shared/src/`)[cite: 1, 2]. Dilarang mendefinisikan ulang *interface* respons API secara manual di `apps/web`.
- **Konstanta Status Review:** Gunakan nilai baku `queued`, `processing`, `done`, `failed`[cite: 1].
- **Batasan Modifikasi:** Hanya buat dan ubah file di dalam `apps/web/`[cite: 1, 3]. Jangan mengubah `packages/shared/` atau `apps/api/` tanpa persetujuan eksplisit karena dapat merusak integrasi tim Backend[cite: 4].
- **Ikon & Aset UI:** Wajib gunakan ikon dari library `lucide-react` untuk seluruh ikon antarmuka (dilarang menggambar ikon dengan path SVG manual kecuali untuk logo brand atau grafik data sederhana).

## 3. Perintah Operasional (Jalankan dari Root)
- Jalankan server frontend saja: `pnpm dev:web`[cite: 4]
- Validasi tipe TypeScript seluruh monorepo: `pnpm typecheck`[cite: 4]
- Build produksi: `pnpm build`[cite: 4]

## 4. Standar Git & Workflow
- **Dilarang keras** melakukan commit atau push langsung ke `main` atau `development`[cite: 2].
- Pastikan selalu berada di working branch `adjie-fe` atau `adjie-fe/<nama-fitur>` (target PR: `development`)[cite: 1, 2, 3].
- Format commit: `feat(fe): <deskripsi singkat>` atau `fix(fe): <deskripsi singkat>`[cite: 3].

## 5. Efisiensi Token
- Berikan jawaban singkat dan langsung ke kode tanpa penjelasan panjang.
- Baca hanya file spesifik yang relevan dengan tugas saat ini; jangan memindai seluruh direktori proyek.