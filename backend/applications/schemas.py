from datetime import datetime
from typing import Literal

from ninja import Schema
from pydantic import field_validator

from .models import ApplicationStatus, ApplicationType
from .validators import validate_email_address


class ApplicationBaseSchema(Schema):
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: Literal[
        ApplicationType.RECORDATION,
        ApplicationType.RENEWAL,
        ApplicationType.CHANGE_OF_OWNERSHIP,
        ApplicationType.CHANGE_OF_NAME,
        ApplicationType.DISCONTINUATION,
    ]
    description: str

    @field_validator("applicant_name", "company_name", "description")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field is required.")
        return value

    @field_validator("applicant_email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip()
        validate_email_address(value)
        return value


class ApplicationCreateSchema(ApplicationBaseSchema):
    pass


class ApplicationUpdateSchema(ApplicationBaseSchema):
    pass


class ApplicationResponseSchema(ApplicationBaseSchema):
    id: int
    tracking_number: str
    status: Literal[
        ApplicationStatus.DRAFT,
        ApplicationStatus.SUBMITTED,
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.NEED_MORE_INFORMATION,
        ApplicationStatus.APPROVED,
        ApplicationStatus.REJECTED,
    ]
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None = None
    reviewed_at: datetime | None = None


class DecisionSchema(Schema):
    decision: Literal[
        ApplicationStatus.APPROVED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.NEED_MORE_INFORMATION,
    ]
    reviewer_comment: str = ""


class MessageSchema(Schema):
    message: str
    details: dict | None = None

