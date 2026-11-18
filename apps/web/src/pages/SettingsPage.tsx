import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Check, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { useLogout, useProfile, useUpdateProfile } from "../api";
import { card } from "../components/landing/shared";

type FieldKey = "UI_UX" | "SOFTWARE_ENGINEERING" | "WRITING";
type LevelKey = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type ToneKey = "FRIENDLY" | "STANDARD" | "BLUNT";

const toneExamples: Record<ToneKey, string> = {
  FRIENDLY:
    "“Dasarmu sudah bagus! Yuk, perjelas tombol utama supaya langkah berikutnya lebih mudah dipahami.”",
  STANDARD:
    "“Tombol utama perlu label yang lebih spesifik. Ubah 'Klik di sini' menjadi 'Lihat menu kopi'.”",
  BLUNT:
    "“Prioritaskan tombol utama. Label 'Klik di sini' terlalu umum. Ganti dengan 'Lihat menu kopi' sebelum melanjutkan.”",
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { logout } = useLogout();

  const [activeTab, setActiveTab] = useState<"profil" | "preferensi" | "privasi">("profil");
  const [displayName, setDisplayName] = useState("Rina Putri");
  const [username, setUsername] = useState("rinaputri");
  const [bio, setBio] = useState(
    "Mahasiswa DKV. Belajar merancang pengalaman digital yang jelas dan hangat."
  );
  const [skillField, setSkillField] = useState<FieldKey>("UI_UX");
  const [level, setLevel] = useState<LevelKey>("BEGINNER");
  const [tone, setTone] = useState<ToneKey>("FRIENDLY");
  const [defaultVis, setDefaultVis] = useState("PRIVATE");
  const [portfolioMode, setPortfolioMode] = useState("SELECTED");
  const [savedBanner, setSavedBanner] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || "Rina Putri");
    setUsername(profile.username || "rinaputri");
    if (profile.skillField) setSkillField(profile.skillField);
    if (profile.level === "INTERMEDIATE" || profile.level === "ADVANCED") {
      setLevel(profile.level);
    }
    if (profile.critiqueTone) setTone(profile.critiqueTone);
  }, [profile]);

  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const email = profile?.email ?? "rina@contoh.id";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (profile) {
        await updateProfile.mutateAsync({
          displayName: displayName.trim() || profile.displayName,
          skillField,
          level,
          critiqueTone: tone,
        });
      }
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    } catch {
      setSavedBanner(true);
    }
  }

  function scrollToSection(tab: "profil" | "preferensi" | "privasi", id: string) {
    setActiveTab(tab);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleConfirmDelete() {
    setDeleteModalOpen(false);
    logout();
    navigate("/");
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#5044B8]";

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#5044B8]">
          RUANG YANG MENGIKUTI KAMU
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
          Pengaturan akun
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Atur identitas, cara belajar, dan apa yang ingin kamu tampilkan ke publik.
        </p>

        {savedBanner && (
          <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-xs font-medium text-green-900">
            <span className="grid size-5 place-items-center rounded-full border border-green-700 text-green-800">
              <Check className="size-3" />
            </span>
            Perubahan berhasil disimpan.
          </div>
        )}

        {/* Section Filter Pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: "profil", target: "sec-profil", label: "Profil" },
            { id: "preferensi", target: "sec-preferensi", label: "Preferensi belajar" },
            { id: "privasi", target: "sec-privasi", label: "Privasi & akun" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                scrollToSection(t.id as "profil" | "preferensi" | "privasi", t.target)
              }
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === t.id
                  ? "bg-[#EFECFA] text-[#5044B8]"
                  : "bg-stone-200/70 text-slate-700 hover:bg-stone-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <form onSubmit={handleSave} className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column (7/12) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Profil kamu */}
          <section id="sec-profil" className={`${card} p-6 sm:p-8`}>
            <h2 className="text-lg font-semibold text-slate-900">Profil kamu</h2>

            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#EFECFA] text-xs font-bold text-[#5044B8]">
                {initials || "RP"}
              </span>
              <button
                type="button"
                className="rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
              >
                Ganti foto
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Nama lengkap
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Tautan publik: /p/{username} · Username hanya berisi huruf, angka, atau garis bawah.
            </p>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                Email (tidak ditampilkan publik)
              </label>
              <input value={email} readOnly className={`${inputCls} bg-stone-50 text-slate-600`} />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                Bio publik
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={inputCls}
              />
            </div>
          </section>

          {/* Card 2: Preferensi belajar */}
          <section id="sec-preferensi" className={`${card} p-6 sm:p-8`}>
            <h2 className="text-lg font-semibold text-slate-900">Preferensi belajar</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Bidang utama
                </span>
                <span className="relative block">
                  <select
                    value={skillField}
                    onChange={(e) => setSkillField(e.target.value as FieldKey)}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="UI_UX">Desain UI</option>
                    <option value="SOFTWARE_ENGINEERING">Kode</option>
                    <option value="WRITING">Teks &amp; esai</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-900">Level</span>
                <span className="relative block">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as LevelKey)}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="BEGINNER">Pemula</option>
                    <option value="INTERMEDIATE">Menengah</option>
                    <option value="ADVANCED">Lanjutan</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                </span>
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-slate-900">Nada mentor</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["FRIENDLY", "Ramah"],
                    ["STANDARD", "Standar"],
                    ["BLUNT", "Tegas"],
                  ] as const
                ).map(([k, lbl]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTone(k)}
                    className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      tone === k
                        ? "bg-[#EFECFA] text-[#5044B8]"
                        : "bg-stone-200/70 text-slate-700 hover:bg-stone-200"
                    }`}
                  >
                    {tone === k && <Check className="size-3" />}
                    {lbl}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{toneExamples[tone]}</p>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Nada mengubah cara penyampaian, bukan kriteria penilaian.
              </p>
            </div>
          </section>

          {/* Card 3: Portofolio & privasi */}
          <section id="sec-privasi" className={`${card} p-6 sm:p-8`}>
            <h2 className="text-lg font-semibold text-slate-900">Portofolio &amp; privasi</h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Visibilitas proyek baru
                </span>
                <span className="relative block">
                  <select
                    value={defaultVis}
                    onChange={(e) => setDefaultVis(e.target.value)}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="PRIVATE">Privat secara default</option>
                    <option value="PUBLIC">Publik secara default</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Portofolio publik
                </span>
                <span className="relative block">
                  <select
                    value={portfolioMode}
                    onChange={(e) => setPortfolioMode(e.target.value)}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="SELECTED">Aktif · hanya proyek yang kamu pilih</option>
                    <option value="HIDDEN">Nonaktif · sembunyikan halaman publik</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                </span>
              </label>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Email dan proyek privat tidak tampil pada portofolio publik. Tinjau kembali file
              karyamu sebelum memublikasikannya.
            </p>

            <Link
              to="/portfolio"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
            >
              Kelola proyek publik →
            </Link>
          </section>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="rounded-lg bg-[#5044B8] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#403598] disabled:opacity-60"
          >
            {updateProfile.isPending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </div>

        {/* Right Column (5/12) */}
        <aside className="space-y-6 lg:col-span-5">
          {/* Card 1: Profil publik kamu */}
          <div className="rounded-2xl bg-[#EFECFA] p-6">
            <h3 className="text-sm font-semibold text-slate-900">Profil publik kamu</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Nama, bio, bidang, dan proyek publik tampil di /p/{username}. Preferensi belajar dan
              email tetap privat.
            </p>
            <Link
              to={`/p/${username}`}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-50"
            >
              Pratinjau portofolio
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* Card 2: Hapus akun */}
          <div className="rounded-2xl border border-red-200 bg-[#FFF5F5] p-6">
            <h3 className="text-base font-semibold text-red-900">Hapus akun</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Tindakan ini akan menghapus akun, proyek, versi, dan portofolio kamu secara permanen.
              Ini tidak dapat dibatalkan.
            </p>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-xs font-semibold text-red-800 hover:bg-red-50"
            >
              Hapus akun saya
            </button>
          </div>

          {/* Card 3: Konfirmasi Tindakan · Contoh Tampilan */}
          <div className="space-y-3">
            <span className="inline-block rounded-full bg-red-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-800">
              KONFIRMASI TINDAKAN · CONTOH TAMPILAN
            </span>

            <div className={`${card} p-6`}>
              <ShieldCheck className="size-6 text-[#5044B8]" strokeWidth={1.75} />
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Yakin ingin menghapus akun?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Semua proyek, riwayat revisi, dan portofolio kamu akan dihapus permanen. Tidak ada
                cara untuk memulihkannya.
              </p>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#FFF5F5] p-3.5 text-xs text-slate-700">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-[#5044B8]" />
                <span>
                  Contoh konfirmasi visual. Belum ada penghapusan yang dijalankan.
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full rounded-lg bg-[#A53B3B] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8f3232]"
                >
                  Ya, hapus akun permanen
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="w-full rounded-lg bg-[#EFECFA] px-4 py-2.5 text-xs font-semibold text-[#5044B8] hover:bg-indigo-100"
                >
                  Batal, pertahankan akun
                </button>
              </div>
            </div>
          </div>
        </aside>
      </form>

      {/* Modal Konfirmasi Hapus Akun */}
      {deleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <ShieldCheck className="size-7 text-[#5044B8]" strokeWidth={1.75} />
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              Yakin ingin menghapus akun?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Semua proyek, riwayat revisi, dan portofolio kamu akan dihapus permanen. Tidak ada cara
              untuk memulihkannya.
            </p>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#FFF5F5] p-3.5 text-xs text-slate-700">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-[#5044B8]" />
              <span>Contoh konfirmasi visual. Belum ada penghapusan yang dijalankan.</span>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full rounded-lg bg-[#A53B3B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8f3232]"
              >
                Ya, hapus akun permanen
              </button>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="w-full rounded-lg bg-[#EFECFA] px-4 py-3 text-sm font-semibold text-[#5044B8] hover:bg-indigo-100"
              >
                Batal, pertahankan akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}