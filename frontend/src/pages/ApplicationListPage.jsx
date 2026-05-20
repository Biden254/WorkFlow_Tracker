import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { listApplications } from "../api/applications";
import ApplicationTable from "../components/ApplicationTable";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";

export default function ApplicationListPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await listApplications();
        setApplications(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load applications.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <section>
      <PageHeader
        eyebrow="Applications"
        title="Application Workflow Tracker"
        description="Monitor drafts, submissions, and reviewer outcomes from one internal workspace."
        actions={
          <Link
            to="/applications/new"
            className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            New Application
          </Link>
        }
      />

      {loading ? <LoadingSpinner label="Loading applications..." /> : null}
      {!loading && error ? <ErrorAlert message={error} /> : null}
      {!loading && !error && applications.length === 0 ? <EmptyState /> : null}
      {!loading && !error && applications.length > 0 ? <ApplicationTable applications={applications} /> : null}
    </section>
  );
}

