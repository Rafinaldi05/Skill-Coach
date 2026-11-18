import { Action, CoffeePreview } from "./shared";

export function HeroSection() {
  return <section aria-labelledby="hero-title" className="grid items-start gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pb-24">
    <div className="pt-3 lg:pt-8"><p className="mb-6 inline-block rounded-md bg-[#efecfa] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6256aa]">Mentor AI untuk karya nyata</p><h1 id="hero-title" className="max-w-lg text-5xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-6xl lg:text-[64px]">Karya kamu,<br />selangkah<br />lebih baik.</h1><p className="mb-6 mt-6 max-w-md text-base leading-relaxed text-stone-500">Bukan sekadar nilai. Pahami apa yang kurang, kenapa itu penting, dan bagaimana memperbaikinya bersama mentor AI personal kamu.</p><Action>Mulai perjalananmu</Action><p className="mt-6 text-xs text-stone-500">Desain UI · Kode · Teks & esai</p></div>
    <div className="rounded-3xl bg-[#fff0e5] p-5"><div className="mb-4 flex items-center justify-between gap-2 text-[10px]"><span className="rounded bg-[#efecfa] px-2 py-1 font-bold text-[#6256aa]">CONTOH KARYA</span><span className="text-stone-500">v2 · 6 Nov 2025</span></div><CoffeePreview hero /><div className="mt-4 flex gap-3 rounded-xl bg-white p-4"><span aria-hidden="true" className="text-xl text-[#5044b8]">↗</span><div><p className="text-sm font-semibold">Dari mencoba, jadi memahami.</p><p className="mt-1 text-xs text-stone-500">6,0 → 8,0 · contoh progres dua versi</p></div></div></div>
  </section>;
}
