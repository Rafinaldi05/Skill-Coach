import { Link, useParams } from "react-router-dom";
import { CoffeePreview, card } from "../components/landing/shared";
import { PublicNavbar } from "./PublicPortfolioPage";

export default function PublicProjectStoryPage() {
  const { username = "rinaputri" } = useParams();
  const displayName = username === "rinaputri" ? "Rina Putri" : username;
  const firstName = displayName.split(" ")[0];

  const criteriaRows = [
    { name: "Hierarki visual", before: 6, after: 8, delta: 2 },
    { name: "Konsistensi", before: 7, after: 8, delta: 1 },
    { name: "Aksesibilitas", before: 5, after: 8, delta: 3 },
    { name: "Kejelasan CTA", before: 6, after: 8, delta: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <PublicNavbar />

      <main className="mx-auto max-w-6xl space-y-10 px-5 py-8 sm:px-8 lg:px-12">
        {/* Back Link & Header */}
        <div>
          <Link
            to={`/p/${username}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5044B8] hover:underline"
          >
            ← Portofolio {displayName}
          </Link>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
            STUDI PROSES · DESAIN UI · 4–6 NOVEMBER 2026
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
            Landing page toko kopi
          </h1>
          <p className="mt-2.5 text-sm text-slate-600">
            Membawa kehangatan kedai lokal ke halaman digital, tanpa mengorbankan kejelasan
            informasi.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EFECFA] px-3 py-1 text-xs font-semibold text-[#5044B8]">
              Oleh {displayName} · @{username}
            </span>
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-medium text-slate-700">
              2 versi
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
              6.0 → 8.0 · ▲ naik +2.0
            </span>
          </div>
        </div>

        {/* Hero Karya Showcase */}
        <section>
          <CoffeePreview hero />
        </section>

        {/* 01-03 Narrative + Right Charts */}
        <section className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
                01 / TUJUAN
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
                Membantu orang menemukan menu, bukan menebak langkah.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Aku membuat landing page untuk kedai kopi lokal fiktif. Tujuannya sederhana: memberi
                gambaran suasana kedai dan mengarahkan pengunjung ke menu melalui satu aksi utama
                yang jelas.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
                02 / KEPUTUSAN DESAIN
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                Palet krem dan hijau zaitun membawa suasana hangat. Pada revisi kedua, aku
                mempertahankan identitas itu sambil mempertegas judul, mempergelap teks, dan
                mengganti label tombol menjadi “Lihat menu kopi”.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
                03 / REFLEKSI
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                Aku belajar memisahkan keputusan yang bersifat suasana dari keputusan yang membantu
                orang membaca. Revisi berikutnya akan berfokus pada ritme jarak agar hubungan
                antarbagian terasa lebih konsisten.
              </p>
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-5">
            <div className={`${card} p-6`}>
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-base font-semibold text-slate-900">Perjalanan skormu</h3>
                <span className="text-xs text-slate-500">1–10</span>
              </div>
              <svg viewBox="0 0 360 150" className="w-full" role="img" aria-label="Grafik perjalanan skor">
                {[10, 5, 1].map((v) => {
                  const y = 20 + ((10 - v) * 110) / 9;
                  return (
                    <g key={v}>
                      <line x1="30" x2="330" y1={y} y2={y} stroke="#e7e5e4" />
                      <text x="6" y={y + 4} fontSize="11" fill="#78716c">
                        {v}
                      </text>
                    </g>
                  );
                })}
                <polyline
                  points="55,75 305,45"
                  fill="none"
                  stroke="#5044b8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="55" cy="75" r="3.5" fill="#5044b8" />
                <text x="55" y="95" fontSize="11" fontWeight="600" fill="#5044b8">
                  6.0 · v1
                </text>
                <circle cx="305" cy="45" r="3.5" fill="#5044b8" />
                <text x="305" y="33" fontSize="11" fontWeight="600" fill="#5044b8" textAnchor="end">
                  8.0 · v2
                </text>
              </svg>
              <p className="mt-3 text-xs text-slate-500">
                4 Nov → 6 Nov 2026 · Landing page toko kopi
              </p>
            </div>

            <div className="rounded-2xl bg-[#EFECFA] p-6">
              <h3 className="text-sm font-semibold text-slate-900">Peningkatan per kriteria</h3>
              <ul className="mt-3.5 space-y-2 text-xs text-slate-700">
                {criteriaRows.map((c) => (
                  <li key={c.name}>
                    {c.name} · {c.before} → {c.after} ·{" "}
                    <span className="font-semibold text-green-800">▲ +{c.delta}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
                Skala 1–10 dari review AI. Contoh proses belajar, bukan hasil pengujian pengguna.
              </p>
            </div>
          </aside>
        </section>

        {/* 04 / Sebelum & Sesudah */}
        <section className="space-y-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
              04 / SEBELUM &amp; SESUDAH
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
              Bentuknya berubah. Alasannya ikut terlihat.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-slate-700">
                v1 · 4 November · 6.0
              </span>
              <CoffeePreview before />
              <p className="mt-3 text-xs text-slate-600">
                Label tombol umum dan teks terlalu pucat.
              </p>
            </div>

            <div>
              <span className="mb-3 inline-block rounded-full bg-[#EFECFA] px-3 py-1 text-xs font-semibold text-[#5044B8]">
                v2 · 6 November · 8.0
              </span>
              <CoffeePreview />
              <p className="mt-3 text-xs text-slate-600">
                Label lebih spesifik dan keterbacaan diperkuat.
              </p>
            </div>
          </div>
        </section>

        {/* Linimasa Proses */}
        <section className={`${card} p-6 sm:p-8`}>
          <h2 className="text-xl font-semibold text-slate-900">Linimasa proses</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                4 NOVEMBER 2026 · V1
              </span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                Menemukan identitas awal
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Menyusun hero, warna, dan suasana. Review pertama menyoroti hierarki serta
                aksesibilitas.
              </p>
            </div>

            <div>
              <span className="inline-block rounded-full bg-[#EFECFA] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5044B8]">
                6 NOVEMBER 2026 · V2
              </span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                Memperjelas jalan masuk
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Menegaskan judul, memperbaiki kontras, dan mengganti label CTA. Skor rata-rata naik
                2.0.
              </p>
            </div>
          </div>
        </section>

        {/* Author Footer Card */}
        <section className="rounded-2xl bg-[#EFECFA] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Mahasiswa DKV yang belajar membuat pengalaman digital lebih jelas dan hangat.
          </p>
          <Link
            to={`/p/${username}`}
            className="mt-5 inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50"
          >
            Lihat portofolio {firstName} →
          </Link>
        </section>
      </main>
    </div>
  );
}