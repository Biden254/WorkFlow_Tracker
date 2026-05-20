import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createApplication, getApplication, updateApplication } from "../api/applications";
import ApplicationForm from "../components/ApplicationForm";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { STATUSES } from "../types/application";

export default function ApplicationFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");
  const { loading: saving, error, run, setError } = useAsyncAction();

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    async function loadApplication() {
      try {
        const data = await getApplication(id);
        if (![STATUSES.DRAFT, STATUSES.NEED_MORE_INFORMATION].includes(data.status)) {
          setError("This application can no longer be edited.");
          return;
        }

        setInitialValues({
          applicant_name: data.applicant_name,
          applicant_email: data.applicant_email,
          company_name: data.company_name,
          application_type: data.application_type,
          description: data.description,
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id, mode, setError]);

  async function handleSubmit(payload) {
    await run(async () => {
      const response =
        mode === "create" ? await createApplication(payload) : await updateApplication(id, payload);
      navigate(`/applications/${response.id}`);
    });
  }

  return (
    <section>
      <PageHeader
        eyebrow={mode === "create" ? "New Draft" : "Update Draft"}
        title={mode === "create" ? "Create Application Draft" : "Edit Application"}
        description="Capture the application details before moving the workflow into submission and review."
        actions={
          <Link
            to="/applications"
            className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to list
          </Link>
        }
      />

      {loading ? <LoadingSpinner label="Loading application..." /> : null}
      {!loading && mode === "edit" && !initialValues ? <ErrorAlert message={error} /> : null}
      {!loading && (mode === "create" || initialValues) ? (
        <ApplicationForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={mode === "create" ? "Save Draft" : "Save Changes"}
          saving={saving}
          errorMessage={error}
        />
      ) : null}
    </section>
  );
}
