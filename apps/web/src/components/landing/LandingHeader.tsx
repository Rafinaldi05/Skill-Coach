import { Link } from "react-router-dom";
import { Brand, container } from "./shared";

export function LandingHeader() {
  return <header className="border-b border-stone-200/60 bg-white"><div className={`${container} flex min-h-20 flex-wrap items-center justify-between gap-3 py-4`}>
    <Brand />
    <nav aria-label="Navigasi utama" className="order-3 flex w-full justify-center gap-6 text-xs text-stone-600 sm:order-none sm:w-auto"><a href="#cara-kerja" className="py-2 hover:text-indigo-700">Cara kerja</a><a href="#contoh-review" className="py-2 hover:text-indigo-700">Contoh review</a><a href="#pertanyaan" className="py-2 hover:text-indigo-700">Pertanyaan</a></nav>
    <Link to="/login" className="rounded-lg border border-stone-200 px-4 py-3 text-xs font-semibold text-[#5044b8] hover:bg-indigo-50">Masuk</Link>
  </div></header>;
}
