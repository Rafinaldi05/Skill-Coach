import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Brand } from "../landing/shared";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <header className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Brand />
          <Link to="/#pertanyaan" className="text-xs font-medium text-slate-700 hover:text-indigo-700">
            Butuh bantuan?
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-12 lg:py-14">
        {children}
      </main>
    </div>
  );
}
