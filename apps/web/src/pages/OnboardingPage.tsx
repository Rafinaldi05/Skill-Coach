import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PanelsTopLeft, Code2, NotebookPen } from "lucide-react";
import { useUpdateProfile } from "../api";
import { Brand } from "../components/landing/shared";

type FieldKey = "UI_UX" | "SOFTWARE_ENGINEERING" | "WRITING";
type LevelKey = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type ToneKey = "FRIENDLY" | "STANDARD" | "BLUNT";

const fields: Record<FieldKey, { label: string; shortLabel: string; desc: string; icon: typeof PanelsTopLeft }> = {
  UI_UX: { label: "Desain UI", shortLabel: "Desain UI", desc: "Belajar mengatur hierarki, konsistensi, aksesibilitas, dan aksi utama.", icon: PanelsTopLeft },
  SOFTWARE_ENGINEERING: { label: "Kode", shortLabel: "Kode", desc: "Tulis kode yang benar, terstruktur, mudah dibaca, dan aman dari error.", icon: Code2 },
  WRITING: { label: "Teks & esai", shortLabel: "Teks & esai", desc: "Bangun argumen, alur gagasan, bukti, dan suara tulisanmu.", icon: NotebookPen },
};

const levels: Record<LevelKey, { label: string; badge: string; desc: string; detail: string }> = {
  BEGINNER: { label: "Pemula", badge: "01", desc: "Aku baru mulai dan ingin memahami dasar-dasarnya.", detail: "Penjelasan bertahap, istilah sederhana, dan contoh konkret." },
  INTERMEDIATE: { label: "Menengah", badge: "02", desc: "Aku sudah pernah membuat karya dan ingin lebih konsisten.", detail: "Masukan lebih mendalam tentang alasan dan pilihan pendekatan." },
  ADVANCED: { label: "Lanjutan", badge: "03", desc: "Aku ingin mempertajam kualitas dan keputusan yang lebih kompleks.", detail: "Analisis lebih kritis terhadap detail dan kompromi desain." },
};

const tones: Record<ToneKey, { label: string; tagline: string; example: string; badge: string }> = {
  FRIENDLY: { label: "Ramah", tagline: "Hangat, mendukung, dan mengajak.", badge: "Hangat", example: "“Dasarmu sudah bagus! Yuk, coba perjelas tombol utama supaya pembaca lebih mudah tahu langkah berikutnya.”" },
  STANDARD: { label: "Standar", tagline: "Jelas, objektif, dan langsung.", badge: "Seimbang", example: "“Tombol utama perlu label yang lebih spesifik. Ubah 'Klik di sini' menjadi 'Lihat menu kopi'.”" },
  BLUNT: { label: "Tegas", tagline: "Lugas dan berorientasi tindakan.", badge: "Fokus", example: "“Prioritaskan tombol utama. Label 'Klik di sini' terlalu umum. Ganti dengan 'Lihat menu kopi' sebelum melanjutkan.”" },
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(1);
  const [field, setField] = useState<FieldKey | null>(null);
  const [level, setLevel] = useState<LevelKey | null>(null);
  const [tone, setTone] = useState<ToneKey>("FRIENDLY");

  async function handleFinish() {
    if (!field || !level) return;
    try {
      await updateProfile.mutateAsync({ skillField: field, level, critiqueTone: tone });
      navigate("/dashboard");
    } catch {
      // error handled via updateProfile.error
    }
  }

  const progress = [
    { step: 1, label: "Bidang", done: step > 1 },
    { step: 2, label: "Level", done: step > 2 },
    { step: 3, label: "Nada", done: step > 3 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <header className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Brand />
          <Link to="/#pertanyaan" className="text-xs font-medium text-slate-700 hover:text-indigo-700">
            Butuh bantuan?
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-600">
            LANGKAH {step} DARI 3
          </p>
          <div className="mb-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-indigo-600" : "bg-stone-200"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {progress.map((p, i) => (
              <div key={p.step} className="flex items-center gap-2">
                {p.done && <span className="text-indigo-600">✓</span>}
                <span className={p.done ? "text-indigo-600" : ""}>{p.label}</span>
                {i < progress.length - 1 && <span className="text-slate-400">→</span>}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">KENALAN DULU, YUK</p>
            <h1 className="mb-3 text-3xl font-semibold sm:text-4xl">Apa yang ingin kamu kembangkan?</h1>
            <p className="mb-6 text-slate-600">Pilih fokus awal. Kamu tetap bisa membuat proyek di bidang lain nanti.</p>

            <div className="mb-6 flex flex-wrap gap-2">
              {(Object.keys(fields) as FieldKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setField(k)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    field === k
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-stone-300 bg-white text-slate-700 hover:border-indigo-400"
                  }`}
                >
                  {field === k ? <span className="mr-1">✓</span> : null} {fields[k].shortLabel}
                </button>
              ))}
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {(Object.keys(fields) as FieldKey[]).map((k) => {
                const f = fields[k];
                const Icon = f.icon;
                return (
                  <button
                    key={k}
                    onClick={() => setField(k)}
                    className={`rounded-xl border p-6 text-left transition ${
                      field === k
                        ? "border-indigo-300 bg-[#EFECFA]"
                        : "border-stone-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <Icon className="mb-3 w-6 h-6 text-[#5044B8]" strokeWidth={1.75} />
                    <h2 className="mb-2 text-lg font-semibold">{f.label}</h2>
                    <p className="text-sm text-slate-600">{f.desc}</p>
                  </button>
                );
              })}
            </div>

            {field && (
              <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 text-sm">
                <span className="text-indigo-700">✓ {fields[field].label} dipilih</span>
                <span className="text-slate-600"> · Review akan mengikuti fokus awalmu.</span>
              </div>
            )}

            <button
              disabled={!field}
              onClick={() => setStep(2)}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
            >
              Lanjutkan →
            </button>
            <p className="mt-4 text-xs text-slate-500">Preferensi ini bisa kamu ubah kapan saja di Pengaturan.</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">BERTUMBUH DARI TITIKMU</p>
            <h1 className="mb-3 text-3xl font-semibold sm:text-4xl">Di mana kamu memulai?</h1>
            <p className="mb-6 text-slate-600">Tidak ada jawaban yang lebih baik. Kami menyesuaikan kedalaman penjelasan dengan pengalaman kamu.</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {(Object.keys(levels) as LevelKey[]).map((k) => {
                const lv = levels[k];
                return (
                  <button
                    key={k}
                    onClick={() => setLevel(k)}
                    className={`rounded-xl border p-6 text-left transition ${
                      level === k
                        ? "border-indigo-300 bg-[#EFECFA]"
                        : "border-stone-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div className="mb-3 inline-block rounded bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      {level === k ? "✓ Dipilih" : lv.badge}
                    </div>
                    <h2 className="mb-2 text-lg font-semibold">{lv.label}</h2>
                    <p className="mb-3 text-sm text-slate-700">{lv.desc}</p>
                    <p className="text-xs text-slate-500">{lv.detail}</p>
                  </button>
                );
              })}
            </div>

            {field && level && (
              <div className="mb-6 rounded-lg border border-stone-200 bg-white p-5">
                <h3 className="mb-2 text-sm font-semibold">Fokus awalmu: {fields[field].label} · {levels[level].label}</h3>
                <p className="text-sm text-slate-600">
                  Mulai pelan tidak berarti tertinggal. Yang penting adalah memahami setiap perubahan yang kamu buat.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-stone-50"
              >
                ← Kembali
              </button>
              <button
                disabled={!level}
                onClick={() => setStep(3)}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                Lanjutkan →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">MENTOR YANG COCOK DENGANMU</p>
            <h1 className="mb-3 text-3xl font-semibold sm:text-4xl">Bagaimana kamu ingin diberi masukan?</h1>
            <p className="mb-6 text-slate-600">Pilih cara penyampaian yang membuat kamu nyaman bertumbuh. Kriteria penilaian tetap sama untuk semua nada.</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {(Object.keys(tones) as ToneKey[]).map((k) => {
                const t = tones[k];
                return (
                  <button
                    key={k}
                    onClick={() => setTone(k)}
                    className={`rounded-xl border p-6 text-left transition ${
                      tone === k
                        ? "border-indigo-300 bg-[#EFECFA]"
                        : "border-stone-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div className="mb-3 inline-block rounded bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      {tone === k ? "✓ Dipilih" : t.badge}
                    </div>
                    <h2 className="mb-2 text-lg font-semibold">{t.label}</h2>
                    <p className="mb-3 text-sm text-slate-600">{t.tagline}</p>
                    <div className="rounded-lg bg-white/60 p-3 text-xs leading-relaxed text-slate-700">
                      <p className="mb-1 font-semibold">Contoh masukan yang sama</p>
                      {t.example}
                    </div>
                  </button>
                );
              })}
            </div>

            {field && level && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50/50 p-5">
                <h3 className="mb-2 text-sm font-semibold text-green-900">Siap menemani prosesmu</h3>
                <p className="text-sm text-slate-700">
                  {fields[field].label} · {levels[level].label} · Nada {tones[tone].label.toLowerCase()}. Semua preferensi ini dapat kamu ubah di Pengaturan.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-stone-50"
              >
                ← Kembali
              </button>
              <button
                disabled={updateProfile.isPending}
                onClick={handleFinish}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {updateProfile.isPending ? "Menyimpan..." : "Mulai belajar →"}
              </button>
            </div>
            {updateProfile.error && (
              <p className="mt-3 text-sm text-red-600">Gagal menyimpan preferensi. Coba lagi.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
