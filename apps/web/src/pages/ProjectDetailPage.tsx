import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  Code2,
  Globe,
  Lock,
  NotebookPen,
  Pencil,
  UploadCloud,
  X,
} from "lucide-react";
import type { Project, Version } from "@skill-coach/shared";
import {
  useCreateVersion,
  useProgress,
  useProjects,
  useQuota,
  useUpdateProject,
} from "../api";
import { CoffeePreview, card } from "../components/landing/shared";

const ACCEPT = ".png,.jpg,.jpeg,.webp,.js,.py,.html,.css,.txt,.md,.pdf";
const MAX_BYTES = 5 * 1024 * 1024;

const kindUpper: Record<Project["skillType"], string> = {
  UI: "DESAIN UI",
  CODE: "KODE",
  ESSAY: "TEKS & ESAI",
};

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
  });

const avgScores = (scores?: Record<string, number>) => {
  const vals = Object.values(scores ?? {});
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
};

const sampleProjectsMap: Record<
  string,
  {
    project: Project;
    versions: (Version & { note: string; sampleScore: number })[];
    nextFocusTitle: string;
    nextFocusDesc: string;
    sampleKindKey: "ui" | "code" | "essay";
  }
> = {
  "sample-ui": {
    sampleKindKey: "ui",
    nextFocusTitle: "Ritme jarak",
    nextFocusDesc: "Dekatkan CTA dengan konteks dan samakan jarak pada keunggulan.",
    project: {
      id: "sample-ui",
      userId: "",
      title: "Landing page toko kopi",
      description:
        "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal melalui landing page yang mudah dipahami.",
      goal:
        "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal melalui landing page yang mudah dipahami.",
      skillType: "UI",
      visibility: "PUBLIC",
      createdAt: "2026-11-04T08:00:00.000Z",
    },
    versions: [
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
        note: "Kontras diperjelas, CTA lebih spesifik.",
        sampleScore: 8.0,
      },
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
        note: "Eksplorasi awal identitas dan tata letak.",
        sampleScore: 6.0,
      },
    ],
  },
  "sample-code": {
    sampleKindKey: "code",
    nextFocusTitle: "Validasi input",
    nextFocusDesc: "Tolak judul kosong sebelum menyimpan dan gunakan ID unik.",
    project: {
      id: "sample-code",
      userId: "",
      title: "API daftar tugas",
      description:
        "Membuat API sederhana untuk menyimpan dan membaca daftar tugas sebagai latihan dasar backend.",
      goal:
        "Membuat API sederhana untuk menyimpan dan membaca daftar tugas sebagai latihan dasar backend.",
      skillType: "CODE",
      visibility: "PRIVATE",
      createdAt: "2026-11-05T08:00:00.000Z",
    },
    versions: [
      {
        id: "sample-v1-code",
        projectId: "sample-code",
        versionNumber: 1,
        fileKey: "tasks.js",
        fileType: "text/plain",
        textContent: `app.post("/tasks", (req, res) => {\n  const task = {\n    title: req.body.title\n  };\n  res.json(task);\n});`,
        status: "done",
        errorMessage: null,
        createdAt: "2026-11-05T08:00:00.000Z",
        note: "Implementasi awal endpoint POST dan GET /tasks.",
        sampleScore: 6.5,
      },
    ],
  },
  "sample-essay": {
    sampleKindKey: "essay",
    nextFocusTitle: "Penguatan bukti",
    nextFocusDesc: "Batasi klaim paragraf 2 dan pangkas pengulangan di paragraf 3.",
    project: {
      id: "sample-essay",
      userId: "",
      title: "Esai: Kota yang lebih ramah",
      description:
        "Mengajak pembaca memahami pentingnya kota yang inklusif melalui esai opini untuk majalah kampus.",
      goal:
        "Mengajak pembaca memahami pentingnya kota yang inklusif melalui esai opini untuk majalah kampus.",
      skillType: "ESSAY",
      visibility: "PRIVATE",
      createdAt: "2026-11-05T08:00:00.000Z",
    },
    versions: [
      {
        id: "sample-v1-essay",
        projectId: "sample-essay",
        versionNumber: 1,
        fileKey: "kota-ramah.txt",
        fileType: "text/plain",
        textContent:
          "Kota yang ramah bukan hanya soal jalan yang lebar. Ia memberi ruang bagi setiap orang untuk bergerak, beristirahat, dan bertemu tanpa merasa tersisih.",
        status: "done",
        errorMessage: null,
        createdAt: "2026-11-05T08:00:00.000Z",
        note: "Draf pertama esai opini kota inklusif.",
        sampleScore: 6.8,
      },
    ],
  },
};

function ProgressLineChart({
  points,
  title,
}: {
  points: { versionNumber: number; score: number; dateLabel: string }[];
  title: string;
}) {
  const y = (s: number) => 24 + ((10 - s) * 105) / 9;
  const x = (i: number) =>
    points.length <= 1 ? 180 : 60 + (i * 250) / (points.length - 1);

  const firstDate = points[0]?.dateLabel ?? "4 Nov";
  const lastDate = points[points.length - 1]?.dateLabel ?? "6 Nov 2026";

  return (
    <div>
      <svg
        viewBox="0 0 380 155"
        className="w-full"
        role="img"
        aria-label={`Grafik perjalanan skor ${title}`}
      >
        {[10, 5, 1].map((v) => (
          <g key={v}>
            <line x1="36" x2="355" y1={y(v)} y2={y(v)} stroke="#e7e5e4" />
            <text x="10" y={y(v) + 4} fontSize="11" fill="#78716c">
              {v}
            </text>
          </g>
        ))}

        {points.length >= 2 && (
          <polyline
            points={points.map((p, i) => `${x(i)},${y(p.score)}`).join(" ")}
            fill="none"
            stroke="#5044b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          return (
            <g key={p.versionNumber}>
              <circle cx={x(i)} cy={y(p.score)} r="3.5" fill="#5044b8" />
              <text
                x={x(i)}
                y={isLast && points.length > 1 ? y(p.score) - 10 : y(p.score) + 20}
                fontSize="11"
                fontWeight="600"
                fill="#5044b8"
                textAnchor={isLast && points.length > 1 ? "end" : "start"}
              >
                {p.score.toFixed(1)} · v{p.versionNumber}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-2 text-xs text-slate-500">
        {points.length >= 2 ? `${firstDate} → ${lastDate}` : lastDate} · {title}
      </p>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id = "sample-ui" } = useParams();
  const navigate = useNavigate();
  const projectsQuery = useProjects();
  const { data: quota } = useQuota();
  const isSample = id.startsWith("sample") || id === "demo";
  const sampleKey = id in sampleProjectsMap ? id : "sample-ui";
  const sampleBundle = sampleProjectsMap[sampleKey];

  const realProject = projectsQuery.data?.pages
    .flatMap((p) => p.items)
    .find((p) => p.id === id);

  const project = isSample ? sampleBundle.project : realProject;
  const progressQuery = useProgress(isSample ? "" : id);
  const createVersion = useCreateVersion(isSample ? "" : id);
  const updateProject = useUpdateProject();

  // State UI
  const [localVis, setLocalVis] = useState<"PUBLIC" | "PRIVATE" | null>(null);
  const [visMenuOpen, setVisMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [localTitle, setLocalTitle] = useState<string | null>(null);
  const [localGoal, setLocalGoal] = useState<string | null>(null);

  // State Form Unggah Revisi
  const [revisionOpen, setRevisionOpen] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [codeText, setCodeText] = useState("");
  const [essayText, setEssayText] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSample && projectsQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-slate-600">
        Memuat detail proyek...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-slate-600">
        Proyek tidak ditemukan.{" "}
        <Link to="/projects" className="font-semibold text-[#5044B8] hover:underline">
          Kembali ke daftar proyek
        </Link>
      </div>
    );
  }

  const displayTitle = localTitle ?? project.title;
  const displayGoal =
    localGoal ??
    project.goal ??
    project.description ??
    "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal melalui landing page yang mudah dipahami.";
  const isPublic =
    (localVis ?? project.visibility.toUpperCase()) === "PUBLIC";

  // Gabungkan daftar versi (real vs sample)
  const versionsList = isSample
    ? sampleBundle.versions
    : [...(project.versions ?? [])]
        .sort((a, b) => b.versionNumber - a.versionNumber)
        .map((v) => ({
          ...v,
          note: v.review?.summary.split(".")[0]
            ? `${v.review.summary.split(".")[0]}.`
            : `Unggahan versi v${v.versionNumber}`,
          sampleScore: avgScores(v.review?.scores) ?? 0,
        }));

  const latestVersion = versionsList[0];
  const nextVersionNo = (latestVersion?.versionNumber ?? 0) + 1;
  const currentScore = latestVersion?.sampleScore ?? null;
  const prevVersion = versionsList[1];
  const scoreDiff =
    currentScore !== null && prevVersion
      ? currentScore - prevVersion.sampleScore
      : null;

  const focusTitle = isSample
    ? sampleBundle.nextFocusTitle
    : latestVersion?.review?.improvements?.[0]?.title ?? "Penyempurnaan detail";
  const focusDesc = isSample
    ? sampleBundle.nextFocusDesc
    : latestVersion?.review?.improvements?.[0]?.problem ??
      "Terapkan satu perbaikan prioritas dari review terakhir sebelum mengunggah versi baru.";

  // Data grafik
  const chartPoints = isSample
    ? [...sampleBundle.versions]
        .reverse()
        .map((v) => ({
          versionNumber: v.versionNumber,
          score: v.sampleScore,
          dateLabel:
            v.versionNumber === sampleBundle.versions[0]?.versionNumber
              ? fmtFullDate(v.createdAt)
              : fmtShortDate(v.createdAt),
        }))
    : (progressQuery.data ?? [])
        .map((p) => ({
          versionNumber: p.versionNumber,
          score: avgScores(p.scores) ?? 0,
          dateLabel: fmtFullDate(p.createdAt),
        }))
        .filter((p) => p.score > 0);

  const remaining = quota?.remaining ?? 7;

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setFormError("Ukuran file maksimal 5 MB.");
      return;
    }
    setFormError("");
    setFile(f);
  }

  function handleChangeVisibility(nextVis: "PUBLIC" | "PRIVATE") {
    setLocalVis(nextVis);
    setVisMenuOpen(false);
    if (!isSample) {
      updateProject.mutate({ id: project!.id, input: { visibility: nextVis } });
    }
  }

  function openEditModal() {
    setEditTitle(displayTitle);
    setEditGoal(displayGoal);
    setEditOpen(true);
  }

  function saveProjectDetail(e: React.FormEvent) {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setLocalTitle(editTitle.trim());
    setLocalGoal(editGoal.trim());
    setEditOpen(false);
    if (!isSample) {
      updateProject.mutate({
        id: project!.id,
        input: {
          title: editTitle.trim(),
          description: editGoal.trim() || null,
          goal: editGoal.trim() || null,
        },
      });
    }
  }

  async function handleSubmitRevision(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const hasInput =
      project!.skillType === "UI"
        ? Boolean(file)
        : project!.skillType === "CODE"
          ? Boolean(file || codeText.trim())
          : Boolean(file || essayText.trim());

    if (!hasInput) {
      setFormError("Lengkapi karya revisi terlebih dahulu sebelum meminta review.");
      return;
    }

    if (isSample) {
      navigate(`/projects/${project!.id}/versions/sample?status=processing`);
      return;
    }

    try {
      const content = file
        ? file.type.startsWith("image/")
          ? `[file] ${file.name}${changeNote ? `\nCatatan: ${changeNote}` : ""}`
          : await file.text()
        : project!.skillType === "CODE"
          ? codeText
          : essayText;

      const created = await createVersion.mutateAsync({ textContent: content });
      navigate(`/projects/${project!.id}/versions/${created.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal mengunggah revisi.");
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600">
            <Link to="/projects" className="hover:text-[#5044B8]">
              Proyek
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700">{displayTitle}</span>
          </nav>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
            {kindUpper[project.skillType]} · DIBUAT {fmtFullDate(project.createdAt).toUpperCase()}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
            {displayTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{displayGoal}</p>

          {/* Status Pills & Visibility Dropdown */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFECFA] px-3 py-1 text-xs font-semibold text-[#5044B8]">
              {isPublic ? <Globe className="size-3.5" /> : <Lock className="size-3.5" />}
              {isPublic ? "Publik" : "Privat"}
            </span>
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-xs font-medium text-slate-700">
              {versionsList.length} versi
            </span>
            {latestVersion && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                ✓ Review v{latestVersion.versionNumber} selesai
              </span>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setVisMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
              >
                Ubah visibilitas
                <ChevronDown className="size-3.5" />
              </button>

              {visMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleChangeVisibility("PUBLIC")}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-stone-50"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="size-3.5 text-[#5044B8]" /> Publik
                    </span>
                    {isPublic && <Check className="size-3.5 text-[#5044B8]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeVisibility("PRIVATE")}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-stone-50"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="size-3.5 text-slate-500" /> Privat
                    </span>
                    {!isPublic && <Check className="size-3.5 text-[#5044B8]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openEditModal}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
        >
          Edit detail
          <Pencil className="size-3.5" />
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column (7/12) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Karya Preview */}
          {project.skillType === "CODE" ? (
            <div className="overflow-hidden rounded-2xl bg-[#1E1D2B] p-6 text-slate-200">
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                <Code2 className="size-4 text-indigo-300" />
                <span>tasks.js · v{latestVersion?.versionNumber ?? 1}</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed">
                {latestVersion?.textContent ??
                  `app.post("/tasks", (req, res) => {\n  const task = {\n    title: req.body.title\n  };\n  res.json(task);\n});`}
              </pre>
            </div>
          ) : project.skillType === "ESSAY" ? (
            <div className="overflow-hidden rounded-2xl bg-[#FFF1E5] p-6 text-slate-800">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                <NotebookPen className="size-4 text-[#5044B8]" />
                <span>Cuplikan naskah · v{latestVersion?.versionNumber ?? 1}</span>
              </div>
              <p className="text-base leading-relaxed">
                {latestVersion?.textContent ??
                  "Kota yang ramah bukan hanya soal jalan yang lebar. Ia memberi ruang bagi setiap orang untuk bergerak."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl">
              <CoffeePreview />
            </div>
          )}

          {/* 2 Summary Cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className={`${card} p-6`}>
              <p className="text-xs text-slate-500">Skor terkini</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-slate-900">
                {currentScore !== null ? currentScore.toFixed(1) : "—"}
                <span className="ml-1.5 text-sm font-normal text-slate-500">/ 10</span>
              </p>
              {scoreDiff !== null ? (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                  {scoreDiff >= 0 ? `▲ naik +${scoreDiff.toFixed(1)}` : `▼ turun ${scoreDiff.toFixed(1)}`}{" "}
                  dari v{prevVersion?.versionNumber ?? 1}
                </span>
              ) : (
                <span className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Versi pertama
                </span>
              )}
            </div>

            <div className={`${card} p-6`}>
              <p className="text-xs text-slate-500">Fokus perbaikan selanjutnya</p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-slate-900">
                {focusTitle}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{focusDesc}</p>
            </div>
          </div>

          {/* Perjalanan Skormu Chart */}
          <section className={`${card} p-6 sm:p-7`}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-slate-900">Perjalanan skormu</h2>
              <span className="text-xs text-slate-500">1–10</span>
            </div>
            <ProgressLineChart
              points={
                chartPoints.length
                  ? chartPoints
                  : [{ versionNumber: 1, score: currentScore ?? 7.0, dateLabel: fmtFullDate(project.createdAt) }]
              }
              title={displayTitle}
            />
          </section>

          {/* Riwayat Versi */}
          <section className={`${card} p-6 sm:p-7`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                Riwayat versi
              </h2>
              <Link
                to={`/projects/${project.id}/compare`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
              >
                Bandingkan versi →
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {versionsList.map((v) => {
                const reviewHref = isSample
                  ? `/projects/${project.id}/versions/sample?kind=${sampleBundle.sampleKindKey}`
                  : `/projects/${project.id}/versions/${v.id}`;

                return (
                  <div
                    key={v.id}
                    className="flex items-start justify-between gap-4 rounded-xl bg-[#FAF8F5] p-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#EFECFA] text-xs font-bold text-[#5044B8]">
                        v{v.versionNumber}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {fmtFullDate(v.createdAt)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">{v.note}</p>
                        <Link
                          to={reviewHref}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:underline"
                        >
                          {v.status === "done"
                            ? "✓ Review selesai · Lihat review →"
                            : "Review diproses · Lihat status →"}
                        </Link>
                      </div>
                    </div>

                    {v.sampleScore > 0 && (
                      <span className="text-lg font-semibold text-[#5044B8]">
                        {v.sampleScore.toFixed(1)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Setiap versi menyimpan satu karya dan satu review. Versi lama tetap bisa kamu buka.
            </p>
          </section>
        </div>

        {/* Right Column: Unggah Revisi Form & Info Card (5/12) */}
        <aside className="space-y-5 lg:col-span-5 lg:sticky lg:top-8">
          {revisionOpen ? (
            <form onSubmit={handleSubmitRevision} className={`${card} p-6 sm:p-7`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                  Unggah revisi · v{nextVersionNo}
                </h2>
                <button
                  type="button"
                  aria-label="Tutup form revisi"
                  onClick={() => setRevisionOpen(false)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-stone-100"
                >
                  <X className="size-4" />
                </button>
              </div>

              <span className="mt-3 inline-block rounded-full bg-stone-200/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                PROYEK YANG SAMA
              </span>

              <p className="mt-3 text-sm font-semibold text-slate-900">{displayTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Tidak perlu membuat proyek baru. Unggahan ini akan menjadi v{nextVersionNo} dan
                tetap menyimpan riwayat{" "}
                {versionsList.length >= 2
                  ? `v1 serta v${versionsList[0].versionNumber}`
                  : "v1"}
                .
              </p>

              {/* Input berdasarkan bidang karya */}
              {project.skillType === "UI" ? (
                <div className="mt-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault();
                      pickFile(e.dataTransfer.files[0]);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-[#B9B2E6] bg-[#FAF9FF] px-5 py-7 text-center transition hover:border-[#5044B8]"
                  >
                    <UploadCloud className="mx-auto size-7 text-[#5044B8]" strokeWidth={1.75} />
                    <p className="mt-2.5 text-xs font-medium text-slate-700">
                      Tarik file ke sini atau pilih dari perangkat kamu.
                    </p>
                    <span className="mt-3.5 inline-block rounded-lg bg-[#EFECFA] px-5 py-2 text-xs font-semibold text-[#5044B8]">
                      Pilih file
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT}
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                  <p className="mt-2 text-[11px] text-slate-500">
                    PNG, JPG, WEBP · Maksimal 5 MB
                  </p>
                  {file && (
                    <div className="mt-2.5 flex items-center justify-between rounded-lg bg-stone-100 px-3 py-2 text-xs">
                      <span className="truncate font-medium text-slate-800">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="ml-2 text-slate-500 hover:text-red-600"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : project.skillType === "CODE" ? (
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                    Kode revisi v{nextVersionNo}
                  </label>
                  <textarea
                    rows={5}
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value)}
                    placeholder="// Tempel kode revisi kamu di sini..."
                    className="w-full rounded-xl bg-[#1E1D2B] p-3.5 font-mono text-xs text-stone-100 outline-none"
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                    Naskah revisi v{nextVersionNo}
                  </label>
                  <textarea
                    rows={5}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    placeholder="Tempel naskah revisi kamu di sini..."
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF9F6] p-3.5 text-xs leading-relaxed outline-none focus:border-[#5044B8]"
                  />
                </div>
              )}

              <div className="mt-4">
                <label
                  htmlFor="change-note"
                  className="mb-1.5 block text-xs font-semibold text-slate-900"
                >
                  Catatan perubahan
                </label>
                <textarea
                  id="change-note"
                  rows={2}
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  placeholder="Jarak hero dirapikan dan ritme bagian keunggulan disamakan."
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 outline-none focus:border-[#5044B8]"
                />
              </div>

              {formError && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {formError}
                </p>
              )}

              <p className="mt-4 text-xs leading-relaxed text-[#5044B8]">
                {remaining} review tersisa. Kuota digunakan setelah review berhasil.
              </p>

              <div className="mt-4 space-y-2.5">
                <button
                  type="submit"
                  disabled={createVersion.isPending}
                  className="w-full rounded-lg bg-[#5044B8] px-4 py-3 text-sm font-semibold text-white hover:bg-[#403598] disabled:opacity-60"
                >
                  {createVersion.isPending
                    ? "Mengunggah..."
                    : `Unggah v${nextVersionNo} & minta review`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setCodeText("");
                    setEssayText("");
                    setChangeNote("");
                    setFormError("");
                  }}
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className={`${card} p-6`}>
              <h2 className="text-base font-semibold text-slate-900">Siap mengunggah revisi?</h2>
              <p className="mt-1.5 text-xs text-slate-600">
                Tambahkan v{nextVersionNo} ke proyek ini untuk melihat perkembangan skormu.
              </p>
              <button
                type="button"
                onClick={() => setRevisionOpen(true)}
                className="mt-4 w-full rounded-lg bg-[#5044B8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#403598]"
              >
                Unggah revisi · v{nextVersionNo}
              </button>
            </div>
          )}

          {/* Info Card: Pertahankan tujuan proyek */}
          <div className="rounded-2xl bg-[#EFECFA] p-6">
            <h3 className="text-sm font-semibold text-slate-900">Pertahankan tujuan proyek</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Bandingkan kualitas versi, bukan mengganti seluruh arah karya. Catatan perubahan
              membantu kamu mengingat keputusan yang diambil.
            </p>
          </div>
        </aside>
      </div>

      {/* Modal Edit Detail Proyek */}
      {editOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditOpen(false)}
        >
          <form
            onSubmit={saveProjectDetail}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Edit detail proyek</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-stone-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Judul proyek
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5044B8]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-800">
                  Tujuan proyek
                </label>
                <textarea
                  rows={3}
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5044B8]"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#5044B8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#403598]"
              >
                Simpan perubahan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}