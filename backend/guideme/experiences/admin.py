from django.contrib import admin
from .forms import ExperienceForm

from experiences.models import Experience, ExperienceTicket


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):

    form = ExperienceForm
    list_display = (
        "type",
        "title",
        "price",
        "guide",
        "created",
        "active",
    )
    list_filter = ("created", "active")
    search_fields = ("guide", "title")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "type",
                    "title",
                    "date",
                    "keywords",
                    "location",
                    "start_date",
                    "description",
                    "duration",
                    "participants_limit",
                    "price",
                    "guide",
                    "schedule",
                    "images",
                )
            },
        ),
        ("History", {"fields": ("modified", "created")}),
    )
    readonly_fields = ("modified", "created")
    ordering = ("-created",)

    def save_form(self, request, form, change):
        """
        Given a ModelForm return an unsaved instance. ``change`` is True if
        the object is being changed, and False if it's being added.
        """
        return form.save()


@admin.register(ExperienceTicket)
class ExperienceTicketAdmin(admin.ModelAdmin):
    list_display = ("date", "participant", "experience", "created")
    list_filter = ("created",)
    search_fields = ("experience", "participant")
    fieldsets = (
        (
            None, {
                "fields": (
                    "date",
                    "participant",
                    "experience",
                )
            }
        ),
        ("History", {"fields": ("created",)}),
    )
    readonly_fields = ("created",)
    ordering = ("-created",)
