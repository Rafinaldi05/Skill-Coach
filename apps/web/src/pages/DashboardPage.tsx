import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Globe, LayoutGrid, Lock, Plus, TriangleRight, PanelsTopLeft, Code2, NotebookPen } from "lucide-react";
import type { Project, Version } from "@skill-coach/shared";
import { useProfile, useProgress, useProjects, useQuota } from "../api";
import { CoffeePreview, card } from "../components/landing/shared";

export type Kind = Project["skillType"];
export type Item = { id: string; goal?: string; none?: boolean; ts?: number; kind: Kind; title: string; isPublic: boolean; score: number | null; delta: number | null; versions: number; date: string; done: boolean; versionNo: number };

export const kindMeta: Record<Kind, { label: string; Icon: typeof PanelsTopLeft }> = {
  UI: { label: "Desain UI", Icon: PanelsTopLeft },
  CODE: { label: "Kode", Icon: Code2 },
  ESSAY: { label: "Teks & esai", Icon: NotebookPen },
};
// Fallback sample data so the page matches the design before the API has content.
export const sample: Item[] = [
  { id: "sample-ui", kind: "UI", title: "Landing page toko kopi", isPublic: true, score: 8, delta: 2, versions: 2, date: "6 Nov 2026", done: true, versionNo: 2 },
  { id: "sample-code", kind: "CODE", title: "API daftar tugas", isPublic: false, score: 6.5, delta: null, versions: 1, date: "5 Nov 2026", done: true, versionNo: 1 },
  { id: "sample-essay", kind: "ESSAY", title: "Esai: Kota yang lebih ramah", isPublic: false, score: 6.8, delta: null, versions: 1, date: "5 Nov 2026", done: true, versionNo: 1 },
];
const sampleSeries = [6, 8];
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const avg = (scores?: Record<string, number>) => { const v = Object.values(scores ?? {}); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
const latest = (versions?: Version[]) => versions?.reduce<Version | undefined>((a, b) => (!a || b.versionNumber > a.versionNumber ? b : a), undefined);

export function toItem(p: Project): Item {
  const v = latest(p.versions);
  const score = avg(v?.review?.scores);
  const deltas = Object.values(v?.review?.comparison?.score_delta ?? {});
  return { id: p.id, goal: p.goal ?? p.description ?? "", none: !v, ts: Date.parse(v?.createdAt ?? p.createdAt), kind: p.skillType, title: p.title, isPublic: p.visibility.toUpperCase() === "PUBLIC", score, delta: deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : null, versions: p._count?.versions ?? p.versions?.length ?? 1, date: fmtDate(v?.createdAt ?? p.createdAt), done: v?.status === "done", versionNo: v?.versionNumber ?? 1 };
}

export default function DashboardPage() {
  const { data: profile } = useProfile();
  const { data: quota } = useQuota();
  const projects = useProjects();
  const real = (projects.data?.pages.flatMap((p) => p.items) ?? []).slice(0, 3).map(toItem);
  const items = real.length ? real : sample;
  const usingSample = real.length === 0;

  const uiProject = real.find((i) => i.kind === "UI");
  const progress = useProgress(uiProject?.id ?? "");
  const realSeries = (progress.data ?? []).map((p) => avg(p.scores)).filter((s): s is number => s !== null);
  const series = realSeries.length >= 2 ? realSeries : sampleSeries;
  const first = series[0], last = series[series.length - 1];

  const used = quota?.used ?? 3, limit = quota?.limit ?? 10, remaining = quota?.remaining ?? limit - used;
  const reset = quota ? new Date(quota.resetAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "1 Desember 2026";
  const name = profile?.displayName?.split(" ")[0] ?? "Rina";
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  const next = items[0];
  const activity = items.filter((i) => i.done);
  const hasPublic = items.some((i) => i.isPublic);

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">{today}</p>
          <h1 className="mb-2 text-4xl font-semibold tracking-[-0.03em]">Halo, {name}. Teruskan langkahmu.</h1>
          <p className="text-sm text-slate-600">Revisi kecil hari ini, bekal baru untuk karya berikutnya.</p>
        </div>
        <Link to="/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5044B8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#403598]"><Plus className="size-4" />Unggah karya</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-[#EFECFA] p-8">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">Langkah kecil berikutnya</p>
            <h2 className="mb-4 max-w-xl text-2xl font-semibold leading-snug tracking-[-0.02em]">Karyamu makin jelas. Saatnya menyempurnakan detail.</h2>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-600">Review v{next.versionNo} {next.title} sudah siap. Pertahankan hierarki yang kuat, lalu rapikan jarak antarbagian.</p>
            <Link to={next.id ? `/projects/${next.id}` : "/projects"} className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50">Lanjutkan review v{next.versionNo}<ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className={`${card} p-6`}>
              <p className="mb-4 text-xs text-slate-600">Kuota review bulan ini</p>
              <p className="mb-4 text-3xl font-semibold tracking-[-0.02em]">{remaining} dari {limit} tersisa</p>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#E4E1F4]" role="progressbar" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={remaining}><div className="h-full rounded-full bg-[#5044B8]" style={{ width: `${limit ? Math.min(100, (remaining / limit) * 100) : 0}%` }} /></div>
              <p className="text-xs text-slate-600">{used} digunakan · Reset {reset}</p>
            </div>
            <div className={`${card} p-6`}>
              <p className="mb-4 text-xs text-slate-600">Progres proyek UI</p>
              <p className="mb-4 flex items-center gap-2 text-3xl font-semibold tracking-[-0.02em]"><TriangleRight className="size-7 -rotate-90 fill-current" />{last - first >= 0 ? "+" : ""}{(last - first).toFixed(1)}</p>
              <p className="text-xs leading-relaxed text-slate-600">{first.toFixed(1)} → {last.toFixed(1)} dari v1 ke v{series.length}.</p>
            </div>
          </div>
        </div>

        <div className={`${card} p-6`}>
          {usingSample && <span className="mb-5 inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">Contoh data akun</span>}
          <div className="mb-4 flex items-baseline justify-between"><h2 className="text-base font-semibold">Perjalanan skormu</h2><span className="text-xs text-slate-600">1–10</span></div>
          <ScoreChart series={series} />
          <p className="mb-4 mt-4 text-xs text-slate-600">{uiProject ? uiProject.title : "Landing page toko kopi"}</p>
          <p className="text-xs leading-relaxed text-slate-600">Skor membantu kamu membaca perkembangan, bukan mengejar kesempurnaan.</p>
        </div>
      </div>

      <section>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-semibold tracking-[-0.02em]">Proyek terakhirmu</h2><Link to="/projects" className="inline-flex items-center gap-1 text-xs font-medium text-[#5044B8] hover:underline">Lihat semua<ArrowRight className="size-3" /></Link></div>
        <div className="grid gap-6 md:grid-cols-3">{items.map((i, n) => <ProjectCard key={i.id || n} item={i} />)}</div>
      </section>

      <section className={`${card} p-8`}>
        <h2 className="mb-5 text-xl font-semibold">Aktivitas review</h2>
        {activity.length === 0 ? <p className="text-sm text-slate-600">Belum ada review selesai.</p> : (
          <ul className="divide-y divide-stone-100">{activity.map((i, n) => (
            <li key={i.id || n} className="flex items-center justify-between gap-4 py-3"><div><p className="text-sm font-semibold">{i.title} · v{i.versionNo}</p><p className="text-xs text-slate-600">{i.date}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800"><CheckCircle2 className="size-3" />Selesai</span></li>
          ))}</ul>
        )}
      </section>

      <section className="rounded-2xl bg-[#EFECFA] p-8">
        <LayoutGrid className="mb-4 size-5 text-[#5044B8]" />
        <h2 className="mb-3 text-2xl font-semibold tracking-[-0.02em]">Siapkan cerita portofoliomu</h2>
        <p className="mb-6 text-sm text-slate-600">{hasPublic ? "Satu proyek sudah publik. " : ""}Pilih karya yang memperlihatkan proses dan keputusan terbaikmu.</p>
        <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50">Kelola portofolio<ArrowRight className="size-4" /></Link>
      </section>
    </div>
  );
}

function ScoreChart({ series }: { series: number[] }) {
  const y = (s: number) => 20 + ((10 - s) * 110) / 9;
  const x = (i: number) => (series.length === 1 ? 180 : 50 + (i * 260) / (series.length - 1));
  return (
    <svg viewBox="0 0 360 150" className="w-full" role="img" aria-label={`Grafik skor ${series.map((s, i) => `v${i + 1}: ${s.toFixed(1)}`).join(", ")}`}>
      {[10, 5, 1].map((v) => <g key={v}><line x1="30" x2="330" y1={y(v)} y2={y(v)} stroke="#d8d4ee" /><text x="6" y={y(v) + 4} fontSize="11" fill="#8880b8">{v}</text></g>)}
      <polyline points={series.map((s, i) => `${x(i)},${y(s)}`).join(" ")} fill="none" stroke="#5044b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {series.map((s, i) => <g key={i}><circle cx={x(i)} cy={y(s)} r="4" fill="#5044b8" /><text x={x(i)} y={y(s) + (i === series.length - 1 ? -10 : 22)} fontSize="12" fontWeight="600" fill="#5044b8" textAnchor={i === series.length - 1 ? "end" : "start"}>{s.toFixed(1)} · v{i + 1}</text></g>)}
    </svg>
  );
}

const codeSnippet = `app.post("/tasks", (req, res) => {\n  const task = {\n    title: req.body.title\n  };\n  res.json(task);\n});`;

function Preview({ kind, versionNo }: { kind: Kind; versionNo: number }) {
  if (kind === "CODE") return <div className="h-52 overflow-hidden rounded-lg bg-[#1E1D2B] p-5 text-slate-300"><Code2 className="mb-6 size-4" /><pre className="font-mono text-[10px] leading-relaxed">{codeSnippet}</pre></div>;
  if (kind === "ESSAY") return <div className="h-52 overflow-hidden rounded-lg bg-[#FFF1E5] p-5 text-slate-800"><NotebookPen className="mb-4 size-5" /><p className="text-base leading-relaxed">Kota yang ramah bukan hanya soal jalan yang lebar. Ia memberi ruang bagi setiap orang untuk bergerak.</p></div>;
  return <div className="relative h-52 overflow-hidden rounded-lg"><div className="origin-top-left scale-[0.62]" style={{ width: "161%" }}><CoffeePreview /></div><span className="absolute right-3 top-2 text-[9px] text-[#77796b]">v{versionNo}</span></div>;
}

export function ProjectCard({ item }: { item: Item }) {
  const { label } = kindMeta[item.kind];
  const Vis = item.isPublic ? Globe : Lock;
  return (
    <article className={`${card} flex flex-col p-5`}>
      <Preview kind={item.kind} versionNo={item.versionNo} />
      <div className="mt-4 flex items-center justify-between"><span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-medium text-slate-700">{label}</span><span className="inline-flex items-center gap-1 text-[11px] text-slate-600"><Vis className="size-3" />{item.isPublic ? "Publik" : "Privat"}</span></div>
      <h3 className="mb-4 mt-4 text-lg font-semibold">{item.title}</h3>
      <div className="mb-2 flex items-end justify-between">
        {item.score !== null ? <p className="text-3xl font-semibold tracking-[-0.02em] text-[#5044B8]">{item.score.toFixed(1)}<span className="ml-1 text-xs font-normal text-slate-600">/ 10</span></p> : <span />}
        <p className="text-[11px] text-slate-600">{item.versions} versi · {item.date}</p>
      </div>
      <p className="mb-5 flex items-center gap-1 text-[11px] text-green-800">{item.done ? <><CheckCircle2 className="size-3" />Review selesai</> : <span className="text-slate-600">Review diproses</span>}{item.delta !== null && item.delta > 0 && <><span>·</span><TriangleRight className="size-3 -rotate-90 fill-current" />naik +{item.delta.toFixed(1)}</>}</p>
      <Link to={item.id ? `/projects/${item.id}` : "/projects"} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 py-3 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50">Buka proyek<ArrowRight className="size-4" /></Link>
    </article>
  );
}
