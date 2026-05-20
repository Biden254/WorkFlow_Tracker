import React from "react";

import { APPLICATION_TYPES } from "../types/application";
import ErrorAlert from "./ErrorAlert";

const initialFormState = {
  applicant_name: "",
  applicant_email: "",
  company_name: "",
  application_type: APPLICATION_TYPES[0],
  description: "",
};

function validateForm(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.applicant_name.trim()) {
    errors.applicant_name = "Applicant name is required.";
  }
  if (!emailPattern.test(values.applicant_email.trim())) {
    errors.applicant_email = "Enter a valid email address.";
  }
  if (!values.company_name.trim()) {
    errors.company_name = "Company name is required.";
  }
  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  return errors;
}

export default function ApplicationForm({
  initialValues,
  onSubmit,
  submitLabel,
  saving,
  errorMessage,
}) {
  const values = initialValues || initialFormState;
  const [formValues, setFormValues] = React.useState(values);
  const [fieldErrors, setFieldErrors] = React.useState({});

  React.useEffect(() => {
    setFormValues(initialValues || initialFormState);
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = validateForm(formValues);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit({
      ...formValues,
      applicant_name: formValues.applicant_name.trim(),
      applicant_email: formValues.applicant_email.trim(),
      company_name: formValues.company_name.trim(),
      description: formValues.description.trim(),
    });
  }

  function renderInput(label, name, type = "text") {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
        <input
          type={type}
          name={name}
          value={formValues[name]}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-900"
        />
        {fieldErrors[name] ? <span className="mt-2 block text-sm text-rose-600">{fieldErrors[name]}</span> : null}
      </label>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <ErrorAlert message={errorMessage} />

      <div className="grid gap-6 md:grid-cols-2">
        {renderInput("Applicant Name", "applicant_name")}
        {renderInput("Applicant Email", "applicant_email", "email")}
        {renderInput("Company Name", "company_name")}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Application Type</span>
          <select
            name="application_type"
            value={formValues.application_type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            {APPLICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          rows="6"
          value={formValues.description}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
        />
        {fieldErrors.description ? (
          <span className="mt-2 block text-sm text-rose-600">{fieldErrors.description}</span>
        ) : null}
      </label>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
