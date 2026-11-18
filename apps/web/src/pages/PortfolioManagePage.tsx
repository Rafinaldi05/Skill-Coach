import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Code2, NotebookPen, ShieldCheck } from "lucide-react";
import { useProfile, useProjects, useUpdateProject } from "../api";
import { CoffeePreview, card } from "../components/landing/shared";
import { kindMeta, sample, toItem, type Item } from "./DashboardPage";

export default function PortfolioManagePage() {
  const { data: profile } = useProfile();
  const projectsQuery = useProjects();
  const updateProject = useUpdateProject();

  const [localPublic, setLocalPublic] = useState<Record<string, boolean>>({});
  const [copiedBanner, setCopiedBanner] = useState(false);
  const [visibilityBanner, setVisibilityBanner] = useState<string | null>(null);

  const displayName = profile?.displayName ?? "Rina Putri";
  const username = profile?.username ?? "rinaputri";
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const real = (projectsQuery.data?.pages.flatMap((p) => p.items) ?? []).map(toItem);
  const items: Item[] = real.length ? real : sample;

  const isItemPublic = (item: Item) =>
    item.id in localPublic ? localPublic[item.id] : item.isPublic;

  const publicItems = items.filter(isItemPublic);
  const privateCount = items.length - publicItems.length;

  function handleToggle(item: Item) {
    const next = !isItemPublic(item);
    setLocalPublic((prev) => ({ ...prev, [item.id]: next }));
    setVisibilityBanner(
      `Visibilitas disimpan. ${item.title} kini ${next ? "publik" : "privat"}.`
    );

    if (!item.id.startsWith("sample")) {
      updateProject.mutate({
        id: item.id,
        input: { visibility: next ? "PUBLIC" : "PRIVATE" },
      });
    }
  }

  function handleCopyLink() {
    void navigator.clipboard?.writeText(`${window.location.origin}/p/${username}`);
    setCopiedBanner(true);
    setTimeout(() => setCopiedBanner(false), 3500);
  }

  async function handleShare() {
    const url = `${window.location.origin}/p/${username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Portofolio ${displayName} · Skill Coach`,
          url,
        });
        return;
      } catch {
        // fallback ke copy link
      }
    }
    handleCopyLink();
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
          CERITA KAMU, PILIHAN KAMU
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
          Kelola portofolio
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pilih proyek yang boleh dilihat publik. Perubahan visibilitas hanya berlaku pada proyek
          yang kamu pilih.
        </p>

        {copiedBanner && (
          <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-xs font-medium text-green-900">
            <span className="grid size-5 place-items-center rounded-full border border-green-700 text-green-800">
              <Check className="size-3" />
            </span>
            Link portofolio berhasil disalin. Siap kamu bagikan!
          </div>
        )}
      </div>

      {/* Banner Tautan Publik /p/username */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-[#EFECFA] p-5 sm:flex-row sm:items-center sm:px-7 sm:py-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">/p/{username}</p>
          <p className="mt-1 text-xs text-slate-600">
            {publicItems.length} proyek publik · {privateCount} proyek privat · Email tidak
            ditampilkan
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
          >
            Salin link
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#5044B8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#403598]"
          >
            Bagikan
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </section>

      {/* Main 2-Column Layout */}
      <div className="grid items-start gap-7 lg:grid-cols-12">
        {/* Left Column: Proyek di portofolio kamu (7/12) */}
        <section className="space-y-4 lg:col-span-7">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
            Proyek di portofolio kamu
          </h2>

          {items.map((item) => {
            const isPub = isItemPublic(item);
            return (
              <div key={item.id} className={`${card} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {kindMeta[item.kind].label} · v{item.versionNo} ·{" "}
                      {item.score !== null ? `${item.score.toFixed(1)} / 10` : "Belum dinilai"}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPub}
                    aria-label={`Tampilkan ${item.title} di portofolio publik`}
                    onClick={() => handleToggle(item)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors ${
                      isPub ? "bg-[#5044B8]" : "bg-stone-200"
                    }`}
                  >
                    <span
                      className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
                        isPub ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-3.5">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                      isPub
                        ? "bg-[#EFECFA] text-[#5044B8]"
                        : "bg-stone-200/70 text-slate-700"
                    }`}
                  >
                    {isPub
                      ? "Publik · ditampilkan di portofolio"
                      : "Privat · hanya kamu yang melihat"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {isPub
                    ? "Karya, versi, dan bukti progres dapat dilihat melalui tautan publik."
                    : "Nyalakan visibilitas untuk memasukkan proyek ini ke portofolio publik."}
                </p>
              </div>
            );
          })}

          {/* Security Reminder Card */}
          <div className={`${card} p-6`}>
            <ShieldCheck className="size-5 text-[#5044B8]" strokeWidth={1.75} />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">Periksa sebelum berbagi</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Pastikan file karya tidak memuat informasi pribadi, data klien, atau materi yang
              tidak boleh kamu bagikan. Proyek privat tidak akan muncul pada pratinjau publik.
            </p>
          </div>

          {visibilityBanner && (
            <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-xs font-medium text-green-900">
              <span className="grid size-5 place-items-center rounded-full border border-green-700 text-green-800">
                <Check className="size-3" />
              </span>
              {visibilityBanner}
            </div>
          )}
        </section>

        {/* Right Column: Pratinjau publik (5/12) */}
        <aside className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
              Pratinjau publik
            </h2>
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-[11px] font-medium text-slate-700">
              Tampilan pengunjung
            </span>
          </div>

          <div className={`${card} p-6`}>
            <span className="inline-grid size-8 place-items-center rounded-full bg-[#EFECFA] text-[11px] font-bold text-[#5044B8]">
              {initials || "RP"}
            </span>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              {displayName}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Mahasiswa DKV. Belajar merancang pengalaman digital yang jelas dan hangat.
            </p>

            {publicItems.length > 0 ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(publicItems.map((p) => kindMeta[p.kind].label))).map(
                    (lbl) => (
                      <span
                        key={lbl}
                        className="rounded-full bg-stone-200/70 px-3 py-1 text-[11px] font-medium text-slate-700"
                      >
                        {lbl}
                      </span>
                    )
                  )}
                </div>

                {publicItems.slice(0, 1).map((featured) => (
                  <div key={featured.id} className="space-y-3">
                    {featured.kind === "CODE" ? (
                      <div className="rounded-xl bg-[#1E1D2B] p-4 text-slate-200">
                        <Code2 className="mb-2 size-4 text-indigo-300" />
                        <pre className="font-mono text-[11px] leading-relaxed">
                          {`app.post("/tasks", (req, res) => { ... });`}
                        </pre>
                      </div>
                    ) : featured.kind === "ESSAY" ? (
                      <div className="rounded-xl bg-[#FFF1E5] p-4 text-slate-800">
                        <NotebookPen className="mb-2 size-4 text-[#5044B8]" />
                        <p className="text-xs leading-relaxed">
                          Kota yang ramah memberi ruang bagi setiap orang untuk bergerak dan
                          bertemu.
                        </p>
                      </div>
                    ) : (
                      <CoffeePreview />
                    )}

                    <div>
                      <h4 className="text-base font-semibold text-slate-900">{featured.title}</h4>
                      <p className="mt-1 text-xs font-medium text-green-800">
                        {featured.versions} versi ·{" "}
                        {featured.delta !== null && featured.score !== null
                          ? `${(featured.score - featured.delta).toFixed(1)} → ${featured.score.toFixed(1)} · ▲ naik +${featured.delta.toFixed(1)}`
                          : `${featured.score?.toFixed(1) ?? "7.0"} / 10`}
                      </p>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-slate-500">
                  Hanya {publicItems.length} proyek publik yang ditampilkan.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-stone-50 p-4 text-xs leading-relaxed text-slate-600">
                Belum ada proyek yang diatur menjadi publik. Nyalakan salah satu proyek di sebelah
                kiri untuk menampilkannya di halaman portofolio.
              </div>
            )}
          </div>

          <Link
            to={`/p/${username}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-3 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
          >
            Buka portofolio publik
            <ArrowUpRight className="size-3.5" />
          </Link>

          <p className="text-[11px] leading-relaxed text-slate-500">
            Berbagi menggunakan link publik yang sama. Proyek privat dan email tidak ikut terbagi.
          </p>
        </aside>
      </div>
    </div>
  );
}