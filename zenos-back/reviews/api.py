import os
from django.core.mail import send_mail
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

def send_dicts_email(items: List[Dict], to_email: str, subject: str = "Data Summary") -> bool:
    """
    Send an email containing a formatted representation of a list of dictionaries.
    SMTP settings are read from environment variables:
      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
    Returns True on success, False on failure.
    """
    if not isinstance(items, list) or not all(isinstance(d, dict) for d in items):
        raise ValueError("items must be a list of dicts")
    if not to_email:
        raise ValueError("to_email required")

    lines = []
    for i, d in enumerate(items, start=1):
        parts = [f"{k}={repr(v)}" for k, v in sorted(d.items())]
        lines.append(f"Item {i}: " + ", ".join(parts))
    body = "\n".join(lines) if lines else "No data."

    try:
        sent = send_mail(
            subject,
            body,
            os.getenv("FROM_EMAIL"),
            [to_email]
        )
        logger.info("send_mail returned count=%s to=%s", sent, to_email)
        return sent > 0
    except Exception as e:
        logger.exception("Failed to send email to %s: %s", to_email, e)
        return False