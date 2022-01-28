from django.contrib import admin

from accounts.models import Guide, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = (
        "email",
        "is_active",
        "first_name",
        "last_name",
        "phone",
        "last_login",
        "created",
    )
    list_filter = ("is_active", "last_login", "created")
    search_fields = ("email", "first_name", "last_name")
    fieldsets = (
        (None, {"fields": ("email", "password", "is_active")}),
        (
            "Personal data",
            {"fields": ("first_name", "last_name", "phone", "country", "district", "description", "profile_pic", "header_pic")},
        ),
        (
            "Permissions",
            {"fields": ("is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("History", {"fields": ("date_joined", "last_login")}),
    )
    readonly_fields = ("date_joined", "last_login", "modified")
    ordering = ("-created",)

    def get_readonly_fields(self, request, obj=None):
        fields = super().get_readonly_fields(request, obj=obj)
        if obj:
            fields = fields + ("password",)
        return fields


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "subscription_plan",
        "plan_expire_date",
        "modified",
        "created",
    )
    list_filter = (
        "created",
        "subscription_plan",
        "plan_expire_date",
    )
    search_fields = (
        "user",
        "subscription_plan",
    )
    fieldsets = (
        (None, {"fields": ("user", "subscription_plan", "plan_expire_date"),}),
        ("History", {"fields": ("modified", "created")}),
    )
    readonly_fields = ("plan_expire_date", "modified", "created")
    ordering = ("-created",)

    def get_readonly_fields(self, request, obj=None):
        fields = super().get_readonly_fields(request, obj=obj)
        if obj:
            fields = fields + ("user",)
        return fields
