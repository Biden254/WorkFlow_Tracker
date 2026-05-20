from django.db.models import Max
from django.utils import timezone


def generate_tracking_number(model_class) -> str:
    year = timezone.now().year
    prefix = f"APP-{year}-"
    latest = (
        model_class.objects.filter(tracking_number__startswith=prefix)
        .aggregate(max_tracking_number=Max("tracking_number"))
        .get("max_tracking_number")
    )

    if not latest:
        sequence = 1
    else:
        sequence = int(latest.rsplit("-", 1)[-1]) + 1

    return f"{prefix}{sequence:04d}"

