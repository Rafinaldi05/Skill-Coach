import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginInputSchema } from "@skill-coach/shared";
import { useLogin, ApiError } from "../api";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = LoginInputSchema.safeParse({ email, password });
    if (!parsed.success || password.length < 10) {
      setPasswordError("Kata sandi minimal 10 karakter. Periksa lagi, ya.");
      return;
    }
    setPasswordError(undefined);
    try {
      await login.mutateAsync(parsed.data);
      navigate("/dashboard");
    } catch {
      // login error is reported below via login.error
    }
  }

  return (
    <AuthLayout>
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-[#6256aa]">Selamat datang kembali</p>
        <h1 className="mb-4 text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">Lanjutkan cerita belajarmu.</h1>
        <p className="mb-8 text-slate-600">Satu revisi lagi bisa membawa sudut pandang baru. Karya dan progresmu menunggu di ruang kerja.</p>
        <div className="rounded-2xl bg-[#EFECFA] p-7">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#6256aa]">Contoh progres</p>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-base font-semibold">Perjalanan skormu</h2>
            <span className="text-xs text-slate-600">1–10</span>
          </div>
          <svg viewBox="0 0 360 150" className="mb-3 w-full" role="img" aria-label="Contoh grafik skor dari 6.0 di versi 1 naik ke 8.0 di versi 2">
            {[0, 1, 2].map((i) => {
              const y = 20 + i * 55;
              const label = i === 0 ? "10" : i === 1 ? "5" : "1";
              return (
                <g key={i}>
                  <line x1="30" y1={y} x2="330" y2={y} stroke="#d8d4ee" strokeWidth="1" />
                  <text x="10" y={y + 4} fontSize="11" fill="#8880b8">{label}</text>
                </g>
              );
            })}
            <polyline points="50,90 310,45" fill="none" stroke="#5044b8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="90" r="4" fill="#5044b8" />
            <circle cx="310" cy="45" r="4" fill="#5044b8" />
            <text x="46" y="112" fontSize="12" fill="#5044b8" fontWeight="600">6.0 · v1</text>
            <text x="278" y="32" fontSize="12" fill="#5044b8" fontWeight="600">8.0 · v2</text>
          </svg>
          <p className="mb-4 text-xs text-slate-600">4 Nov → 6 Nov 2026 · Landing page toko kopi</p>
          <p className="text-sm leading-relaxed text-slate-700">Kemajuan bukan garis lurus. Yang penting, kamu terus mencoba.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200/80 bg-white p-8">
        <h2 className="mb-1.5 text-2xl font-semibold">Masuk ke Skill Coach</h2>
        <p className="mb-6 text-sm text-slate-600">Gunakan email yang kamu daftarkan.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rina@contoh.id" required
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5044b8]/30" />
          </div>
          <PasswordField label="Kata sandi" value={password} onChange={setPassword} error={passwordError} />
          {login.error ? (
            <p className="text-sm text-red-600">{login.error instanceof ApiError ? login.error.message : "Gagal masuk. Coba lagi."}</p>
          ) : null}
          <button type="submit" disabled={login.isPending}
            className="w-full rounded-lg bg-[#5044b8] py-3.5 text-sm font-semibold text-white hover:bg-[#403598] disabled:opacity-60">
            {login.isPending ? "Memproses..." : "Masuk"}
          </button>
          <p className="text-sm text-slate-700">
            Belum punya akun? <Link to="/register" className="font-semibold text-[#5044b8] hover:underline">Buat akun →</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
