import { Link } from "react-router-dom";

import { formatDate } from "../utils/date";
import StatusBadge from "./StatusBadge";

export default function ApplicationTable({ applications }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <th className="px-5 py-4">Tracking Number</th>
              <th className="px-5 py-4">Applicant</th>
              <th className="px-5 py-4">Company</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((application) => (
              <tr key={application.id} className="text-sm text-slate-700">
                <td className="whitespace-nowrap px-5 py-4">
                  <Link
                    to={`/applications/${application.id}`}
                    className="font-semibold text-slate-900 hover:text-blue-700"
                  >
                    {application.tracking_number}
                  </Link>
                </td>
                <td className="px-5 py-4">{application.applicant_name}</td>
                <td className="px-5 py-4">{application.company_name}</td>
                <td className="px-5 py-4">{application.application_type}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={application.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4">{formatDate(application.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

