import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12";
export const card = "rounded-2xl border border-stone-200/80 bg-white";
export function Brand() {
  return <Link to="/" aria-label="Skill Coach beranda" className="inline-flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-[#5044b8] text-sm font-bold text-white">S.</span><span>skill coach</span></Link>;
}
export function Action({ children, secondary = false }: { children: ReactNode; secondary?: boolean }) {
  return <Link to="/register" className={`inline-flex min-h-11 items-center justify-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold ${secondary ? "border border-stone-200 bg-white text-[#5044b8] hover:bg-indigo-50" : "bg-[#5044b8] text-white hover:bg-[#403598]"}`}>{children}<span aria-hidden="true">→</span></Link>;
}
export function SectionHeading({ label, children }: { label: string; children: ReactNode }) {
  return <div className="mb-7"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.09em] text-[#6256aa]">{label}</p><h2 className="text-3xl font-semibold leading-[1.13] tracking-[-0.045em] sm:text-4xl">{children}</h2></div>;
}
export function CoffeePreview({ before = false, hero = false }: { before?: boolean; hero?: boolean }) {
  return <div className="overflow-hidden rounded-lg border border-[#deddd0] bg-[#f1efe3] text-[#373b2c]">
    <div className="flex items-center justify-between px-4 py-4"><span className="text-sm font-semibold">seduh.</span><span className="text-[8px] tracking-wide">Menu · Cerita · Kunjungi</span></div>
    <div className="px-4 pb-5 pt-3 sm:px-5"><p className="mb-3 text-[8px] uppercase tracking-[0.23em] text-[#737563]">Kopi lokal, cerita baik.</p><p className={`${before ? "max-w-52 text-xl font-normal" : "max-w-80 text-2xl font-bold sm:text-3xl"} leading-[1.06] tracking-[-0.04em]`}>Mulai harimu,<br />satu seduhan baik.</p><p className="mb-4 mt-3 max-w-80 text-[10px] leading-relaxed text-[#77796b]">Biji pilihan dari petani lokal. Diseduh dengan hati, dinikmati tanpa terburu-buru.</p><span className={`inline-block rounded px-3 py-2 text-[9px] ${before ? "bg-[#85876b] text-white" : "bg-[#3e4933] font-semibold text-white"}`}>{before ? "Klik di sini" : "Lihat menu kopi →"}</span></div>
    <img src="/images/coffee.jpg" alt="Biji kopi panggang, inspirasi visual kedai Seduh" width="1200" height="800" loading={hero ? "eager" : "lazy"} className={`w-full object-cover ${hero ? "h-52 sm:h-64" : "h-48 sm:h-60"} ${before ? "object-left" : "object-center"}`} />
    <div className="flex justify-between px-4 py-3 text-[8px] text-[#77796b]"><span>Biji lokal pilihan</span><span>Diseduh setiap hari.</span></div>
  </div>;
}
