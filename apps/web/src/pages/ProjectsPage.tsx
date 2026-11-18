import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Plus, Search, SearchX } from "lucide-react";
import { useProjects, useQuota } from "../api";
import { card } from "../components/landing/shared";
import { ProjectCard, kindMeta, sample, toItem, type Item, type Kind } from "./DashboardPage";

const status = (i: Item) => (i.none ? "none" : i.done ? "done" : "pending");
const statuses = [["all", "Semua status"], ["done", "Review selesai"], ["pending", "Menunggu review"], ["none", "Belum direview"]] as const;
const visibilities = [["all", "Semua visibilitas"], ["public", "Publik"], ["private", "Privat"]] as const;
const sorts = [["recent", "Terbaru diperbarui"], ["score", "Skor tertinggi"], ["title", "Judul A–Z"]] as const;
const sortFns: Record<string, (a: Item, b: Item) => number> = {
  recent: (a, b) => (b.ts ?? 0) - (a.ts ?? 0),
  score: (a, b) => (b.score ?? -1) - (a.score ?? -1),
  title: (a, b) => a.title.localeCompare(b.title, "id"),
};
const field = "w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#5044B8]";

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${field} pr-10`}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      </span>
    </label>
  );
}

export default function ProjectsPage() {
  const projects = useProjects();
  const { data: quota } = useQuota();
  const [q, setQ] = useState(""), [st, setSt] = useState("all"), [vis, setVis] = useState("all"), [kind, setKind] = useState<Kind | "all">("all"), [sort, setSort] = useState("recent");

  const real = (projects.data?.pages.flatMap((p) => p.items) ?? []).map(toItem);
  const all = real.length ? real : sample;
  const needle = q.trim().toLowerCase();
  const base = all.filter((i) =>
    (!needle || `${i.title} ${i.goal ?? ""}`.toLowerCase().includes(needle)) &&
    (st === "all" || status(i) === st) &&
    (vis === "all" || (vis === "public") === i.isPublic));
  const shown = base.filter((i) => kind === "all" || i.kind === kind).sort(sortFns[sort]);
  const pills: [Kind | "all", string][] = [["all", "Semua"], ...(Object.entries(kindMeta) as [Kind, (typeof kindMeta)[Kind]][]).map(([k, m]): [Kind, string] => [k, m.label])];

  const used = quota?.used ?? 3, limit = quota?.limit ?? 10, remaining = quota?.remaining ?? limit - used;
  const reset = quota ? new Date(quota.resetAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "1 Desember 2026";

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">Perpustakaan karyamu</p>
          <h1 className="mb-2 text-4xl font-semibold tracking-[-0.03em]">Setiap proyek, satu perjalanan.</h1>
          <p className="text-sm text-slate-600">Simpan hasil dan revisi di tempat yang sama. Buka proyek untuk melanjutkan prosesmu.</p>
        </div>
        <Link to="/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5044B8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#403598]"><Plus className="size-4" />Buat proyek &amp; unggah</Link>
      </div>

      <section className={`${card} space-y-4 p-6`}>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Cari proyek</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul atau tujuan proyek" className={`${field} pl-11`} />
            </span>
          </label>
          <Select label="Status review" value={st} onChange={setSt} options={statuses} />
          <Select label="Visibilitas" value={vis} onChange={setVis} options={visibilities} />
        </div>
        <div className="flex flex-wrap gap-2">
          {pills.map(([k, label]) => {
            const n = k === "all" ? base.length : base.filter((i) => i.kind === k).length;
            return <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${kind === k ? "bg-[#EFECFA] text-[#5044B8]" : "bg-stone-100 text-slate-700 hover:bg-stone-200"}`}>{label} · {n}</button>;
          })}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{shown.length} proyek</p>
        <label className="relative inline-flex items-center text-xs font-medium text-[#5044B8]">
          <span className="sr-only">Urutkan</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="cursor-pointer appearance-none bg-transparent pr-5 outline-none">{sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <ChevronDown className="pointer-events-none absolute right-0 size-3" />
        </label>
      </div>

      {shown.length === 0 ? (
        <div className={`${card} flex flex-col items-center px-6 py-16 text-center`}>
          <SearchX className="mb-4 size-8 text-[#5044B8]" />
          <h2 className="mb-2 text-lg font-semibold">Belum ada proyek yang cocok</h2>
          <p className="mb-6 max-w-sm text-sm text-slate-600">Coba ubah kata kunci atau filter, atau mulai proyek baru untuk karyamu.</p>
          <button type="button" onClick={() => { setQ(""); setSt("all"); setVis("all"); setKind("all"); }} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50">Reset filter</button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{shown.map((i, n) => <ProjectCard key={i.id || n} item={i} />)}</div>
      )}

      {projects.hasNextPage && (
        <div className="text-center"><button type="button" disabled={projects.isFetchingNextPage} onClick={() => void projects.fetchNextPage()} className="rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50 disabled:opacity-60">Muat lebih banyak</button></div>
      )}

      <section className="rounded-2xl bg-[#EFECFA] p-8">
        <h2 className="mb-3 text-xl font-semibold">Punya revisi untuk karya yang sama?</h2>
        <p className="mb-5 text-sm text-slate-600">Buka proyek yang sudah ada, lalu pilih “Unggah revisi”. Setiap unggahan tersimpan sebagai versi baru, bukan proyek terpisah.</p>
        <p className="text-xs font-medium text-[#5044B8]">{remaining} dari {limit} review tersedia · Reset {reset}</p>
      </section>
    </div>
  );
}
