import { card, SectionHeading } from "./shared";
const categories = [
  { icon: "▤", title: "Desain UI", text: "Hierarki visual, konsistensi, aksesibilitas, dan kejelasan CTA.", badge: "Gambar PNG, JPG, atau WebP" },
  { icon: "</>", title: "Kode", text: "Logika, keterbacaan, penanganan error, dan struktur kode.", badge: "Unggah berkas atau tempel kode" },
  { icon: "✎", title: "Teks & esai", text: "Argumen, alur gagasan, bukti pendukung, dan gaya bahasa.", badge: "Unggah teks atau tempel tulisan" },
];
export function CategoriesSection() {
  return <section className="pb-16"><SectionHeading label="02 / Ruang untuk keahlianmu">Belajar lewat hal yang kamu buat.</SectionHeading><div className="grid gap-5 md:grid-cols-3">{categories.map(item => <article key={item.title} className={`${card} p-6`}><span aria-hidden="true" className="text-2xl text-[#6256aa]">{item.icon}</span><h3 className="mb-3 mt-4 text-lg font-semibold">{item.title}</h3><p className="mb-4 text-sm leading-relaxed text-stone-500">{item.text}</p><span className="inline-block rounded-full bg-stone-100 px-2.5 py-1 text-[10px] text-stone-600">{item.badge}</span></article>)}</div><p className="mt-5 text-xs text-stone-500">Maksimal 5 MB per berkas. Video belum didukung.</p></section>;
}
