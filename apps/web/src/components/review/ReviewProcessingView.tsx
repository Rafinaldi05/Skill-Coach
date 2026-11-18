import { Link } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Clock,
  Code2,
  Coffee,
  Loader2,
  NotebookPen,
  RefreshCw,
} from "lucide-react";
import type { Project, ReviewStatus, Version } from "@skill-coach/shared";
import { useRetryVersion } from "../../api";
import { CoffeePreview, card } from "../landing/shared";

interface ReviewProcessingViewProps {
  project?: Project;
  version: Version;
}

const fmtFullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function getFileLabel(project: Project | undefined, version: Version): string {
  if (version.fileKey) {
    const base = version.fileKey.split("/").pop();
    if (base) return base;
  }
  const match = version.textContent?.match(/^\[file\]\s+(.+)$/m);
  if (match?.[1]) return match[1].trim();
  const kind = project?.skillType ?? "UI";
  if (kind === "CODE") return `kode-v${version.versionNumber}.ts`;
  if (kind === "ESSAY") return `esai-v${version.versionNumber}.md`;
  return `landing-kopi-v${version.versionNumber}.png`;
}

function SubmissionPreview({
  project,
  version,
}: {
  project?: Project;
  version: Version;
}) {
  const kind = project?.skillType ?? "UI";
  const isPublic = project?.visibility?.toUpperCase() === "PUBLIC";
  const fileName = getFileLabel(project, version);
  const dateLabel = fmtFullDate(version.createdAt);

  return (
    <div>
      {kind === "CODE" ? (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#1E1D2B] p-6 text-slate-200">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <Code2 className="size-4 text-indigo-300" />
            <span>{fileName}</span>
          </div>
          <pre className="max-h-96 overflow-auto font-mono text-xs leading-relaxed">
            {version.textContent || "// Kode sedang diproses oleh mentor AI..."}
          </pre>
        </div>
      ) : kind === "ESSAY" ? (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-[#FFF1E5] p-6 text-slate-800">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-600">
            <NotebookPen className="size-4 text-[#5044B8]" />
            <span>{fileName}</span>
          </div>
          <p className="max-h-96 overflow-auto whitespace-pre-wrap text-sm leading-relaxed">
            {version.textContent ||
              "Tulisan kamu sedang dibaca untuk dianalisis struktur dan alur gagasannya."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl">
          <CoffeePreview before />
        </div>
      )}

      <div className="mt-3 space-y-0.5 text-xs text-slate-600">
        <p>{fileName}</p>
        <p>
          {dateLabel} · {isPublic ? "Publik" : "Privat"}
        </p>
      </div>
    </div>
  );
}

export function ReviewProcessingView({ project, version }: ReviewProcessingViewProps) {
  const retryVersion = useRetryVersion();
  const status: ReviewStatus = version.status;
  const projectTitle = project?.title ?? "Landing page toko kopi";
  const projectHref = project?.id ? `/projects/${project.id}` : "/projects";

  const isQueued = status === "queued";
  const isFailed = status === "failed";

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb & Header */}
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-slate-600">
          <Link to="/projects" className="hover:text-[#5044B8]">
            Proyek
          </Link>
          <span className="mx-1.5">/</span>
          <Link to={projectHref} className="hover:text-[#5044B8]">
            {projectTitle}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">v{version.versionNumber}</span>
        </nav>

        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
          {isFailed ? "REVIEW TERHENTI" : "KARYAMU SUDAH DITERIMA"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
          {isFailed
            ? "Review belum berhasil diselesaikan."
            : "Beri ruang untuk masukan yang bermakna."}
        </h1>
        <p className="mt-2.5 text-sm text-slate-600">
          {isFailed
            ? "Terjadi kendala saat menyiapkan masukan. Kamu bisa menjalankan ulang review tanpa mengunggah ulang."
            : "Satu review untuk versi ini sedang disiapkan. Kamu tidak perlu mengunggah ulang."}
        </p>
      </div>

      {/* Main 2-Column Desktop / Stacked Mobile Grid */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Karya Preview */}
        <div className="lg:col-span-5">
          <SubmissionPreview project={project} version={version} />
        </div>

        {/* Right Column: Progress & Queue Cards */}
        <div className="space-y-5 lg:col-span-7">
          {/* Card 1: Status & 3 Steps */}
          <section className={`${card} p-6 sm:p-8`}>
            {isFailed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                <AlertCircle className="size-3.5" />
                Review gagal
              </span>
            ) : isQueued ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Clock className="size-3.5" />
                Dalam antrean
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <span className="size-2 animate-pulse rounded-full bg-amber-500" />
                Sedang diproses
              </span>
            )}

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              {isFailed
                ? "Proses review terhenti"
                : isQueued
                  ? "Menunggu giliran membaca karyamu..."
                  : "Membaca karyamu..."}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isFailed
                ? version.errorMessage || "Sistem gagal memproses karya ini. Silakan coba lagi."
                : "Mentor AI sedang meninjau tujuan dan detail karya kamu sebelum menyusun masukan."}
            </p>

            {isFailed && (
              <div className="mt-5">
                <button
                  type="button"
                  disabled={retryVersion.isPending}
                  onClick={() => retryVersion.mutate(version.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#5044B8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#403598] disabled:opacity-60"
                >
                  <RefreshCw className={`size-4 ${retryVersion.isPending ? "animate-spin" : ""}`} />
                  {retryVersion.isPending ? "Mengantrekan ulang..." : "Coba review ulang"}
                </button>
              </div>
            )}

            {/* 3 Vertical Step Cards */}
            <div className="mt-6 space-y-3">
              {/* Step 1: Unggahan diterima */}
              <div className="flex items-start gap-3.5 rounded-xl bg-[#FAF8F5] p-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-stone-200/80 text-slate-600">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Unggahan diterima</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    File tersimpan sebagai v{version.versionNumber} di proyek kamu.
                  </p>
                </div>
              </div>

              {/* Step 2: Membaca karyamu... */}
              <div
                className={`flex items-start gap-3.5 rounded-xl p-4 transition ${
                  !isQueued && !isFailed ? "bg-[#EFECFA]" : "bg-[#FAF8F5]"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    !isQueued && !isFailed
                      ? "text-[#5044B8]"
                      : "bg-stone-200/80 text-slate-500"
                  }`}
                >
                  {!isQueued && !isFailed ? (
                    <Loader2 className="size-4 animate-spin text-[#5044B8]" />
                  ) : (
                    "2"
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Membaca karyamu...</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Mengenali struktur, hierarki, dan konteks.
                  </p>
                </div>
              </div>

              {/* Step 3: Menyusun masukan... */}
              <div className="flex items-start gap-3.5 rounded-xl bg-[#FAF8F5] p-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-stone-200/80 text-xs font-semibold text-slate-500">
                  3
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Menyusun masukan...</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Ringkasan, kekuatan, dan prioritas perbaikan.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Masih diproses, kamu bisa kembali nanti */}
          <section className="rounded-2xl bg-[#EFECFA] p-6 sm:p-8">
            <Coffee className="size-5 text-[#5044B8]" strokeWidth={1.75} />
            <h3 className="mt-4 text-base font-semibold text-slate-900">
              Masih diproses, kamu bisa kembali nanti
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Kamu boleh meninggalkan halaman ini. Status review tetap tersimpan di proyek dan akan
              diperbarui saat kamu kembali.
            </p>
            <Link
              to={projectHref}
              className="mt-5 inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50"
            >
              Kembali ke proyek
            </Link>
          </section>

          {/* Card 3: Saat masih mengantre */}
          <section className={`${card} p-6 sm:p-8`}>
            <span className="inline-block rounded-full bg-stone-200/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              SAAT MASIH MENGANTRE
            </span>
            <h3 className="mt-3.5 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Clock className="size-4 text-slate-600" />
              Menunggu giliran review
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Karyamu sudah masuk antrean. Proses akan dimulai saat giliranmu tiba. Tidak perlu
              mengirim ulang.
            </p>
          </section>

          <p className="text-xs text-slate-600">
            Kuota digunakan setelah review berhasil. Jika review gagal, kuota tidak dikurangi.
          </p>
        </div>
      </div>
    </div>
  );
}