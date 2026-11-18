import { useId, useState } from "react";

export function PasswordField({ label, value, onChange, error, placeholder = "••••••••••••" }: { label: string; value: string; onChange: (value: string) => void; error?: string; placeholder?: string }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800">{label}</label>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full rounded-lg border bg-white px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-[#5044b8]/30 ${error ? "border-red-400" : "border-stone-200"}`} />
        <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
          <span className={`block size-2.5 rounded-full border-2 ${visible ? "border-[#5044b8] bg-[#5044b8]" : "border-slate-400"}`} />
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
