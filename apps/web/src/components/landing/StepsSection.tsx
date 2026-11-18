import { card, SectionHeading } from "./shared";
const steps = [
  ["Unggah karya", "Bawa desain, kode, atau tulisan yang sedang kamu kerjakan. Ceritakan tujuanmu."],
  ["Pahami review", "Temukan kekuatan dan perbaikan spesifik beserta alasan serta contohnya."],
  ["Revisi, lalu lihat progres", "Unggah versi baru di proyek yang sama. Perubahanmu menjadi lebih terlihat."],
];
export function StepsSection() {
  return <section id="cara-kerja" className="scroll-mt-8 pb-16"><SectionHeading label="01 / Ritme belajar yang sederhana">Satu karya. Tiga langkah maju.</SectionHeading><div className="grid gap-5 md:grid-cols-3">{steps.map(([title, text], i) => <article key={title} className={`${card} p-6`}><span className="text-2xl font-light text-[#6256aa]">0{i + 1}</span><h3 className="mb-3 mt-5 text-lg font-semibold tracking-tight">{title}</h3><p className="text-sm leading-relaxed text-stone-500">{text}</p></article>)}</div></section>;
}
