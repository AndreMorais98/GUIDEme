from calendar import FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY
from django.db import models
from django_extensions.db.models import TimeStampedModel

from accounts.models import Guide, User


class Experience(TimeStampedModel):
    class ExperienceType:
        ONE_DATE = 1
        PERIODIC = 2

        choices = (
            (ONE_DATE, "one day"),
            (PERIODIC, "periodic")
        )

    type = models.IntegerField("type", choices=ExperienceType.choices, default=ExperienceType.ONE_DATE)
    date = models.DateTimeField("one time date", null=True, blank=True)
    keywords = models.TextField("keywords", null=True)
    location = models.CharField("location", max_length=254 , db_index=True, default="")
    start_date = models.DateField("periodic start date", null=True, blank=True)
    title = models.CharField("title", max_length=128, db_index=True)
    description = models.TextField("description", default="")
    duration = models.IntegerField("hours duration", default=0)
    participants_limit = models.IntegerField("participants limit", default=10)
    price = models.FloatField("price", default=0)
    active = models.BooleanField("is active?", default=True)
    guide = models.ForeignKey(Guide, on_delete=models.CASCADE, related_name="experiences")

    class Meta:
        verbose_name = "experience"
        verbose_name_plural = "experiences"

    def __str__(self) -> str:
        return self.title


class Schedule(models.Model):
    class WeekDays:
        choices = (
            (MONDAY, "monday"),
            (TUESDAY, "tuesday"),
            (WEDNESDAY, "wednesday"),
            (THURSDAY, "thursday"),
            (FRIDAY, "friday"),
            (SATURDAY, "saturday"),
            (SUNDAY, "sunday"),
        )
    week_day = models.IntegerField("week day", choices=WeekDays.choices)
    time = models.TimeField("time")
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name="schedule")

    class Meta:
        verbose_name = "schedule"
        verbose_name_plural = "schedules"



class ExperienceTicket(TimeStampedModel):
    date = models.DateTimeField("experience date")
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name="+")

    class Meta:
        verbose_name = "experience ticket"
        verbose_name_plural = "experience tickets"


class ExperienceImage(models.Model):
    """ """

    url = models.URLField("image url", default="https://i.imgur.com/ExjELDm.jpg")
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name="images")

    class Meta:
        verbose_name= "experience image"
        verbose_name_plural = "experience images"


class ExperienceReview(TimeStampedModel):
    """ """

    comment = models.CharField("comment", max_length=300, default="")
    rating = models.IntegerField("rating", default=5) # 0-5
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_experiences")
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name="reviews")

    class Meta:
        verbose_name = "experience review"
        verbose_name = "experience reviews"


class GuideReview(TimeStampedModel):
    """ """

    comment = models.CharField("comment", max_length=300, default="")
    rating = models.IntegerField("rating", default=5) # 0-5
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_guides")
    guide = models.ForeignKey(Guide, on_delete=models.CASCADE, related_name="reviews")

    class Meta:
        verbose_name = "guide review"
        verbose_name = "guide reviews"
