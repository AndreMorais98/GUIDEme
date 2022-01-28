from django.utils import timezone
from django.db import models
from django_extensions.db.models import TimeStampedModel
from dateutil.relativedelta import relativedelta


class SubscriptionPlan(TimeStampedModel):
    slug = models.SlugField("subscription slug", unique=True)
    designation = models.CharField("designation", max_length=128)
    description = models.CharField("comment", max_length=150, default="")
    price = models.FloatField("price")

    class Duration:
        MONTHLY = 1
        SEMESTERLY = 2
        ANUALLY = 3

        choices = (
            (MONTHLY, "monthly"),
            (SEMESTERLY, "semesterly"),
            (ANUALLY, "annually"),
        )

    duration = models.IntegerField("duration", choices=Duration.choices)

    class Meta:
        verbose_name = "subscription plan"
        verbose_name_plural = "subscription plans"

    def __str__(self):
        return self.designation

    def expire_date(self):
        if self.duration == self.Duration.MONTHLY:
            months = 1
        if self.duration == self.Duration.SEMESTERLY:
            months = 6
        if self.duration == self.Duration.ANUALLY:
            months = 12
        return timezone.now().date() + relativedelta(months=months) if months else None
