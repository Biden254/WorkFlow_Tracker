from dataclasses import dataclass
from typing import Any

from django.db import transaction
from django.utils import timezone

from .models import Application, ApplicationStatus
from .validators import (
    ensure_comment_when_required,
    ensure_editable,
    ensure_transition_allowed,
    validate_email_address,
)


@dataclass
class ServiceError(Exception):
    message: str
    status_code: int = 400
    details: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        payload = {"message": self.message}
        if self.details:
            payload["details"] = self.details
        return payload


def _get_application_or_raise(application_id: int) -> Application:
    try:
        return Application.objects.get(id=application_id)
    except Application.DoesNotExist as exc:
        raise ServiceError("Application not found.", status_code=404) from exc


def _validate_application_fields(payload: dict[str, Any]) -> None:
    validate_email_address(payload["applicant_email"])


@transaction.atomic
def create_draft(payload: dict[str, Any]) -> Application:
    _validate_application_fields(payload)
    return Application.objects.create(**payload, status=ApplicationStatus.DRAFT)


def list_applications() -> list[Application]:
    return list(Application.objects.all())


def get_application(application_id: int) -> Application:
    return _get_application_or_raise(application_id)


@transaction.atomic
def update_application(application_id: int, payload: dict[str, Any]) -> Application:
    application = _get_application_or_raise(application_id)
    ensure_editable(application.status)
    _validate_application_fields(payload)

    for field, value in payload.items():
        setattr(application, field, value)

    application.save()
    return application


@transaction.atomic
def submit_application(application_id: int) -> Application:
    application = _get_application_or_raise(application_id)
    ensure_transition_allowed(application.status, ApplicationStatus.SUBMITTED)
    application.status = ApplicationStatus.SUBMITTED
    application.submitted_at = timezone.now()
    application.save(update_fields=["status", "submitted_at", "updated_at"])
    return application


@transaction.atomic
def start_review(application_id: int) -> Application:
    application = _get_application_or_raise(application_id)
    ensure_transition_allowed(application.status, ApplicationStatus.UNDER_REVIEW)
    application.status = ApplicationStatus.UNDER_REVIEW
    application.save(update_fields=["status", "updated_at"])
    return application


@transaction.atomic
def record_decision(application_id: int, decision: str, reviewer_comment: str) -> Application:
    application = _get_application_or_raise(application_id)
    ensure_transition_allowed(application.status, decision)
    ensure_comment_when_required(decision, reviewer_comment)

    application.status = decision
    application.reviewer_comment = reviewer_comment.strip()
    application.reviewed_at = timezone.now()
    application.save(update_fields=["status", "reviewer_comment", "reviewed_at", "updated_at"])
    return application
