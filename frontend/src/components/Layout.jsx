import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Internal Operations
            </p>
            <Link to="/applications" className="text-xl font-semibold text-slate-900">
              Workflow Tracker
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/applications"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                location.pathname.startsWith("/applications") && !location.pathname.endsWith("/new")
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Applications
            </Link>
            <Link
              to="/applications/new"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                location.pathname === "/applications/new"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              New Application
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

