import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you requested does not exist or may have been moved.
      </p>
      <Link
        to="/applications"
        className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
      >
        Return to applications
      </Link>
    </div>
  );
}

