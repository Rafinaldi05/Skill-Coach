import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterInputSchema } from "@skill-coach/shared";
import { useRegister, ApiError } from "../api";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";

// shortcut: username is derived from email (not in the design), with a random suffix to dodge collisions; if it still conflicts the user just sees the submit error.
function deriveUsername(email: string) {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").slice(0, 40) || "user";
  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = RegisterInputSchema.safeParse({ email, password, displayName, username: deriveUsername(email) });
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === "password");
      setPasswordError(issue ? "Kata sandi minimal 10 karakter dengan kombinasi huruf dan angka." : undefined);
      return;
    }
    setPasswordError(undefined);
    try {
      await register.mutateAsync(parsed.data);
      navigate("/onboarding");
    } catch {
      // registration error (e.g. email already used) is reported below via register.error
    }
  }

  return (
    <AuthLayout>
      <div>
        <span className="mb-5 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#5044b8]">
          Ruang belajar personal kamu
        </span>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-[#6256aa]">Mulai dari satu karya</p>
        <h1 className="mb-4 text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">Kamu tidak harus hebat untuk mulai.</h1>
        <p className="mb-8 text-slate-600">Simpan karya, pahami masukan, dan lihat sejauh apa kamu bertumbuh.</p>
        <div className="rounded-2xl bg-[#FFF1E5] p-7">
          <span className="mb-4 block text-2xl" aria-hidden="true">🌱</span>
          <h2 className="mb-2 text-lg font-semibold">Setiap versi punya cerita.</h2>
          <p className="text-sm leading-relaxed text-slate-700">Mulai dengan karya yang kamu punya hari ini. Karyamu tetap privat sampai kamu memilih untuk membagikannya.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200/80 bg-white p-8">
        <h2 className="mb-1.5 text-2xl font-semibold">Buat akun kamu</h2>
        <p className="mb-6 text-sm text-slate-600">Satu langkah menuju kebiasaan belajar yang lebih terarah.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-slate-800">Nama lengkap</label>
            <input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Rina Putri" required
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5044b8]/30" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rina@contoh.id" required
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5044b8]/30" />
          </div>
          <div>
            <PasswordField label="Kata sandi" value={password} onChange={setPassword} error={passwordError} />
            {!passwordError ? <p className="mt-1.5 text-xs text-slate-500">Gunakan minimal 10 karakter dengan kombinasi huruf dan angka.</p> : null}
          </div>
          {register.error ? (
            <p className="text-sm text-red-600">{register.error instanceof ApiError ? register.error.message : "Gagal membuat akun. Coba lagi."}</p>
          ) : null}
          <button type="submit" disabled={register.isPending}
            className="w-full rounded-lg bg-[#5044b8] py-3.5 text-sm font-semibold text-white hover:bg-[#403598] disabled:opacity-60">
            {register.isPending ? "Memproses..." : "Buat akun"}
          </button>
          <p className="text-xs text-slate-500">Dengan mendaftar, kamu menyetujui Ketentuan Layanan dan Kebijakan Privasi.</p>
          <p className="text-sm text-slate-700">
            Sudah punya akun? <Link to="/login" className="font-semibold text-[#5044b8] hover:underline">Masuk →</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
