import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Check, Code2, Menu, NotebookPen, X } from "lucide-react";
import type { Project } from "@skill-coach/shared";
import { usePortfolio } from "../api";
import { Brand, CoffeePreview, card } from "../components/landing/shared";

const fieldLabel: Record<string, string> = {
  UI_UX: "DESAIN UI",
  SOFTWARE_ENGINEERING: "KODE",
  WRITING: "TEKS & ESAI",
};

const kindLabel: Record<Project["skillType"], string> = {
  UI: "Desain UI",
  CODE: "Kode",
  ESSAY: "Teks & esai",
};

const fmtShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

const avgScores = (scores?: Record<string, number>) => {
  const vals = Object.values(scores ?? {});
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
};

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <Link to="/#cara-kerja" className="hover:text-[#5044B8]">
            Cara kerja
          </Link>
          <Link to="/#contoh-review" className="hover:text-[#5044B8]">
            Contoh review
          </Link>
          <Link to="/#pertanyaan" className="hover:text-[#5044B8]">
            Pertanyaan
          </Link>
        </nav>
        <Link
          to="/login"
          className="hidden rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50 md:inline-flex"
        >
          Masuk
        </Link>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-[#5044B8] hover:bg-indigo-50 md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="space-y-2 border-t border-stone-100 bg-white px-5 py-4 md:hidden">
          <Link to="/#cara-kerja" className="block py-1.5 text-sm text-slate-700">
            Cara kerja
          </Link>
          <Link to="/#contoh-review" className="block py-1.5 text-sm text-slate-700">
            Contoh review
          </Link>
          <Link to="/#pertanyaan" className="block py-1.5 text-sm text-slate-700">
            Pertanyaan
          </Link>
          <Link
            to="/login"
            className="mt-2 inline-block rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-[#5044B8]"
          >
            Masuk
          </Link>
        </div>
      )}
    </header>
  );
}

export default function PublicPortfolioPage() {
  const { username = "rinaputri" } = useParams();
  const isSample = username === "rinaputri";
  const portfolioQuery = usePortfolio(isSample ? "" : username);
  const [copied, setCopied] = useState(false);

  const displayName = isSample
    ? "Rina Putri"
    : portfolioQuery.data?.displayName ?? username;
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const rawField = isSample ? "UI_UX" : portfolioQuery.data?.skillField ?? "UI_UX";
  const subtitle = isSample
    ? "DESAIN UI · MAHASISWA DKV"
    : `${fieldLabel[rawField] ?? "KARYA"} · PORTOFOLIO`;

  const projects: Project[] = isSample
    ? [
        {
          id: "sample-ui",
          userId: "",
          title: "Landing page toko kopi",
          description:
            "Eksplorasi landing page untuk kedai lokal. Aku berfokus pada hierarki visual, keterbacaan, dan tombol yang menjelaskan tujuan dengan lebih baik.",
          goal: "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal.",
          skillType: "UI",
          visibility: "PUBLIC",
          createdAt: "2026-11-04T08:00:00.000Z",
          versions: [
            {
              id: "sample-v1-ui",
              projectId: "sample-ui",
              versionNumber: 1,
              fileKey: "landing-kopi-v1.png",
              fileType: "image/png",
              textContent: null,
              status: "done",
              errorMessage: null,
              createdAt: "2026-11-04T08:00:00.000Z",
              review: {
                id: "r1",
                versionId: "sample-v1-ui",
                summary: "Identitas awal sudah hangat.",
                scores: { "Hierarki visual": 6, Konsistensi: 7, Aksesibilitas: 5, "Kejelasan CTA": 6 },
                strengths: ["Identitas visual kedai kopi sudah terasa hangat.", "Struktur ringkas."],
                improvements: [],
                nextSteps: ["Perjelas CTA", "Perbaiki kontras", "Rapikan jarak"],
                comparison: null,
                model: "nebius",
                promptVersion: "1",
                tokensIn: 0,
                tokensOut: 0,
                costEstimate: "0",
                createdAt: "2026-11-04T08:05:00.000Z",
              },
            },
            {
              id: "sample-v2-ui",
              projectId: "sample-ui",
              versionNumber: 2,
              fileKey: "landing-kopi-v2.png",
              fileType: "image/png",
              textContent: null,
              status: "done",
              errorMessage: null,
              createdAt: "2026-11-06T08:00:00.000Z",
              review: {
                id: "r2",
                versionId: "sample-v2-ui",
                summary: "Lebih terarah dan mudah dipahami.",
                scores: { "Hierarki visual": 8, Konsistensi: 8, Aksesibilitas: 8, "Kejelasan CTA": 8 },
                strengths: ["Alur perhatian lebih jelas.", "Kontras lebih konsisten."],
                improvements: [],
                nextSteps: ["Atur jarak CTA", "Samakan grid", "Unggah v3"],
                comparison: {
                  score_delta: { "Hierarki visual": 2, Konsistensi: 1, Aksesibilitas: 3, "Kejelasan CTA": 2 },
                  progress_commentary: "Skor rata-rata naik +2.0",
                },
                model: "nebius",
                promptVersion: "1",
                tokensIn: 0,
                tokensOut: 0,
                costEstimate: "0",
                createdAt: "2026-11-06T08:05:00.000Z",
              },
            },
          ],
        },
      ]
    : portfolioQuery.data?.projects ?? [];

  const totalVersions = projects.reduce(
    (sum, p) => sum + (p.versions?.length ?? p._count?.versions ?? 1),
    0
  );

  function handleCopyLink() {
    void navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Portofolio ${displayName} · Skill Coach`,
          url: window.location.href,
        });
        return;
      } catch {
        // fallback ke copy link
      }
    }
    handleCopyLink();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <PublicNavbar />

      <main className="mx-auto max-w-6xl space-y-10 px-5 py-8 sm:px-8 lg:px-12">
        {/* Hero Profile Banner */}
        <section className="rounded-3xl bg-[#FFF1E5] p-6 sm:p-10">
          <span className="inline-block rounded-full bg-white/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#5044B8]">
            PORTOFOLIO BELAJAR · /p/{username}
          </span>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#5044B8] text-xl font-bold text-white">
              {initials}
            </div>

            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
                {subtitle}
              </p>
              <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                {displayName}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Aku belajar merancang pengalaman digital yang jelas dan hangat. Di sini, aku
                membagikan karya, keputusan, dan revisi yang membentuk proses belajarku.
              </p>
              <p className="mt-3 text-xs text-slate-600">
                @{username} · Terbuka untuk kesempatan magang desain
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
                >
                  {copied && <Check className="size-3.5" />}
                  {copied ? "Link tersalin" : "Salin link"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
                >
                  Bagikan
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Heading + Stats Box */}
        <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
              BUKAN HANYA HASIL AKHIR
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              Proses yang ikut terlihat.
            </h2>
            <p className="mt-2.5 text-sm text-slate-600">
              Satu proyek publik, dua versi, dan perubahan yang bisa ditelusuri. Seluruh karya di
              halaman ini adalah contoh ilustratif.
            </p>
          </div>

          <div className={`${card} grid grid-cols-3 gap-6 px-6 py-5`}>
            <div>
              <p className="text-2xl font-semibold text-[#5044B8]">{projects.length || 1}</p>
              <p className="mt-0.5 text-xs text-slate-500">proyek publik</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#5044B8]">{totalVersions || 2}</p>
              <p className="mt-0.5 text-xs text-slate-500">versi karya</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#5044B8]">+2.0</p>
              <p className="mt-0.5 text-xs text-slate-500">progres UI</p>
            </div>
          </div>
        </section>

        {/* Karya & Perjalanannya */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              Karya &amp; perjalanannya
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {projects.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full bg-stone-200/70 px-3.5 py-1 text-xs font-medium text-slate-700"
                >
                  {kindLabel[p.skillType]}
                </span>
              ))}
            </div>
          </div>

          {projects.map((proj) => {
            const sortedVers = [...(proj.versions ?? [])].sort(
              (a, b) => a.versionNumber - b.versionNumber
            );
            const v1 = sortedVers[0];
            const vLatest = sortedVers[sortedVers.length - 1] ?? v1;
            const s1 = avgScores(v1?.review?.scores) ?? 6.0;
            const s2 = avgScores(vLatest?.review?.scores) ?? 8.0;
            const delta = s2 - s1;

            return (
              <article key={proj.id} className={`${card} p-6 sm:p-8`}>
                <div className="grid items-center gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    {proj.skillType === "CODE" ? (
                      <div className="rounded-xl bg-[#1E1D2B] p-6 text-slate-200">
                        <Code2 className="mb-4 size-5 text-indigo-300" />
                        <pre className="font-mono text-xs leading-relaxed">
                          {vLatest?.textContent ?? `app.post("/tasks", (req, res) => { ... });`}
                        </pre>
                      </div>
                    ) : proj.skillType === "ESSAY" ? (
                      <div className="rounded-xl bg-[#FFF1E5] p-6 text-slate-800">
                        <NotebookPen className="mb-4 size-5 text-[#5044B8]" />
                        <p className="text-base leading-relaxed">
                          {vLatest?.textContent ?? proj.description}
                        </p>
                      </div>
                    ) : (
                      <CoffeePreview />
                    )}
                  </div>

                  <div className="lg:col-span-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                      {s1.toFixed(1)} → {s2.toFixed(1)} ·{" "}
                      {delta >= 0 ? `▲ naik +${delta.toFixed(1)}` : `▼ turun ${delta.toFixed(1)}`}
                    </span>

                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
                      {proj.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {proj.description}
                    </p>

                    <div className="mt-5">
                      <h4 className="text-xs font-semibold text-slate-900">
                        Keputusan yang berubah
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        Dari “Klik di sini” menjadi “Lihat menu kopi”. Dari teks pucat menjadi
                        kontras yang lebih jelas. Dari banyak penekanan menjadi satu fokus utama.
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {sortedVers.map((v, idx) => {
                        const sc = avgScores(v.review?.scores) ?? (idx === 0 ? 6.0 : 8.0);
                        const isLast = idx === sortedVers.length - 1;
                        return (
                          <span
                            key={v.id}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isLast
                                ? "bg-[#EFECFA] text-[#5044B8]"
                                : "bg-stone-100 text-slate-600"
                            }`}
                          >
                            {fmtShortDate(v.createdAt)} · v{v.versionNumber} · {sc.toFixed(1)}
                          </span>
                        );
                      })}
                    </div>

                    <Link
                      to={`/p/${username}/projects/${proj.id}`}
                      className="mt-6 flex w-full items-center justify-center rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50"
                    >
                      Lihat cerita &amp; perbandingan →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Bottom 2 Cards: Perjalanan skormu & Yang kupelajari dari revisi */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className={`${card} p-6 sm:p-7`}>
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

          <div className="rounded-2xl bg-[#EFECFA] p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">Yang kupelajari dari revisi</h3>
            <blockquote className="mt-4 text-sm leading-relaxed text-slate-800">
              “Tombol yang menonjol belum tentu jelas. Aku belajar bahwa label, kontras, dan
              konteks di sekitarnya perlu bekerja bersama.”
            </blockquote>
            <p className="mt-4 text-xs text-slate-600">
              Catatan proses {displayName.split(" ")[0]} · 6 November 2026
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Skor adalah review AI atas karya, bukan sertifikasi kemampuan atau hasil uji pengguna.
            </p>
          </div>
        </section>

        <footer className="pb-6 text-xs leading-relaxed text-slate-500">
          <p>Portofolio publik {displayName} · Dibuat dengan Skill Coach</p>
          <p>Hanya proyek yang dipilih untuk publik yang ditampilkan.</p>
        </footer>
      </main>
    </div>
  );
}