import React from "react";

import { DECISION_OPTIONS, STATUSES } from "../types/application";
import ErrorAlert from "./ErrorAlert";

export default function DecisionModal({
  isOpen,
  onClose,
  onSubmit,
  saving,
  errorMessage,
  defaultDecision = STATUSES.APPROVED,
}) {
  const [decision, setDecision] = React.useState(defaultDecision);
  const [reviewerComment, setReviewerComment] = React.useState("");
  const [fieldError, setFieldError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setDecision(defaultDecision);
      setReviewerComment("");
      setFieldError("");
    }
  }, [defaultDecision, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedComment = reviewerComment.trim();

    if (
      (decision === STATUSES.REJECTED || decision === STATUSES.NEED_MORE_INFORMATION) &&
      !trimmedComment
    ) {
      setFieldError("Reviewer comment is required for this decision.");
      return;
    }

    setFieldError("");
    await onSubmit({ decision, reviewer_comment: trimmedComment });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Record reviewer decision</h2>
            <p className="mt-2 text-sm text-slate-600">
              Capture the review outcome and required comments before closing the review.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <ErrorAlert message={errorMessage || fieldError} />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Decision</span>
            <select
              value={decision}
              onChange={(event) => setDecision(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            >
              {DECISION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Reviewer Comment</span>
            <textarea
              rows="5"
              value={reviewerComment}
              onChange={(event) => setReviewerComment(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="Add context for the applicant or internal team"
            />
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save decision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

