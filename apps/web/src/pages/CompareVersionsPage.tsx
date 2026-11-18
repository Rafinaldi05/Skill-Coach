import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, Code2, NotebookPen } from "lucide-react";
import type { Project, Version } from "@skill-coach/shared";
import { useProjects } from "../api";
import { CoffeePreview, card } from "../components/landing/shared";

interface ComparableVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  caption: string;
  textContent: string | null;
  scores: Record<string, number>;
  strengths: string[];
  nextFocus: string;
}

const fmtFullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const avgScores = (scores: Record<string, number>) => {
  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
};

const sampleCompareData: Record<
  string,
  { project: Project; versions: ComparableVersion[]; sampleKind: "ui" | "code" | "essay" }
> = {
  "sample-ui": {
    sampleKind: "ui",
    project: {
      id: "sample-ui",
      userId: "",
      title: "Landing page toko kopi",
      description: "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal.",
      goal: "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal.",
      skillType: "UI",
      visibility: "PUBLIC",
      createdAt: "2026-11-04T08:00:00.000Z",
    },
    versions: [
      {
        id: "sample-v1-ui",
        versionNumber: 1,
        createdAt: "2026-11-04T08:00:00.000Z",
        caption: "CTA “Klik di sini” masih umum. Kontras dan hierarki visual belum mendukung fokus utama.",
        textContent: null,
        scores: {
          "Hierarki visual": 6,
          Konsistensi: 7,
          Aksesibilitas: 5,
          "Kejelasan CTA": 6,
        },
        strengths: ["Identitas visual kedai kopi sudah terasa hangat dan ramah."],
        nextFocus: "Perjelas ukuran judul utama dan kontras tombol CTA.",
      },
      {
        id: "sample-v2-ui",
        versionNumber: 2,
        createdAt: "2026-11-06T08:00:00.000Z",
        caption: "CTA “Lihat menu kopi” lebih spesifik. Teks lebih terbaca dan judul menjadi titik fokus.",
        textContent: null,
        scores: {
          "Hierarki visual": 8,
          Konsistensi: 8,
          Aksesibilitas: 8,
          "Kejelasan CTA": 8,
        },
        strengths: [
          "Judul lebih tegas, satu CTA utama, serta warna teks yang lebih gelap. Ketiganya mendukung tujuan awal: membantu pengunjung menemukan menu.",
        ],
        nextFocus:
          "Rapikan jarak deskripsi ke tombol dan samakan ritme antarbagian. Tidak perlu mengubah identitas visual yang sudah konsisten.",
      },
    ],
  },
  "sample-code": {
    sampleKind: "code",
    project: {
      id: "sample-code",
      userId: "",
      title: "API daftar tugas",
      description: "API sederhana untuk menyimpan dan membaca daftar tugas.",
      goal: "API sederhana untuk menyimpan dan membaca daftar tugas.",
      skillType: "CODE",
      visibility: "PRIVATE",
      createdAt: "2026-11-05T08:00:00.000Z",
    },
    versions: [
      {
        id: "sample-v1-code",
        versionNumber: 1,
        createdAt: "2026-11-05T08:00:00.000Z",
        caption: "Endpoint dasar berfungsi, namun belum ada validasi judul kosong dan ID memakai panjang array.",
        textContent: `app.post("/tasks", (req, res) => {\n  const task = {\n    id: tasks.length + 1,\n    title: req.body.title\n  };\n  tasks.push(task);\n  res.json(task);\n});`,
        scores: {
          "Kebenaran logika": 7,
          Keterbacaan: 8,
          "Penanganan error": 5,
          "Struktur kode": 6,
        },
        strengths: ["Pemisahan POST /tasks dan GET /tasks sudah jelas."],
        nextFocus: "Tambahkan validasi tipe & string kosong serta gunakan UUID.",
      },
      {
        id: "sample-v2-code",
        versionNumber: 2,
        createdAt: "2026-11-07T08:00:00.000Z",
        caption: "Validasi input 400 Bad Request ditambahkan dan ID memakai crypto.randomUUID().",
        textContent: `app.post("/tasks", (req, res) => {\n  const title = req.body.title;\n  if (typeof title !== "string" || !title.trim()) {\n    return res.status(400).json({ error: "Judul wajib diisi" });\n  }\n  const task = { id: crypto.randomUUID(), title: title.trim() };\n  tasks.push(task);\n  res.status(201).json(task);\n});`,
        scores: {
          "Kebenaran logika": 8,
          Keterbacaan: 9,
          "Penanganan error": 8,
          "Struktur kode": 8,
        },
        strengths: ["Validasi input dan kode status HTTP 201/400 sudah sesuai standar REST."],
        nextFocus: "Pisahkan handler route ke controller terpisah agar mudah diuji.",
      },
    ],
  },
  "sample-essay": {
    sampleKind: "essay",
    project: {
      id: "sample-essay",
      userId: "",
      title: "Esai: Kota yang lebih ramah",
      description: "Esai opini tentang kota yang inklusif untuk majalah kampus.",
      goal: "Esai opini tentang kota yang inklusif untuk majalah kampus.",
      skillType: "ESSAY",
      visibility: "PRIVATE",
      createdAt: "2026-11-05T08:00:00.000Z",
    },
    versions: [
      {
        id: "sample-v1-essay",
        versionNumber: 1,
        createdAt: "2026-11-05T08:00:00.000Z",
        caption: "Pembuka dan penutup sudah kuat, namun klaim paragraf 2 masih terlalu luas.",
        textContent:
          "Semua orang lebih nyaman berjalan kaki jika trotoarnya diperlebar. Karena itu, pemerintah harus memperlebar semua trotoar agar kota menjadi lebih ramah.",
        scores: {
          "Kekuatan argumen": 7,
          "Alur gagasan": 7,
          "Bukti pendukung": 5,
          "Gaya bahasa": 8,
        },
        strengths: ["Sudut pandang empatik di pembuka terasa kuat."],
        nextFocus: "Batasi klaim dan kurangi pengulangan kata di paragraf 3.",
      },
      {
        id: "sample-v2-essay",
        versionNumber: 2,
        createdAt: "2026-11-07T08:00:00.000Z",
        caption: "Klaim lebih terukur dengan konteks aksesibilitas pejalan kaki dan pengguna kursi roda.",
        textContent:
          "Trotoar yang cukup lebar dan bebas hambatan membantu pejalan kaki, termasuk pengguna kursi roda, bergerak lebih leluasa di ruang kota.",
        scores: {
          "Kekuatan argumen": 8,
          "Alur gagasan": 8,
          "Bukti pendukung": 7,
          "Gaya bahasa": 9,
        },
        strengths: ["Klaim lebih terukur dan kalimat antarparagraf mengalir mulus."],
        nextFocus: "Sertakan satu contoh data atau studi kasus tata kota lokal.",
      },
    ],
  },
};

function toComparable(v: Version): ComparableVersion {
  return {
    id: v.id,
    versionNumber: v.versionNumber,
    createdAt: v.createdAt,
    caption: v.review?.summary.split(".")[0]
      ? `${v.review.summary.split(".")[0]}.`
      : `Karya versi v${v.versionNumber}.`,
    textContent: v.textContent,
    scores: v.review?.scores ?? {},
    strengths: v.review?.strengths ?? [],
    nextFocus:
      v.review?.nextSteps?.[0] ??
      v.review?.improvements?.[0]?.problem ??
      "Pertahankan konsistensi dan lanjutkan penyempurnaan detail berikutnya.",
  };
}

function VersionArtifact({
  skillType,
  version,
  isBefore,
}: {
  skillType: Project["skillType"];
  version: ComparableVersion;
  isBefore: boolean;
}) {
  if (skillType === "CODE") {
    return (
      <div className="overflow-hidden rounded-xl bg-[#1E1D2B] p-5 text-slate-200">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
          <Code2 className="size-4 text-indigo-300" />
          <span>tasks.js · v{version.versionNumber}</span>
        </div>
        <pre className="h-56 overflow-auto font-mono text-xs leading-relaxed">
          {version.textContent || "// Kode versi ini"}
        </pre>
      </div>
    );
  }

  if (skillType === "ESSAY") {
    return (
      <div className="h-64 overflow-auto rounded-xl bg-[#FFF1E5] p-5 text-slate-800">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-600">
          <NotebookPen className="size-4 text-[#5044B8]" />
          <span>Naskah · v{version.versionNumber}</span>
        </div>
        <p className="text-sm leading-relaxed">
          {version.textContent || "Cuplikan naskah pada versi ini."}
        </p>
      </div>
    );
  }

  return <CoffeePreview before={isBefore} />;
}

export default function CompareVersionsPage() {
  const { id = "sample-ui" } = useParams();
  const projectsQuery = useProjects();
  const isSample = id.startsWith("sample") || id === "demo";
  const sampleKey = id in sampleCompareData ? id : "sample-ui";
  const sampleBundle = sampleCompareData[sampleKey];

  const realProject = projectsQuery.data?.pages
    .flatMap((p) => p.items)
    .find((p) => p.id === id);

  const project = isSample ? sampleBundle.project : realProject;
  const versions: ComparableVersion[] = isSample
    ? sampleBundle.versions
    : [...(project?.versions ?? [])]
        .sort((a, b) => a.versionNumber - b.versionNumber)
        .map(toComparable);

  const [leftNo, setLeftNo] = useState<number>(1);
  const [rightNo, setRightNo] = useState<number>(2);

  useEffect(() => {
    if (versions.length >= 2) {
      setLeftNo(versions[0].versionNumber);
      setRightNo(versions[versions.length - 1].versionNumber);
    } else if (versions.length === 1) {
      setLeftNo(versions[0].versionNumber);
      setRightNo(versions[0].versionNumber);
    }
  }, [versions.length]);

  if (!isSample && projectsQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-slate-600">
        Memuat perbandingan versi...
      </div>
    );
  }

  if (!project || versions.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-slate-600">
        Belum ada cukup versi untuk dibandingkan.{" "}
        <Link to={`/projects/${id}`} className="font-semibold text-[#5044B8] hover:underline">
          Kembali ke proyek
        </Link>
      </div>
    );
  }

  const vInitial = versions.find((v) => v.versionNumber === leftNo) ?? versions[0];
  const vCompare =
    versions.find((v) => v.versionNumber === rightNo) ??
    versions[versions.length - 1];

  const scoreInitial = avgScores(vInitial.scores);
  const scoreCompare = avgScores(vCompare.scores);
  const avgDelta = scoreCompare - scoreInitial;

  const criteria = Array.from(
    new Set([...Object.keys(vInitial.scores), ...Object.keys(vCompare.scores)])
  );

  // Cari perubahan terbesar
  let biggestCriterion = criteria[0] ?? "Aksesibilitas";
  let biggestDiff = 0;
  for (const c of criteria) {
    const diff = (vCompare.scores[c] ?? 0) - (vInitial.scores[c] ?? 0);
    if (Math.abs(diff) >= Math.abs(biggestDiff)) {
      biggestDiff = diff;
      biggestCriterion = c;
    }
  }

  const beforeVal = vInitial.scores[biggestCriterion] ?? 0;
  const afterVal = vCompare.scores[biggestCriterion] ?? 0;

  const reviewV2Href = isSample
    ? `/projects/${project.id}/versions/sample?kind=${sampleBundle.sampleKind}`
    : `/projects/${project.id}/versions/${vCompare.id}`;

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb & Header */}
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-slate-600">
          <Link to="/projects" className="hover:text-[#5044B8]">
            Proyek
          </Link>
          <span className="mx-1.5">/</span>
          <Link to={`/projects/${project.id}`} className="hover:text-[#5044B8]">
            {project.title}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Bandingkan</span>
        </nav>

        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
          BUKTI KEMAJUAN
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
          Dua versi. Keputusan yang lebih matang.
        </h1>
        <p className="mt-2.5 text-sm text-slate-600">
          Bandingkan hasil dan penilaian dari proyek yang sama. Lihat apa yang berubah dan mengapa
          itu berarti.
        </p>
      </div>

      {/* Selector Card: Versi awal & Versi pembanding */}
      <section className={`${card} p-6`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-900">Versi awal</span>
            <span className="relative block">
              <select
                value={vInitial.versionNumber}
                onChange={(e) => setLeftNo(Number(e.target.value))}
                className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-[#5044B8]"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.versionNumber}>
                    v{v.versionNumber} · {fmtFullDate(v.createdAt)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-900">
              Versi pembanding
            </span>
            <span className="relative block">
              <select
                value={vCompare.versionNumber}
                onChange={(e) => setRightNo(Number(e.target.value))}
                className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-[#5044B8]"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.versionNumber}>
                    v{v.versionNumber} · {fmtFullDate(v.createdAt)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            </span>
          </label>
        </div>
      </section>

      {/* Side-by-Side Comparison */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Sebelum */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-stone-200/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              SEBELUM · v{vInitial.versionNumber}
            </span>
            <p className="text-xl font-semibold text-slate-700">
              {scoreInitial.toFixed(1)}
              <span className="ml-1 text-xs font-normal text-slate-500">/ 10</span>
            </p>
          </div>
          <VersionArtifact
            skillType={project.skillType}
            version={vInitial}
            isBefore={vInitial.versionNumber < vCompare.versionNumber}
          />
          <p className="mt-3 text-xs leading-relaxed text-slate-600">{vInitial.caption}</p>
        </div>

        {/* Sesudah */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-[#EFECFA] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5044B8]">
              SESUDAH · v{vCompare.versionNumber}
            </span>
            <p className="text-xl font-semibold text-[#5044B8]">
              {scoreCompare.toFixed(1)}
              <span className="ml-1 text-xs font-normal text-slate-500">/ 10</span>
            </p>
          </div>
          <VersionArtifact skillType={project.skillType} version={vCompare} isBefore={false} />
          <p className="mt-3 text-xs leading-relaxed text-slate-600">{vCompare.caption}</p>
        </div>
      </section>

      {/* Highlight Banner */}
      <section className="rounded-2xl bg-[#EFECFA] p-6 sm:p-8">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
            avgDelta > 0
              ? "bg-green-50 text-green-800"
              : avgDelta < 0
                ? "bg-amber-50 text-amber-800"
                : "bg-stone-200/80 text-slate-700"
          }`}
        >
          RATA-RATA ·{" "}
          {avgDelta > 0
            ? `▲ NAIK +${avgDelta.toFixed(1)}`
            : avgDelta < 0
              ? `▼ TURUN ${avgDelta.toFixed(1)}`
              : "• TETAP 0.0"}
        </span>
        <h2 className="mt-3.5 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
          Perubahan terbesarmu ada pada {biggestCriterion.toLowerCase()}.
        </h2>
        <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
          Skor {biggestCriterion.toLowerCase()} berubah dari {beforeVal} ke {afterVal}. Teks yang
          lebih kontras dan pola visual yang lebih konsisten membuat informasi lebih mudah dibaca.
          Ini adalah penilaian AI atas karya, bukan hasil uji pengguna.
        </p>
      </section>

      {/* Perbandingan per Kriteria Table Card */}
      <section className={`${card} p-6 sm:p-8`}>
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
          Perbandingan per kriteria
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3">KRITERIA</th>
                <th className="pb-3 text-right">v{vInitial.versionNumber}</th>
                <th className="pb-3 text-right">v{vCompare.versionNumber}</th>
                <th className="pb-3 text-right">PERUBAHAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {criteria.map((c) => {
                const s1 = vInitial.scores[c] ?? 0;
                const s2 = vCompare.scores[c] ?? 0;
                const diff = s2 - s1;
                return (
                  <tr key={c}>
                    <td className="py-4 font-semibold text-slate-900">{c}</td>
                    <td className="py-4 text-right text-slate-500">{s1}</td>
                    <td className="py-4 text-right font-semibold text-slate-900">{s2}</td>
                    <td className="py-4 text-right text-xs font-semibold">
                      {diff > 0 ? (
                        <span className="text-green-800">▲ naik +{diff}</span>
                      ) : diff < 0 ? (
                        <span className="text-amber-800">▼ turun {diff}</span>
                      ) : (
                        <span className="text-slate-600">• tetap</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Skala 1–10 · ▲ naik / ▼ turun / • tetap. Perubahan selalu ditulis dengan angka, bukan
          warna saja.
        </p>
      </section>

      {/* Bottom 2 Reflection Cards */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className={`${card} p-6`}>
          <h3 className="text-base font-semibold text-slate-900">
            Keputusan yang layak kamu pertahankan
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
            {vCompare.strengths[0] ??
              "Judul lebih tegas, satu CTA utama, serta warna teks yang lebih gelap."}
          </p>
        </div>

        <div className={`${card} p-6`}>
          <h3 className="text-base font-semibold text-slate-900">Fokus versi selanjutnya</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{vCompare.nextFocus}</p>
        </div>
      </section>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-[#5044B8] hover:bg-indigo-50"
        >
          ← Kembali ke proyek
        </Link>
        <Link
          to={reviewV2Href}
          className="inline-flex items-center justify-center rounded-lg bg-[#5044B8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#403598]"
        >
          Buka review v{vCompare.versionNumber} →
        </Link>
      </div>
    </div>
  );
}