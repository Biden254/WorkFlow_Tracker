import re

from .models import ApplicationStatus


ALLOWED_TRANSITIONS = {
    ApplicationStatus.DRAFT: {ApplicationStatus.SUBMITTED},
    ApplicationStatus.SUBMITTED: {ApplicationStatus.UNDER_REVIEW},
    ApplicationStatus.UNDER_REVIEW: {
        ApplicationStatus.APPROVED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.NEED_MORE_INFORMATION,
    },
    ApplicationStatus.NEED_MORE_INFORMATION: {ApplicationStatus.SUBMITTED},
    ApplicationStatus.APPROVED: set(),
    ApplicationStatus.REJECTED: set(),
}

EDITABLE_STATUSES = {
    ApplicationStatus.DRAFT,
    ApplicationStatus.NEED_MORE_INFORMATION,
}

COMMENT_REQUIRED_STATUSES = {
    ApplicationStatus.NEED_MORE_INFORMATION,
    ApplicationStatus.REJECTED,
}

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_email_address(value: str) -> None:
    if not EMAIL_PATTERN.match(value or ""):
        raise ValueError("Applicant email must be a valid email address.")


def ensure_editable(status: str) -> None:
    if status not in EDITABLE_STATUSES:
        raise ValueError("Only draft or need more information applications can be edited.")


def ensure_transition_allowed(current_status: str, next_status: str) -> None:
    allowed_statuses = ALLOWED_TRANSITIONS.get(current_status, set())
    if next_status not in allowed_statuses:
        raise ValueError(f"Transition from '{current_status}' to '{next_status}' is not allowed.")


def ensure_comment_when_required(decision: str, reviewer_comment: str) -> None:
    if decision in COMMENT_REQUIRED_STATUSES and not (reviewer_comment or "").strip():
        raise ValueError(f"Reviewer comment is required when decision is '{decision}'.")

