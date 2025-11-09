from time import timezone
from django.conf import settings
from django.core.mail import send_mail
import logging
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

def send_purchased_items(request, establishment, purchased_items):
    grand_total = sum((item['total_price'] or 0) for item in purchased_items)

    # Render HTML template
    context = {
        'establishment': establishment,
        'user': request.user,
        'items': purchased_items,
        'grand_total': grand_total,
        'year': timezone.now().year,
        'site_url': request.build_absolute_uri('/')
    }
    html_body = render_to_string('email/buy_template.html', context)

    # Fallback plain text body
    plain_lines = [
        f"{i+1}. {it['name']} x{it['quantity']} => R$ {it['total_price']:.2f}" if it['total_price'] else f"{i+1}. {it['name']} x{it['quantity']}" 
        for i, it in enumerate(purchased_items)
    ]
    plain_text = ("Compra realizada em " + establishment.name + "\n" + "\n".join(plain_lines) + f"\nTotal: R$ {grand_total:.2f}") if purchased_items else "Nenhum item comprado."

    email_sent = False
    if purchased_items and request.user.email:
        sent_count = send_mail(
            subject=f'Purchase Confirmation from {establishment.name}',
            message=plain_text,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
            recipient_list=[request.user.email],
            html_message=html_body
        )
        email_sent = sent_count > 0
    return email_sent