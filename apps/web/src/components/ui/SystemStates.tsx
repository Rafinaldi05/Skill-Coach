import { Link } from "react-router-dom";
import { AlertCircle, Check, Clock, Layers, Lock, RefreshCw } from "lucide-react";
import { card } from "../landing/shared";

export function ProjectListSkeleton({ label = "Memuat proyek kamu..." }: { label?: string }) {
  return (
    <div className={`${card} p-6`}>
      <div className="flex items-center gap-3">
        <div className="size-10 animate-pulse rounded-xl bg-indigo-100/70" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-indigo-100/70" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-indigo-100/60" />
        </div>
      </div>
      <div className="mt-4 h-36 w-full animate-pulse rounded-xl bg-indigo-100/60" />
      <p className="mt-4 text-xs text-slate-500">{label}</p>
    </div>
  );
}

export function EmptyProjectsState() {
  return (
    <div className={`${card} p-7 text-center sm:p-10`}>
      <Layers className="mx-auto size-7 text-[#5044B8]" strokeWidth={1.75} />
      <h2 className="mt-3 text-xl font-semibold text-slate-900">Belum ada proyek.</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
        Unggah karya pertamamu untuk mendapat review.
      </p>
      <Link
        to="/projects/new"
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#5044B8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#403598]"
      >
        Unggah karya pertama
      </Link>
    </div>
  );
}

export function DataLoadErrorState({
  title = "Proyek belum bisa ditampilkan",
  onRetry,
}: {
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={`${card} p-6`}>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#FFF5F5] p-3.5 text-xs text-red-900">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-700" />
        <span>Koneksi ke data terputus. Karya kamu tetap tersimpan. Coba muat ulang.</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 w-full rounded-lg bg-[#EFECFA] px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-100"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function ReviewFailedState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className={`${card} p-6`}>
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800">
        ! Review gagal
      </span>
      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#FFF5F5] p-3.5 text-xs text-red-900">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-700" />
        <span>Review belum berhasil diselesaikan. File kamu aman. Kuota tidak dikurangi.</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 w-full rounded-lg bg-[#EFECFA] px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-100"
        >
          Coba lagi
        </button>
      )}
      <p className="mt-3 text-xs text-slate-500">
        Coba lagi pada versi yang sama. Tidak membuat duplikat karya.
      </p>
    </div>
  );
}

export function QuotaExhaustedState({
  resetDateLabel = "1 Desember 2026",
  previousReviewHref = "/projects/sample-ui/versions/sample",
}: {
  resetDateLabel?: string;
  previousReviewHref?: string;
}) {
  return (
    <div className={`${card} p-6`}>
      <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        0 dari 10 review tersisa
      </span>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">
        Waktunya menerapkan masukan
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Kuota review kamu habis. Kamu tetap bisa membaca review dan menyiapkan revisi.
      </p>
      <p className="mt-3 text-xs font-semibold text-slate-900">
        Reset berikutnya: {resetDateLabel}
      </p>
      <Link
        to={previousReviewHref}
        className="mt-4 inline-flex rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
      >
        Buka review sebelumnya
      </Link>
    </div>
  );
}

export function SessionExpiredState() {
  return (
    <div className={`${card} p-6`}>
      <Lock className="size-5 text-[#5044B8]" strokeWidth={1.75} />
      <h3 className="mt-3 text-lg font-semibold text-slate-900">Masuk lagi untuk melanjutkan</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Sesi kamu sudah berakhir. Draf yang terakhir kamu simpan masih tersimpan. Masuk lagi untuk
        membukanya; perubahan yang belum disimpan perlu kamu periksa kembali.
      </p>
      <Link
        to="/login"
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#5044B8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#403598]"
      >
        Masuk kembali
      </Link>
    </div>
  );
}

export function OfflinePollingState() {
  return (
    <div className={`${card} p-6`}>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <RefreshCw className="size-3" /> Kamu sedang offline
      </span>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">Proses review tidak perlu diulang</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Pembaruan status akan dilanjutkan otomatis saat koneksi kembali. Karya yang sudah terkirim
        tetap tersimpan.
      </p>
    </div>
  );
}

export function ReviewStatusBadge({
  status,
}: {
  status: "queued" | "processing" | "done" | "failed";
}) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
        <Check className="size-3" /> Selesai
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800">
        ! Gagal
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <span className="size-1.5 rounded-full bg-amber-600" /> Diproses
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/70 px-3 py-1 text-xs font-semibold text-slate-700">
      <Clock className="size-3" /> Mengantre
    </span>
  );
}