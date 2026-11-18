import { Action, Brand, container } from "./shared";
export function FinalCta() {
  return <section className="mb-12 rounded-3xl bg-[#5044b8] px-6 py-12 text-white sm:px-11 sm:py-14"><h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-[42px]">Versi terbaikmu dimulai<br className="hidden sm:block" /> dari versi pertama.</h2><p className="mb-6 mt-5 text-sm text-indigo-100">Bawa satu karya. Temukan satu perbaikan. Mulai dari sana.</p><Action secondary>Buat akun Skill Coach</Action></section>;
}
export function LandingFooter() {
  return <footer className={`${container} pb-9`}><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><Brand /><p className="mt-4 text-xs text-stone-500">Mentor AI personal untuk proses belajar kamu.</p></div><nav aria-label="Navigasi footer" className="flex flex-wrap gap-5 text-xs text-stone-600"><a href="#cara-kerja">Cara kerja</a><a href="#contoh-review">Contoh review</a><a href="#pertanyaan">Bantuan</a></nav></div><p className="mt-7 text-[10px] leading-relaxed text-stone-500">© {new Date().getFullYear()} Skill Coach · Seluruh karya dan skor pada halaman ini adalah contoh ilustratif.</p></footer>;
}
