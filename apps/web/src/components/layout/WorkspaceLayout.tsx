import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  FolderClosed,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useProfile, useLogout } from "../../api";

export function WorkspaceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { data: profile } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { path: "/dashboard", label: "Beranda", icon: Home },
    { path: "/projects", label: "Proyek", icon: FolderClosed },
    { path: "/portfolio", label: "Portofolio", icon: LayoutGrid },
    { path: "/settings", label: "Pengaturan", icon: Settings },
  ];

  const firstName = profile?.displayName || "Pengguna";
  const initial = profile?.displayName?.[0]?.toUpperCase() || "?";

  const isLinkActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [dropdownOpen]);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 md:pb-0">
      <header className="border-b border-stone-200/60 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-12">
          <Link to="/dashboard" className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg bg-[#5044b8] text-sm font-bold text-white">
              S.
            </span>
            <span>skill coach</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active ? "font-semibold text-[#5044B8]" : "text-slate-700 hover:text-[#5044B8]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Dropdown */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="grid size-8 place-items-center rounded-full bg-stone-200/80 text-xs font-semibold text-slate-700">
                {initial}
              </div>
              <span>{firstName}</span>
              <ChevronDown className="size-4 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-48 rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                <div className="border-b border-stone-100 px-4 py-2">
                  <p className="text-sm font-medium text-slate-900">{profile?.displayName || "Pengguna"}</p>
                  <p className="text-xs text-slate-500">{profile?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="size-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label="Menu akun"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-[#5044B8] hover:bg-indigo-50 md:hidden"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-stone-100 bg-white px-5 py-3 md:hidden">
            <div className="mb-2 flex items-center gap-3 pb-2">
              <div className="grid size-8 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-slate-700">
                {initial}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{profile?.displayName || "Pengguna"}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white px-2 py-2 md:hidden"
      >
        <div className="grid grid-cols-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition ${
                  active ? "font-semibold text-[#5044B8]" : "text-slate-600 hover:text-[#5044B8]"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.75} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}