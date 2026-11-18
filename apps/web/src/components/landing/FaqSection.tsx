import { card, SectionHeading } from "./shared";
const questions = [
  ["Apakah AI menggantikan mentor manusia?", "Tidak. Skill Coach membantu refleksi dan latihan mandiri. Review AI bisa keliru; gunakan penilaian kamu dan diskusikan keputusan penting dengan mentor manusia."],
  ["Apakah karyaku langsung dipublikasikan?", "Tidak. Proyek baru bersifat privat secara default. Kamu memilih sendiri proyek yang tampil di portofolio publik."],
  ["Apa bedanya proyek dan versi?", "Satu proyek menyimpan satu karya beserta tujuannya. Setiap unggahan revisi menjadi versi baru dengan satu review AI per versi."],
  ["Bisakah aku mereview video?", "Belum. Saat ini Skill Coach mendukung gambar desain UI, kode, serta teks dan esai dengan ukuran berkas maksimal 5 MB."],
];
export function FaqSection() {
  return <section id="pertanyaan" className="scroll-mt-8 pb-10"><SectionHeading label="07 / Sebelum mulai melangkah">Pertanyaan yang mungkin kamu punya.</SectionHeading><div className="space-y-4">{questions.map(([question, answer]) => <details open key={question} className={`${card} group px-5 py-5 sm:px-6`}><summary className="cursor-pointer text-sm font-semibold marker:text-[#6256aa]">{question}</summary><p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-500">{answer}</p></details>)}</div></section>;
}
