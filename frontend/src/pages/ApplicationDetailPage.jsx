import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getApplication,
  recordDecision,
  startReview,
  submitApplication,
} from "../api/applications";
import DecisionModal from "../components/DecisionModal";
import DetailField from "../components/DetailField";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { STATUSES } from "../types/application";
import { formatDateTime } from "../utils/date";

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultDecision, setDefaultDecision] = useState(STATUSES.APPROVED);
  const [pageError, setPageError] = useState("");
  const { loading: actionLoading, error: actionError, run, setError } = useAsyncAction();

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await getApplication(id);
        setApplication(data);
      } catch (err) {
        setPageError(err?.response?.data?.message || "Unable to load application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id]);

  async function refreshApplication() {
    const data = await getApplication(id);
    setApplication(data);
    return data;
  }

  async function handleSubmit() {
    await run(async () => {
      await submitApplication(id);
      await refreshApplication();
    });
  }

  async function handleStartReview() {
    await run(async () => {
      await startReview(id);
      await refreshApplication();
    });
  }

  async function handleDecision(payload) {
    await run(async () => {
      await recordDecision(id, payload);
      await refreshApplication();
      setModalOpen(false);
    });
  }

  function openDecisionModal(decision) {
    setError("");
    setDefaultDecision(decision);
    setModalOpen(true);
  }

  function renderActions() {
    if (!application) {
      return null;
    }

    switch (application.status) {
      case STATUSES.DRAFT:
        return (
          <>
            <Link
              to={`/applications/${application.id}/edit`}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
            >
              Submit
            </button>
          </>
        );
      case STATUSES.SUBMITTED:
        return (
          <button
            type="button"
            onClick={handleStartReview}
            disabled={actionLoading}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            Start Review
          </button>
        );
      case STATUSES.UNDER_REVIEW:
        return (
          <>
            <button
              type="button"
              onClick={() => openDecisionModal(STATUSES.APPROVED)}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => openDecisionModal(STATUSES.REJECTED)}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => openDecisionModal(STATUSES.NEED_MORE_INFORMATION)}
              className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600"
            >
              Need More Information
            </button>
          </>
        );
      case STATUSES.NEED_MORE_INFORMATION:
        return (
          <>
            <Link
              to={`/applications/${application.id}/edit`}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={actionLoading}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
            >
              Resubmit
            </button>
          </>
        );
      default:
        return null;
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading application..." />;
  }

  if (pageError) {
    return <ErrorAlert message={pageError} />;
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Application Detail"
        title={application.tracking_number}
        description="Review the full application record, timing history, and the next workflow actions."
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate("/applications")}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to list
            </button>
            {renderActions()}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Current Status</p>
                <div className="mt-3">
                  <StatusBadge status={application.status} />
                </div>
              </div>
              {application.reviewer_comment ? (
                <div className="max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Reviewer Comment
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{application.reviewer_comment}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <DetailField label="Applicant Name" value={application.applicant_name} />
              <DetailField label="Applicant Email" value={application.applicant_email} />
              <DetailField label="Company Name" value={application.company_name} />
              <DetailField label="Application Type" value={application.application_type} />
            </div>

            <div className="mt-4">
              <DetailField label="Description" value={application.description} />
            </div>
          </div>

          {actionError ? <ErrorAlert message={actionError} /> : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
            <div className="mt-4 space-y-4">
              <DetailField label="Created" value={formatDateTime(application.created_at)} />
              <DetailField label="Updated" value={formatDateTime(application.updated_at)} />
              <DetailField label="Submitted" value={formatDateTime(application.submitted_at)} />
              <DetailField label="Reviewed" value={formatDateTime(application.reviewed_at)} />
            </div>
          </div>
        </div>
      </div>

      <DecisionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleDecision}
        saving={actionLoading}
        errorMessage={actionError}
        defaultDecision={defaultDecision}
      />
    </section>
  );
}

