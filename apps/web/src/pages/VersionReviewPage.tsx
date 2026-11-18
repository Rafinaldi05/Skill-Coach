import { useParams, useSearchParams } from "react-router-dom";
import type { Project, Review, Version } from "@skill-coach/shared";
import { useProjects, useVersion } from "../api";
import { ReviewProcessingView } from "../components/review/ReviewProcessingView";
import { ReviewResultView } from "../components/review/ReviewResultView";

const sampleCatalog: Record<
  "ui" | "code" | "essay",
  { project: Project; version: Version; review: Review }
> = {
  ui: {
    project: {
      id: "sample-ui",
      userId: "",
      title: "Landing page toko kopi",
      description:
        "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal melalui landing page yang mudah dipahami.",
      goal:
        "Membantu pengunjung menemukan menu dan suasana kedai kopi lokal melalui landing page yang mudah dipahami.",
      skillType: "UI",
      visibility: "PRIVATE",
      createdAt: "2026-11-06T08:00:00.000Z",
    },
    review: {
      id: "sample-review-ui",
      versionId: "sample-v2-ui",
      summary:
        "Lebih terarah, lebih mudah dipahami. Kamu berhasil memperjelas hierarki dan membuat tombol utama lebih mudah dikenali. Kontras yang lebih kuat juga meningkatkan keterbacaan dibanding v1. Selanjutnya, rapikan ritme jarak agar setiap bagian terasa lebih menyatu.",
      scores: {
        "Hierarki visual": 8,
        Konsistensi: 8,
        Aksesibilitas: 8,
        "Kejelasan CTA": 8,
      },
      strengths: [
        "Alur perhatian di hero lebih jelas. Judul menjadi titik masuk utama, diikuti deskripsi dan “Lihat menu kopi”. Pembaca mendapat urutan informasi yang lebih terarah.",
        "Kontras dan pola visual lebih konsisten. Teks gelap pada latar terang lebih terbaca. Warna tombol dan gaya navigasi kini mendukung identitas kedai yang sama.",
      ],
      improvements: [
        {
          title: "Dekatkan CTA dengan konteksnya",
          location: "Area 1 · Hero, jarak deskripsi ke tombol",
          problem:
            "Jarak deskripsi ke tombol lebih besar daripada jarak judul ke deskripsi. Tombol masih terasa sedikit terpisah dari pesan yang menjelaskannya.",
          why_it_matters:
            "Elemen yang berhubungan perlu terasa sebagai satu kelompok. Jarak yang konsisten membantu pembaca memahami bahwa tombol adalah kelanjutan dari pesan di atasnya.",
          example_fix:
            "Gunakan jarak 16 px dari deskripsi ke tombol dan 24 px dari judul ke deskripsi. Pertahankan label 'Lihat menu kopi' yang sudah spesifik.",
        },
        {
          title: "Samakan ritme jarak pada bagian keunggulan",
          location: "Area 2 · Bagian 'Biji lokal pilihan'",
          problem:
            "Jarak antarbutir informasi di bagian bawah masih belum seragam sehingga ritme baca terasa sedikit terputus.",
          why_it_matters:
            "Ritme jarak yang konsisten memudahkan mata memindai keunggulan produk secara cepat.",
          example_fix:
            "Terapkan kelipatan grid 8 px (misalnya 16 px antarbutir dan 32 px antarbagian).",
        },
      ],
      nextSteps: [
        "Atur jarak deskripsi ke CTA menjadi 16 px di hero.",
        "Samakan jarak antarbutir keunggulan dengan grid 8 px.",
        "Unggah v3 dengan catatan perubahan agar progresmu bisa ditinjau.",
      ],
      comparison: {
        score_delta: {
          "Hierarki visual": 2,
          Konsistensi: 1,
          Aksesibilitas: 3,
          "Kejelasan CTA": 2,
        },
        progress_commentary: "Skor rata-rata naik +2.0 dibanding v1.",
      },
      model: "nebius-vision",
      promptVersion: "1.0",
      tokensIn: 0,
      tokensOut: 0,
      costEstimate: "0",
      createdAt: "2026-11-06T08:05:00.000Z",
    },
    version: {
      id: "sample-v2-ui",
      projectId: "sample-ui",
      versionNumber: 2,
      fileKey: "landing-kopi-v2.png",
      fileType: "image/png",
      textContent: null,
      status: "done",
      errorMessage: null,
      createdAt: "2026-11-06T08:00:00.000Z",
      review: null,
    },
  },
  code: {
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
    review: {
      id: "sample-review-code",
      versionId: "sample-v1-code",
      summary:
        "Strukturnya jelas. Sekarang, lindungi masukan. Kamu sudah memisahkan alur membuat dan membaca dengan baik. Namun, endpoint pembuatan tugas masih menerima judul kosong dan memakai ID yang berpotensi berulang. Prioritaskan validasi input sebelum menambah fitur baru.",
      scores: {
        "Kebenaran logika": 7,
        Keterbacaan: 8,
        "Penanganan error": 5,
        "Struktur kode": 6,
      },
      strengths: [
        "Endpoint punya tanggung jawab terpisah. POST /tasks membuat data, sementara GET /tasks membaca data. Pemisahan ini memudahkan pengembangan alur berikutnya.",
        "Penamaan mudah diikuti. Nama tasks, task, dan title menjelaskan maksud data tanpa komentar berlebihan. Struktur objeknya ringkas dan konsisten.",
      ],
      improvements: [
        {
          title: "Tolak judul kosong sebelum menyimpan",
          location: "Masukan 1 · tasks.js, baris 3–9",
          problem:
            "req.body.title langsung disimpan tanpa memeriksa tipe atau isinya. Permintaan tanpa judul tetap menghasilkan tugas baru.",
          why_it_matters:
            "Data yang tidak valid akan menyulitkan tampilan dan proses berikutnya. Respons error yang jelas membantu pemanggil API memperbaiki permintaannya.",
          example_fix:
            "Periksa tipe string dan gunakan trim(). Kembalikan status 400 untuk input tidak valid, serta 201 setelah tugas berhasil dibuat. Contoh di bawah juga memakai UUID agar ID tidak berulang.",
        },
        {
          title: "Hindari ID berbasis panjang array",
          location: "Masukan 2 · tasks.js, baris 5",
          problem:
            "Menggunakan tasks.length + 1 berisiko menghasilkan ID duplikat jika ada item yang dihapus.",
          why_it_matters:
            "ID harus selalu unik agar operasi pembaruan atau penghapusan data tidak salah sasaran.",
          example_fix: "Gunakan crypto.randomUUID() untuk membuat identifier unik.",
        },
      ],
      nextSteps: [
        "Tambahkan validasi judul: string, tidak kosong, dan trim spasi.",
        "Gunakan ID unik dan coba input kosong serta input yang valid.",
        "Unggah v2 beserta hasil percobaan respons 400 dan 201.",
      ],
      comparison: null,
      model: "nebius-text",
      promptVersion: "1.0",
      tokensIn: 0,
      tokensOut: 0,
      costEstimate: "0",
      createdAt: "2026-11-05T08:05:00.000Z",
    },
    version: {
      id: "sample-v1-code",
      projectId: "sample-code",
      versionNumber: 1,
      fileKey: "tasks.js",
      fileType: "text/plain",
      textContent: null,
      status: "done",
      errorMessage: null,
      createdAt: "2026-11-05T08:00:00.000Z",
      review: null,
    },
  },
  essay: {
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
    review: {
      id: "sample-review-essay",
      versionId: "sample-v1-essay",
      summary:
        "Suaramu sudah terasa. Beri argumenmu pijakan. Pembuka yang reflektif dan penutup yang empatik membuat arah tulisanmu mudah dipahami. Namun, klaim pada paragraf kedua masih terlalu luas dan belum didukung bukti. Perkuat satu alasan utama, lalu rapikan pengulangan agar pesanmu lebih tajam.",
      scores: {
        "Kekuatan argumen": 7,
        "Alur gagasan": 7,
        "Bukti pendukung": 5,
        "Gaya bahasa": 8,
      },
      strengths: [
        "Pembuka memberi sudut pandang yang jelas. Paragraf 1 mendefinisikan keramahan kota lewat pengalaman warga, bukan hanya bentuk jalan. Ini memberi fokus manusiawi untuk esai.",
        "Penutup kembali pada gagasan utama. Paragraf 4 menghubungkan perencanaan kota dengan kebutuhan warga yang belum terwakili. Nada empatiknya konsisten dengan pembuka.",
      ],
      improvements: [
        {
          title: "Batasi klaim, lalu beri alasan yang bisa ditelusuri",
          location: "Masukan 1 · Paragraf 2, kalimat 1–2",
          problem:
            "Klaim 'semua orang lebih nyaman' menggeneralisasi kebutuhan warga. Kesimpulan memperlebar semua trotoar juga belum mengikuti bukti yang disajikan.",
          why_it_matters:
            "Pembaca perlu memahami hubungan antara usulan dan kebutuhan nyata. Klaim yang terukur lebih meyakinkan daripada pernyataan yang berlaku untuk semua situasi.",
          example_fix:
            "Ubah menjadi: 'Trotoar yang cukup lebar dan bebas hambatan dapat membantu pejalan kaki, termasuk pengguna kursi roda, bergerak lebih leluasa. Karena itu, penataan trotoar perlu mempertimbangkan lebar efektif, akses penyeberangan, dan hambatan di jalur.' Tambahkan sumber yang relevan sebelum publikasi.",
        },
        {
          title: "Pangkas pengulangan agar ritme lebih luwes",
          location: "Masukan 2 · Paragraf 3",
          problem:
            "Pola kalimat 'Taman adalah...' diulang berturut-turut sehingga alur baca terasa monoton.",
          why_it_matters:
            "Variasi struktur kalimat menjaga keterlibatan pembaca dan memperkuat penekanan makna.",
          example_fix:
            "Gabungkan dua gagasan yang berdekatan menjadi satu kalimat mengalir.",
        },
      ],
      nextSteps: [
        "Batasi klaim paragraf 2 dan cari sumber yang relevan untuk mendukungnya.",
        "Tulis ulang paragraf 3 dengan memangkas penekanan dan pengulangan.",
        "Baca alur pembuka–argumen–penutup, lalu unggah v2.",
      ],
      comparison: null,
      model: "nebius-text",
      promptVersion: "1.0",
      tokensIn: 0,
      tokensOut: 0,
      costEstimate: "0",
      createdAt: "2026-11-05T08:05:00.000Z",
    },
    version: {
      id: "sample-v1-essay",
      projectId: "sample-essay",
      versionNumber: 1,
      fileKey: "kota-ramah.txt",
      fileType: "text/plain",
      textContent: null,
      status: "done",
      errorMessage: null,
      createdAt: "2026-11-05T08:00:00.000Z",
      review: null,
    },
  },
};

export default function VersionReviewPage() {
  const { id: projectId = "", versionId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const projects = useProjects();

  const isSample = versionId.startsWith("sample");
  const versionQuery = useVersion(isSample ? "" : versionId);

  if (isSample) {
    const kindParam = searchParams.get("kind");
    const statusParam = searchParams.get("status");
    const key =
      kindParam === "code" || kindParam === "essay" ? kindParam : "ui";
    const entry = sampleCatalog[key];

    if (statusParam === "processing" || statusParam === "queued" || statusParam === "failed") {
      return (
        <ReviewProcessingView
          project={{ ...entry.project, id: projectId || entry.project.id }}
          version={{ ...entry.version, status: statusParam }}
        />
      );
    }

    return (
      <ReviewResultView
        project={{ ...entry.project, id: projectId || entry.project.id }}
        version={entry.version}
        review={entry.review}
      />
    );
  }

  const project = projects.data?.pages
    .flatMap((p) => p.items)
    .find((p) => p.id === projectId);

  if (versionQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-slate-600">
        Memuat status review...
      </div>
    );
  }

  const version = versionQuery.data;
  if (!version) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-slate-600">
        Versi review tidak ditemukan.
      </div>
    );
  }

  if (version.status !== "done" || !version.review) {
    return <ReviewProcessingView project={project} version={version} />;
  }

  return (
    <ReviewResultView
      project={project}
      version={version}
      review={version.review}
    />
  );
}