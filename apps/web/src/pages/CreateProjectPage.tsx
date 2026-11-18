import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, UploadCloud, X } from "lucide-react";
import type { CreateProjectInput } from "@skill-coach/shared";
type SkillType = CreateProjectInput["skillType"];
import { useCreateProject, useCreateVersion, useQuota } from "../api";

const FIELDS: { value: SkillType; label: string }[] = [
  { value: "UI", label: "Desain UI" },
  { value: "CODE", label: "Kode" },
  { value: "ESSAY", label: "Teks & esai" },
];
const DEFAULT_TAB: Record<SkillType, "file" | "code" | "text"> = { UI: "file", CODE: "code", ESSAY: "text" };
const ACCEPT = ".png,.jpg,.jpeg,.webp,.js,.py,.html,.css,.txt,.md";
const MAX_BYTES = 5 * 1024 * 1024;
const LANGS = ["JavaScript", "TypeScript", "Python", "HTML/CSS", "Lainnya"];

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const [projectId, setProjectId] = useState("");
  const createVersion = useCreateVersion(projectId);
  const { data: quota } = useQuota();

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [skillType, setSkillType] = useState<SkillType>("UI");
  const [tab, setTab] = useState<"file" | "code" | "text">("file");
  const [lang, setLang] = useState(LANGS[0]);
  const [code, setCode] = useState("// Tempel kode kamu di sini\n");
  const [essay, setEssay] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const pickSkill = (s: SkillType) => { setSkillType(s); setTab(DEFAULT_TAB[s]); };

  function pickFile(f: File | undefined) {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ACCEPT.includes(ext)) return setFileError("Jenis file tidak didukung.");
    if (f.size > MAX_BYTES) return setFileError("Ukuran file maksimal 5 MB.");
    setFileError("");
    setFile(f);
  }

  const previewUrl = useMemo(
    () => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file]
  );

  const hasWork = Boolean(file || code.replace(/\/\/ Tempel kode kamu di sini\s*/g, "").trim() || essay.trim());
  const busy = createProject.isPending || createVersion.isPending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Judul proyek wajib diisi.");
    if (!hasWork) return setError("Karya wajib diisi sebelum kamu meminta review.");
    try {
      const project = await createProject.mutateAsync({ title: title.trim(), description: goal.trim() || undefined, skillType });
      setProjectId(project.id);
      // shortcut: gambar dikirim sebagai placeholder teks (fileKey butuh storage upload); upgrade saat endpoint upload siap
      const textContent = file
        ? file.type.startsWith("image/") ? `[file] ${file.name}` : await file.text()
        : tab === "code" ? code : essay;
      await createVersion.mutateAsync({ textContent });
      navigate(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat proyek.");
    }
  }

  const inputCls = "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5044B8] focus:ring-2 focus:ring-[#5044B8]/20";
  const labelCls = "mb-2 block text-sm font-semibold text-slate-900";

  return (
    <form onSubmit={submit}>
      <p className="text-sm text-slate-500"><Link to="/projects" className="hover:text-[#5044B8]">Proyek</Link> / Buat proyek baru</p>
      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#5044B8]">Mulai perjalanan baru</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Bawa karya yang sedang kamu usahakan.</h1>
      <p className="mt-3 text-slate-600">Satu proyek untuk satu karya. Revisi berikutnya akan tersimpan sebagai versi baru di proyek ini.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* 01 */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">01 · Tentang proyek</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="title" className={labelCls}>Judul proyek</label>
                <input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Landing page toko kopi" className={inputCls} />
              </div>
              <div>
                <label htmlFor="goal" className={labelCls}>Tujuan atau deskripsi</label>
                <textarea id="goal" value={goal} onChange={e => setGoal(e.target.value)} rows={3} placeholder="Membantu pengunjung menemukan menu dan suasana kedai kopi lokal…" className={inputCls} />
                <p className="mt-1.5 text-xs text-slate-500">Ceritakan siapa pembacanya dan apa yang ingin kamu capai.</p>
              </div>
              <div>
                <label htmlFor="skill" className={labelCls}>Bidang karya</label>
                <select id="skill" value={skillType} onChange={e => pickSkill(e.target.value as SkillType)} className={inputCls}>
                  {FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="mt-2.5 flex gap-2">
                  {FIELDS.map(f => (
                    <button key={f.value} type="button" onClick={() => pickSkill(f.value)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${skillType === f.value ? "bg-[#EFECFA] text-[#5044B8]" : "text-slate-500 hover:bg-stone-100"}`}>
                      {skillType === f.value && <Check className="size-3.5" />}{f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="vis" className={labelCls}>Visibilitas proyek</label>
                <select id="vis" className={inputCls} disabled>
                  <option>Privat — hanya kamu yang dapat melihat</option>
                  <option>Publik — dapat dibagikan di portofolio</option>
                </select>
                <p className="mt-1.5 text-xs text-slate-500">Kamu bisa mempublikasikannya nanti lewat Kelola portofolio.</p>
              </div>
            </div>
          </section>

          {/* 02 */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">02 · Tambahkan karya v1</h2>
            <div className="mt-4 flex gap-2">
              {([["file", "Unggah file"], ["code", "Tempel kode"], ["text", "Tempel teks"]] as const).map(([v, l]) => (
                <button key={v} type="button" onClick={() => setTab(v)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === v ? "bg-[#EFECFA] text-[#5044B8]" : "text-slate-500 hover:bg-stone-100"}`}>
                  {l}
                </button>
              ))}
            </div>

            {tab === "file" && (
              <div className="mt-4">
                <div onClick={() => fileInput.current?.click()}
                  onDrop={e => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }}
                  onDragOver={e => e.preventDefault()}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-stone-300 px-6 py-10 text-center transition hover:border-[#5044B8]">
                  <UploadCloud className="mx-auto size-8 text-slate-400" />
                  <p className="mt-3 text-sm font-medium text-slate-700">Tarik file ke sini atau pilih dari perangkat kamu.</p>
                  <span className="mt-4 inline-block rounded-xl bg-[#EFECFA] px-6 py-2.5 text-sm font-semibold text-[#5044B8]">Pilih file</span>
                </div>
                <input ref={fileInput} type="file" accept={ACCEPT} className="hidden" onChange={e => pickFile(e.target.files?.[0])} />
                <p className="mt-2 text-xs text-slate-500">Gambar: PNG, JPG, WEBP · Kode: .js, .py, .html, .css · Teks: .txt, .md. Maksimal 5 MB. Video tidak didukung.</p>
                {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
                {file && (
                  <div className="mt-3 rounded-xl bg-stone-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                      <button type="button" onClick={() => setFile(null)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600">Hapus <X className="size-3.5" /></button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB · Siap diunggah</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600"><Check className="size-3.5" /> Jenis dan ukuran file sesuai</p>
                  </div>
                )}
                {busy && file && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500"><span>Transfer file</span><span>…</span></div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-200"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#5044B8]" /></div>
                    <p className="mt-1.5 text-xs text-slate-500">Persentase hanya untuk unggahan file, bukan proses review AI.</p>
                  </div>
                )}
              </div>
            )}

            {tab === "code" && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alternatif input · Kode</p>
                <label htmlFor="lang" className={`${labelCls} mt-3`}>Bahasa pemrograman</label>
                <select id="lang" value={lang} onChange={e => setLang(e.target.value)} className={inputCls}>
                  {LANGS.map(l => <option key={l}>{l}</option>)}
                </select>
                {skillType !== "CODE" && <p className="mt-1.5 text-xs text-slate-500">Pilih bidang Kode untuk menggunakan input ini.</p>}
                <textarea value={code} onChange={e => setCode(e.target.value)} rows={6} spellCheck={false}
                  className="mt-3 w-full rounded-xl bg-[#1E1D2B] p-4 font-mono text-sm text-stone-100 outline-none" />
              </div>
            )}

            {tab === "text" && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alternatif input · Teks & esai</p>
                {skillType !== "ESSAY" && <p className="mt-2 text-xs text-slate-500">Pilih bidang Teks & esai untuk menggunakan input ini.</p>}
                <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={7}
                  placeholder={"Tempel tulisan kamu di sini…\n\nSertakan judul dan pisahkan setiap paragraf agar referensi review mudah ditemukan."}
                  className="mt-3 w-full rounded-xl border border-stone-200 bg-[#FAF9F6] p-4 text-sm leading-relaxed outline-none transition focus:border-[#5044B8] focus:ring-2 focus:ring-[#5044B8]/20" />
                <p className="mt-1.5 text-xs text-slate-500">Validasi: karya wajib diisi sebelum kamu meminta review.</p>
              </div>
            )}
          </section>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="rounded-xl border border-stone-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-stone-50 disabled:opacity-50">Simpan draf</button>
            <button type="submit" disabled={busy} className="flex-1 rounded-xl bg-[#5044B8] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#43389e] disabled:opacity-50">
              {busy ? "Memproses…" : "Buat proyek & minta review"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="font-bold text-slate-900">Pratinjau karya</h3>
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Pratinjau karya" className="mt-3 w-full rounded-xl border border-stone-200 object-cover" />
                <p className="mt-2 text-xs text-slate-500">{file?.name} · contoh berkas</p>
              </>
            ) : code.replace(/\/\/ Tempel kode kamu di sini\s*/g, "").trim() && tab === "code" ? (
              <pre className="mt-3 overflow-auto rounded-xl bg-[#1E1D2B] p-4 font-mono text-xs text-stone-100">{code}</pre>
            ) : essay.trim() && tab === "text" ? (
              <p className="mt-3 line-clamp-[12] whitespace-pre-wrap rounded-xl bg-[#FAF9F6] p-4 text-sm leading-relaxed text-slate-700">{essay}</p>
            ) : (
              <div className="mt-3 grid h-40 place-items-center rounded-xl bg-stone-50 text-sm text-slate-400">Pratinjau karya akan muncul di sini.</div>
            )}
          </section>

          <section className="rounded-2xl bg-[#EFECFA] p-5">
            <h3 className="font-bold text-slate-900">Sebelum meminta review</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {["Satu karya, satu tujuan yang jelas", "Tidak mengandung data pribadi sensitif", "Kamu punya hak atas karya ini"].map(t => (
                <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#5044B8]" />{t}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-[#5044B8]">
              {quota ? `${quota.remaining} review tersedia.` : "…"} Satu review akan digunakan setelah berhasil.
            </p>
          </section>
        </aside>
      </div>
    </form>
  );
}
