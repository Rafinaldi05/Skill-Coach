import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Copy,
  Maximize2,
  Plus,
  Minus,
  Sparkles,
  X,
} from "lucide-react";
import type { Project, Review, Version } from "@skill-coach/shared";
import { useProfile, useReviewFeedback } from "../../api";
import { CoffeePreview, card } from "../landing/shared";

interface ReviewResultViewProps {
  project?: Project;
  version: Version;
  review: Review;
}

const fmtFullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmtShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const kindUpper: Record<Project["skillType"], string> = {
  UI: "DESAIN UI",
  CODE: "KODE",
  ESSAY: "TEKS & ESAI",
};

const toneLabel: Record<string, string> = {
  FRIENDLY: "Nada ramah",
  STANDARD: "Nada standar",
  BLUNT: "Nada tegas",
};

const levelLabel: Record<string, string> = {
  BEGINNER: "Level pemula",
  INTERMEDIATE: "Level menengah",
  ADVANCED: "Level lanjutan",
};

function ScoreSegments({ value }: { value: number }) {
  const filled = Math.round(Math.max(0, Math.min(10, value)));
  return (
    <div className="mt-2 grid grid-cols-10 gap-1.5" aria-hidden="true">
      {Array.from({ length: 10 }, (_, idx) => (
        <span
          key={idx}
          className={`h-1.5 rounded-full ${
            idx < filled ? "bg-[#5044B8]" : "bg-[#E4E1F4]"
          }`}
        />
      ))}
    </div>
  );
}

function DeltaBadge({ delta, pill = false }: { delta: number; pill?: boolean }) {
  if (delta > 0) {
    return (
      <span
        className={
          pill
            ? "inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800"
            : "inline-flex items-center gap-0.5 text-xs font-semibold text-green-800"
        }
      >
        ▲ naik +{delta.toFixed(pill ? 1 : 0)}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span
        className={
          pill
            ? "inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
            : "inline-flex items-center gap-0.5 text-xs font-semibold text-amber-800"
        }
      >
        ▼ turun {delta.toFixed(pill ? 1 : 0)}
      </span>
    );
  }
  return (
    <span
      className={
        pill
          ? "inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-600"
          : "inline-flex items-center gap-1 text-xs font-semibold text-slate-600"
      }
    >
      • tetap
    </span>
  );
}

function splitSummaryHeadline(summary: string): { headline: string; body: string } {
  const sentences = summary.split(/(?<=\.)\s+/);
  if (sentences.length >= 3) {
    return {
      headline: `${sentences[0]} ${sentences[1]}`,
      body: sentences.slice(2).join(" "),
    };
  }
  if (sentences.length === 2) {
    return { headline: sentences[0], body: sentences[1] };
  }
  return { headline: summary, body: "" };
}

function LeftColumn({
  project,
  version,
  review,
  onZoom,
}: {
  project?: Project;
  version: Version;
  review: Review;
  onZoom: () => void;
}) {
  const kind = project?.skillType ?? "UI";
  const isPublic = project?.visibility?.toUpperCase() === "PUBLIC";
  const goalText =
    project?.goal ??
    project?.description ??
    "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal melalui landing page yang mudah dipahami.";

  if (kind === "CODE") {
    const rawCode =
      version.textContent ??
      `const tasks = [];\n\napp.post("/tasks", (req, res) => {\n  const task = {\n    id: tasks.length + 1,\n    title: req.body.title\n  };\n  tasks.push(task);\n  res.json(task);\n});\n\napp.get("/tasks", (req, res) => {\n  res.json(tasks);\n});`;
    const lines = rawCode.split("\n");

    return (
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl bg-[#1E1D2B] p-5 text-slate-200">
          <p className="mb-4 text-xs text-slate-400">tasks.js · JavaScript</p>
          <div className="overflow-x-auto font-mono text-xs leading-relaxed">
            {lines.map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-5 shrink-0 select-none text-right text-slate-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <pre className="whitespace-pre text-slate-100">{line || " "}</pre>
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} p-5`}>
          <h3 className="text-sm font-semibold text-slate-900">Referensi masukan</h3>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            {review.improvements.map((imp, idx) => (
              <li key={idx}>
                {idx + 1} · {imp.location ? `${imp.location}: ` : ""}
                {imp.title.toLowerCase()}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            tasks.js · 0.8 KB · {isPublic ? "Publik" : "Privat"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#EFECFA] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Tujuan karya</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{goalText}</p>
        </div>
      </div>
    );
  }

  if (kind === "ESSAY") {
    const paragraphs = (
      version.textContent ??
      "Kota yang ramah bukan hanya soal jalan yang lebar. Ia memberi ruang bagi setiap orang untuk bergerak, beristirahat, dan bertemu tanpa merasa tersisih.\n\nSemua orang lebih nyaman berjalan kaki jika trotoarnya diperlebar. Karena itu, pemerintah harus memperlebar semua trotoar agar kota menjadi lebih ramah.\n\nRuang publik juga sangat penting sekali bagi warga. Taman adalah tempat bertemu. Taman juga adalah tempat beristirahat. Taman membuat warga merasa dekat.\n\nMerancang kota berarti memikirkan siapa yang belum mendapat tempat. Kota yang lebih ramah dimulai ketika kebutuhan mereka ikut menjadi dasar keputusan."
    )
      .split(/\n{2,}/)
      .filter(Boolean);

    return (
      <div className="space-y-5">
        <div className={`${card} p-6`}>
          <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            CUPLIKAN NASKAH · v{version.versionNumber}
          </span>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">
            {project?.title ?? "Kota yang lebih ramah"}
          </h3>

          <div className="mt-5 space-y-4">
            {paragraphs.map((para, idx) => {
              const matchedImpIdx = review.improvements.findIndex((imp) =>
                imp.location?.toLowerCase().includes(`paragraf ${idx + 1}`)
              );
              return (
                <div key={idx}>
                  <p className="text-xs font-semibold text-[#5044B8]">
                    Paragraf {idx + 1}
                    {matchedImpIdx >= 0 ? ` · Masukan ${matchedImpIdx + 1}` : ""}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{para}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-600">
          kota-ramah.txt · 2 KB · {isPublic ? "Publik" : "Privat"}
        </p>

        <div className="rounded-2xl bg-[#EFECFA] p-5">
          <h3 className="text-sm font-semibold text-slate-900">Tujuan tulisan</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{goalText}</p>
        </div>
      </div>
    );
  }

  // Default: UI (Frame 11)
  return (
    <div className="space-y-5">
      <div>
        <div className={`${card} p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900">
              Karya kamu · v{version.versionNumber}
            </span>
            <button
              type="button"
              onClick={onZoom}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5044B8] hover:underline"
            >
              <Maximize2 className="size-3.5" />
              Perbesar
            </button>
          </div>

          <div className="relative">
            <CoffeePreview />
            <span
              aria-hidden="true"
              className="absolute right-4 top-20 grid size-7 place-items-center rounded-full bg-[#5044B8] text-xs font-bold text-white shadow"
            >
              1
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-4 grid size-7 place-items-center rounded-full bg-[#5044B8] text-xs font-bold text-white shadow"
            >
              2
            </span>
          </div>
        </div>
        <p className="mt-2.5 text-xs text-slate-600">
          landing-kopi-v{version.versionNumber}.png · 1.9 MB
        </p>
      </div>

      <div className={`${card} p-5`}>
        <h3 className="text-sm font-semibold text-slate-900">Temukan area masukan</h3>
        <ul className="mt-3.5 space-y-2.5 text-xs text-slate-700">
          {review.improvements.map((imp, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#EFECFA] text-[11px] font-bold text-[#5044B8]">
                {idx + 1}
              </span>
              <span className="pt-0.5">{imp.location ?? imp.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-slate-500">
          Nomor pada karya terhubung dengan nomor masukan.
        </p>
      </div>

      <div className="rounded-2xl bg-[#EFECFA] p-5">
        <h3 className="text-sm font-semibold text-slate-900">Tujuan karya</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">{goalText}</p>
      </div>
    </div>
  );
}

export function ReviewResultView({ project, version, review }: ReviewResultViewProps) {
  const { data: profile } = useProfile();
  const feedbackMutation = useReviewFeedback(review.id);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedbackChoice, setFeedbackChoice] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const kind = project?.skillType ?? "UI";
  const projectTitle = project?.title ?? "Landing page toko kopi";
  const projectHref = project?.id ? `/projects/${project.id}` : "/projects";
  const dateFull = fmtFullDate(version.createdAt);

  const scoreEntries = Object.entries(review.scores);
  const avgScore = scoreEntries.length
    ? scoreEntries.reduce((acc, [, val]) => acc + val, 0) / scoreEntries.length
    : 0;

  const scoreDeltas = review.comparison?.score_delta ?? {};
  const deltaValues = Object.values(scoreDeltas);
  const hasComparison = Boolean(review.comparison && deltaValues.length > 0);
  const avgDelta = deltaValues.length
    ? deltaValues.reduce((acc, val) => acc + val, 0) / deltaValues.length
    : null;

  const { headline, body } = splitSummaryHeadline(review.summary);

  const toneText = profile?.critiqueTone
    ? toneLabel[profile.critiqueTone] ?? "Nada ramah"
    : "Nada ramah";
  const levelText = profile?.level ? levelLabel[profile.level] : "Level pemula";

  const stepBadges = [
    { label: "1 · Mulai di sini", cls: "bg-green-50 text-green-800" },
    { label: "2 · Lanjutkan", cls: "bg-[#EFECFA] text-[#5044B8]" },
    { label: "3 · Tutup dengan revisi", cls: "bg-stone-100 text-slate-700" },
  ];

  function handleFeedback(helpful: boolean) {
    setFeedbackChoice(helpful);
    if (!review.id.startsWith("sample-")) {
      feedbackMutation.mutate({ helpful });
    }
  }

  function handleCopyCode(text: string) {
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb & Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
            <span className="text-slate-700">Review v{version.versionNumber}</span>
          </nav>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
            {kindUpper[kind]} · V{version.versionNumber} · {dateFull.toUpperCase()}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
            {projectTitle}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
              ✓ Review selesai
            </span>
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-medium text-slate-700">
              {kind === "CODE"
                ? `JavaScript · ${toneText}`
                : kind === "ESSAY"
                  ? toneText
                  : `${toneText} · ${levelText}`}
            </span>
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-medium text-slate-700">
              {hasComparison
                ? `Dibandingkan v${Math.max(1, version.versionNumber - 1)} · ${fmtShortDate(version.createdAt)}`
                : "Versi pertama · Tanpa perbandingan"}
            </span>
          </div>
        </div>

        <Link
          to={projectHref}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-lg bg-[#5044B8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#403598]"
        >
          Unggah revisi
        </Link>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-5">
          <LeftColumn
            project={project}
            version={version}
            review={review}
            onZoom={() => setZoomOpen(true)}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8 lg:col-span-7">
          {/* 1. Catatan Mentor Kamu */}
          <section className="rounded-2xl bg-[#EFECFA] p-6 sm:p-8">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
              {kind === "UI" && <Sparkles className="size-3.5" />}
              CATATAN MENTOR KAMU
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-[-0.02em] text-slate-900">
              {headline}
            </h2>
            {body && <p className="mt-3 text-sm leading-relaxed text-slate-700">{body}</p>}
          </section>

          {/* 2. Skor & Perkembangan */}
          <section>
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              {hasComparison ? "Skor & perkembangan" : "Skor karyamu"}
            </h2>
            <div className={`${card} p-6 sm:p-7`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-4xl font-semibold tracking-[-0.03em] text-slate-900">
                    {avgScore.toFixed(1)}
                    <span className="ml-1.5 text-sm font-normal text-slate-500">/ 10</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Rata-rata kriteria</p>
                </div>

                {hasComparison && avgDelta !== null ? (
                  <DeltaBadge delta={avgDelta} pill />
                ) : (
                  <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-medium text-slate-700">
                    Versi pertama
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {scoreEntries.map(([criterion, val]) => {
                  const itemDelta = scoreDeltas[criterion];
                  return (
                    <div key={criterion}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800">{criterion}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#5044B8]">{val}/10</span>
                          {hasComparison && typeof itemDelta === "number" && (
                            <DeltaBadge delta={itemDelta} />
                          )}
                        </div>
                      </div>
                      <ScoreSegments value={val} />
                    </div>
                  );
                })}
              </div>

              {hasComparison && (
                <p className="mt-5 border-t border-stone-100 pt-4 text-xs text-slate-600">
                  Dibandingkan v{Math.max(1, version.versionNumber - 1)} · {dateFull}
                </p>
              )}
            </div>

            <p className="mt-2.5 text-xs text-slate-500">
              {hasComparison
                ? "Skala 1–10 per kriteria. ▲ naik, ▼ turun, • tetap menunjukkan perubahan terhadap versi sebelumnya."
                : "Skala 1–10. Ini v1; perkembangan akan terlihat setelah kamu mengunggah revisi."}
            </p>
          </section>

          {/* 3. Kekuatan */}
          <section>
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              {kind === "UI" ? "Yang sudah kamu lakukan dengan baik" : "Yang sudah kuat"}
            </h2>
            <div className="space-y-4">
              {review.strengths.map((item, idx) => {
                const { headline: sTitle, body: sDesc } = splitSummaryHeadline(item);
                return (
                  <div key={idx} className={`${card} p-6`}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                      ✓ Kekuatan {idx + 1}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{sTitle}</h3>
                    {sDesc && (
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{sDesc}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Prioritas Perbaikan */}
          <section>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
              {kind === "UI" ? "Ruang untuk versi berikutnya" : "Prioritas perbaikan"}
            </h2>
            {kind === "UI" && (
              <p className="mt-1 text-sm text-slate-600">
                Fokus pada dua detail ini dulu. Kamu tidak perlu mengubah semuanya sekaligus.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {review.improvements.map((imp, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="space-y-4">
                    <div
                      className={`${card} overflow-hidden transition ${
                        isOpen ? "border-l-4 border-l-amber-400" : ""
                      }`}
                    >
                      {isOpen ? (
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                              {idx + 1} · Prioritas perbaikan
                            </span>
                            <button
                              type="button"
                              aria-label="Tutup detail perbaikan"
                              onClick={() => setOpenIndex(null)}
                              className="rounded-lg p-1 text-slate-500 hover:bg-stone-100"
                            >
                              <Minus className="size-4" />
                            </button>
                          </div>

                          <h3 className="mt-3.5 text-lg font-semibold text-slate-900">
                            {imp.title}
                          </h3>
                          {imp.location && (
                            <p className="mt-1 text-xs text-slate-500">{imp.location}</p>
                          )}

                          <div className="mt-5 space-y-4 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-[#5044B8]">Masalah</p>
                              <p className="mt-1 leading-relaxed text-slate-700">{imp.problem}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#5044B8]">
                                Mengapa penting
                              </p>
                              <p className="mt-1 leading-relaxed text-slate-700">
                                {imp.why_it_matters}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#5044B8]">
                                Contoh perbaikan
                              </p>
                              <p className="mt-1 leading-relaxed text-slate-700">
                                {imp.example_fix}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenIndex(idx)}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-stone-50/60"
                        >
                          <div className="flex items-start gap-3.5">
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#EFECFA] text-xs font-bold text-[#5044B8]">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{imp.title}</p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {imp.location ? `${imp.location} · ` : ""}Masalah / Mengapa
                                penting / Contoh perbaikan
                              </p>
                            </div>
                          </div>
                          <Plus className="size-5 shrink-0 text-[#5044B8]" />
                        </button>
                      )}
                    </div>

                    {/* Code Example Snippet for CODE (Frame 12) */}
                    {isOpen && idx === 0 && kind === "CODE" && (
                      <div className="overflow-hidden rounded-2xl bg-[#1E1D2B] p-5 text-slate-100">
                        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                          <span>Contoh perbaikan · JavaScript</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyCode(
                                `const title = req.body.title;\nif (typeof title !== "string" || !title.trim()) {\n  return res.status(400).json({ error: "Judul wajib diisi" });\n}\nconst task = {\n  id: crypto.randomUUID(),\n  title: title.trim()\n};\ntasks.push(task);\nres.status(201).json(task);`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-300 hover:bg-white/10"
                          >
                            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                            {copied ? "Tersalin" : "Salin"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-slate-100">
{`const title = req.body.title;
if (typeof title !== "string"
    || !title.trim()) {
  return res.status(400).json({
    error: "Judul wajib diisi"
  });
}
const task = {
  id: crypto.randomUUID(),
  title: title.trim()
};
tasks.push(task);
res.status(201).json(task);`}
                        </pre>
                      </div>
                    )}

                    {/* Rewrite Example Box for ESSAY (Frame 13) */}
                    {isOpen && idx === 0 && kind === "ESSAY" && (
                      <div className="rounded-2xl bg-[#EFECFA] p-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
                          CONTOH PENULISAN ULANG · PARAGRAF 3
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-800">
                          “Taman memberi warga ruang untuk bertemu dan beristirahat. Ketika mudah
                          diakses dan nyaman digunakan, ruang ini membuka kesempatan interaksi yang
                          lebih dekat.”
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          Contoh redaksi, bukan temuan penelitian. Cocokkan kembali dengan maksud
                          tulisan kamu.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Tiga Langkah Berikutnya */}
          <section>
            <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              Tiga langkah berikutnya
            </h2>
            <div className="space-y-3">
              {review.nextSteps.map((stepText, idx) => {
                const badge = stepBadges[idx] ?? stepBadges[2];
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 ${
                      idx === 1
                        ? "bg-[#EFECFA]"
                        : "border border-stone-200/80 bg-white"
                    }`}
                  >
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{stepText}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. Review ini berguna? */}
          <section className={`${card} p-6`}>
            <h3 className="text-sm font-semibold text-slate-900">Review ini berguna?</h3>
            <div className="mt-3.5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  feedbackChoice === true
                    ? "border-[#5044B8] bg-[#EFECFA] text-[#5044B8]"
                    : "border-stone-200 bg-white text-[#5044B8] hover:bg-indigo-50"
                }`}
              >
                Ya, membantu
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                  feedbackChoice === false
                    ? "border-[#5044B8] bg-[#EFECFA] text-[#5044B8]"
                    : "border-stone-200 bg-white text-[#5044B8] hover:bg-indigo-50"
                }`}
              >
                Belum membantu
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {feedbackChoice !== null
                ? "Terima kasih! Tanggapan kamu sudah tercatat."
                : "Tanggapan kamu membantu meningkatkan kualitas masukan."}
            </p>
          </section>

          {/* 7. Bottom CTA Card */}
          <section className="rounded-2xl bg-[#EFECFA] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              Siap merevisi? Unggah versi berikutnya.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Terapkan satu perbaikan dulu. Progres tumbuh dari langkah kecil yang kamu ulang.
            </p>
            <Link
              to={projectHref}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#5044B8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#403598]"
            >
              Unggah revisi
            </Link>
          </section>

          <p className="text-xs text-slate-500">
            Review dibuat oleh AI dan bisa keliru. Gunakan sebagai bahan pertimbangan, bukan
            keputusan akhir.
          </p>
        </div>
      </div>

      {/* Modal Perbesar Karya (UI) */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                Karya kamu · v{version.versionNumber}
              </p>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-stone-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <CoffeePreview />
          </div>
        </div>
      )}
    </div>
  );
}