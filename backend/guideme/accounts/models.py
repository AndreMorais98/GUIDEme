from accounts.managers import AccountUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django_extensions.db.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField

from subscriptions.models import SubscriptionPlan


class User(AbstractUser, TimeStampedModel):
    """ """

    username = None
    email = models.EmailField("email address", db_index=True, unique=True)

    phone = PhoneNumberField("phone number", blank=True)
    description = models.CharField("description", max_length=150, blank=True)
    country = models.CharField("country", max_length=50, blank=True)
    district = models.CharField("district", max_length=50, blank=True)
    profile_pic = models.URLField("profile pic", default="https://i.kym-cdn.com/entries/icons/original/000/017/618/pepefroggie.jpg")
    header_pic = models.URLField("header pic", default="https://i.imgur.com/ExjELDm.jpg")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = AccountUserManager()

    def __str__(self) -> str:
        return self.email

    @property
    def is_guide(self):
        return hasattr(self, "guide_profile")


class Guide(TimeStampedModel):
    """ """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="guide_profile")
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, blank=True, null=True, related_name="subscribers")
    plan_expire_date = models.DateField("plan expire date", blank=True, null=True)

    class Meta:
        verbose_name="guide"
        verbose_name_plural="guides"

    def __str__(self):
        return self.user.__str__()
