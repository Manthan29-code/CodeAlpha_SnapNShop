from django import template

register = template.Library()

@register.filter
def mul(value, arg):
    """Multiply the value by the argument."""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return 0

@register.filter
def currency_format(value):
    """Format currency with proper comma separation."""
    try:
        # Convert to float and format with 2 decimal places
        formatted = "{:,.2f}".format(float(value))
        return formatted
    except (ValueError, TypeError):
        return "0.00"

@register.filter
def usd_to_inr(value):
    """Convert USD price to INR."""
    try:
        usd_price = float(value)
        inr_price = usd_price * 1  # USD to INR conversion rate
        return int(round(inr_price))
    except (ValueError, TypeError):
        return 0
