from ninja import Router

from .schemas import (
    ApplicationCreateSchema,
    ApplicationResponseSchema,
    ApplicationUpdateSchema,
    DecisionSchema,
)
from .services import (
    ServiceError,
    create_draft,
    get_application,
    list_applications,
    record_decision,
    start_review,
    submit_application,
    update_application,
)


router = Router(tags=["Applications"])


def _handle_service_call(request, operation):
    try:
        return operation()
    except ServiceError as error:
        return request.api.create_response(request, error.to_dict(), status=error.status_code)
    except ValueError as error:
        return request.api.create_response(request, {"message": str(error)}, status=400)


@router.post("/", response={201: ApplicationResponseSchema, 400: dict})
def create_application(request, payload: ApplicationCreateSchema):
    return _handle_service_call(
        request,
        lambda: (201, create_draft(payload.model_dump())),
    )


@router.get("/", response=list[ApplicationResponseSchema])
def list_application_records(request):
    del request
    return list_applications()


@router.get("/{application_id}", response={200: ApplicationResponseSchema, 404: dict})
def get_application_record(request, application_id: int):
    return _handle_service_call(
        request,
        lambda: get_application(application_id),
    )


@router.put("/{application_id}", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def update_application_record(request, application_id: int, payload: ApplicationUpdateSchema):
    return _handle_service_call(
        request,
        lambda: update_application(application_id, payload.model_dump()),
    )


@router.post("/{application_id}/submit", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def submit_application_record(request, application_id: int):
    return _handle_service_call(
        request,
        lambda: submit_application(application_id),
    )


@router.post("/{application_id}/start-review", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def start_review_record(request, application_id: int):
    return _handle_service_call(
        request,
        lambda: start_review(application_id),
    )


@router.post("/{application_id}/decision", response={200: ApplicationResponseSchema, 400: dict, 404: dict})
def record_application_decision(request, application_id: int, payload: DecisionSchema):
    return _handle_service_call(
        request,
        lambda: record_decision(
            application_id,
            payload.decision,
            payload.reviewer_comment,
        ),
    )
