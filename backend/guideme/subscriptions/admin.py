from django.contrib import admin

from subscriptions.models import SubscriptionPlan

# Register your models here.

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):

    list_display = (
        "designation",
        "price",
        "duration",
        "modified",
        "created",
    )
    list_filter = ("created", "duration")
    search_fields = ("slug", "designation",)
    fieldsets = (
        (None, {"fields": ("slug", "designation", "description", "price", "duration")}),
        ("History", {"fields": ("modified", "created")}),
    )
    readonly_fields = ("modified", "created")
    ordering = ("-created",)
