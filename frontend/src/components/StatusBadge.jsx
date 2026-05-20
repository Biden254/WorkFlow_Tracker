import { statusClassNames } from "../utils/status";

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassNames[status] || "bg-slate-200 text-slate-700"}`}
    >
      {status}
    </span>
  );
}

