import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No applications yet</h2>
      <p className="mt-2 text-sm text-slate-600">
        Create the first draft to start tracking submissions and reviewer outcomes.
      </p>
      <Link
        to="/applications/new"
        className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Create application
      </Link>
    </div>
  );
}

