from calendar import c
from datetime import datetime
from django.utils import timezone
from django.conf import settings
from django.forms import ValidationError
from rest_framework import serializers
from accounts.models import User

from experiences.models import (
    Experience,
    ExperienceImage,
    ExperienceReview,
    ExperienceTicket,
    GuideReview,
    Schedule,
)
from .utils import week_day_to_str


class ScheduleSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = Schedule
        fields = ("week_day", "time")


class ExperienceSerializer(serializers.ModelSerializer):
    """ """

    schedule = ScheduleSerializer(many=True, write_only=True, required=False)
    images = serializers.ListField(
        child=serializers.URLField(write_only=True), write_only=True
    )

    class Meta:
        model = Experience
        fields = (
            "pk",
            "type",
            "title",
            "description",
            "duration",
            "price",
            "participants_limit",
            "date",
            "keywords",
            "location",
            "start_date",
            "schedule",
            "images",
        )
        read_only_fields = ("pk",)
        extra_kwargs = {
            "type": {"write_only": True},
            "date": {"write_only": True},
            "location": {"write_only": True},
            "keywords": {"write_only": True},
            "start_date": {"write_only": True},
            "participants_limit": {"write_only": True},
            "title": {"write_only": True},
            "description": {"write_only": True},
            "duration": {"write_only": True},
            "price": {"write_only": True},
        }

    def validate(self, attrs):
        if attrs["type"] == Experience.ExperienceType.ONE_DATE and not attrs["date"]:
            raise ValidationError("One date experiences needs a specific date")
        if attrs["type"] == Experience.ExperienceType.PERIODIC:
            if not attrs["schedule"]:
                raise ValidationError("Periodic experiences need a schedule")
            if not attrs["start_date"]:
                raise ValidationError("Periodic experiences need a start date")
        return super().validate(attrs)

    def create(self, validated_data):
        schedule = validated_data.pop("schedule", [])
        images = validated_data.pop("images", [])
        validated_data["guide"] = self.context["request"].user.guide_profile
        instance = super().create(validated_data)
        if instance:
            for daytime in schedule:
                daytime["experience"] = instance
                Schedule.objects.create(**daytime)
            for image in images:
                ExperienceImage.objects.create(url=image, experience=instance)
            if not images:
                ExperienceImage.objects.create(experience=instance)
        return instance

    def update(self, instance, validated_data):
        schedule = validated_data.pop("schedule", [])
        images = validated_data.pop("images", [])
        instance = super().update(instance, validated_data)
        if instance:
            Schedule.objects.filter(experience=instance).delete()
            for daytime in schedule:
                daytime["experience"] = instance
                Schedule.objects.create(**daytime)
            ExperienceImage.objects.filter(experience=instance).delete()
            for image in images:
                ExperienceImage.objects.create(url=image, experience=instance)
            if not images:
                ExperienceImage.objects.create(experience=instance)
        return instance


class ExperienceDetailSerializer(serializers.ModelSerializer):
    """ """

    schedule = ScheduleSerializer(many=True)
    images = serializers.ListField(child=serializers.URLField())
    reviews = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField(required=False)
    num_rating = serializers.SerializerMethodField(required=False)
    can_book = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()
    can_review = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = (
            "pk",
            "type",
            "guide",
            "active",
            "title",
            "description",
            "duration",
            "location",
            "keywords",
            "rating",
            "num_rating",
            "price",
            "participants_limit",
            "date",
            "start_date",
            "schedule",
            "images",
            "reviews",
            "can_cancel",
            "can_book",
            "can_review",
        )
        read_only_fields = fields

    def get_rating(self, obj):
        qs = ExperienceReview.objects.filter(experience=obj)
        if qs.exists():
            rating = list(qs.values_list("rating", flat=True))
            res = sum(rating) / len(rating)
            return "{:.2f}".format(res)

    def get_num_rating(self, obj):
        return ExperienceReview.objects.filter(experience=obj).count()

    def get_comments(self, obj):
        return list(
            obj.reviews.order_by("-created").values(
                "user", "rating", "comment", "created"
            )
        )

    def to_representation(self, instance):
        ret = {}
        ret["type"] = instance.type
        ret["date"] = (
            instance.date.strftime("%d %b %y %H:%M") if instance.date else None
        )
        ret["start_date"] = (
            instance.start_date.strftime("%d %b %y") if instance.start_date else None
        )
        ret["title"] = instance.title
        ret["active"] = instance.active
        ret["participants_limit"] = instance.participants_limit
        ret["description"] = instance.description
        ret["duration"] = instance.duration
        ret["price"] = instance.price
        ret["location"] = instance.location
        ret["keywords"] = instance.keywords.split(", ")
        ret["rating"] = self.get_rating(instance)
        ret["num_rating"] = self.get_num_rating(instance)
        guide = instance.guide
        ret["guide"] = {
            "pk": guide.user.pk,
            "name": guide.user.get_full_name(),
            "image": guide.user.profile_pic,
        }
        schedule_d = {}
        schedule = list(instance.schedule.values_list("week_day", "time"))
        for k, v in schedule:
            key = week_day_to_str(k)
            new = v.strftime("%H:%M")
            exist = schedule_d.get(key, None)
            if exist:
                new = exist + " | " + v.strftime("%H:%M")
            schedule_d[key] = new
        ret["schedule"] = []
        for k, v in schedule_d.items():
            ret["schedule"].append({"week_day": k, "time": v})
        ret["images"] = list(instance.images.values_list("url", flat=True))
        ret["reviews"] = list(
            instance.reviews.order_by("-created").values(
                "pk", "user", "rating", "comment", "created"
            )
        )
        for rev in ret["reviews"]:
            user = User.objects.get(pk=rev.pop("user"))
            rev["user"] = {
                "pk": user.pk,
                "name": user.get_full_name(),
                "image": user.profile_pic,
            }
            rev["created"] = rev["created"].strftime("%d %b %y")
        user = self.context["request"].user
        ret["can_book"] = (
            instance.active
            and (
                instance.type == Experience.ExperienceType.PERIODIC
                or (
                    instance.type == Experience.ExperienceType.ONE_DATE
                    and not user.tickets.filter(experience=instance).exists()
                )
            )
            and (
                not user.is_guide
                or (user.is_guide and not instance.guide == user.guide_profile)
            )
        )
        ret["can_cancel"] = (
            instance.active
            and user.is_guide
            and instance.guide == user.guide_profile
            and (
                not instance.date
                or (
                    instance.type == Experience.ExperienceType.ONE_DATE
                    and timezone.now() + timezone.timedelta(days=3) < instance.date
                )
            )
        )
        avaib_exp = ExperienceTicket.objects.filter(
            participant=self.context["request"].user, date__lt=timezone.now()
        ).values_list("experience", flat=True)
        ret["can_review"] = instance.pk in avaib_exp
        return ret


class BookExperienceSerializer(serializers.ModelSerializer):
    """ """

    date = serializers.DateField(write_only=True, required=False)
    time = serializers.TimeField(write_only=True, required=False)
    check = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = ExperienceTicket
        fields = ("pk", "date", "time", "check")
        read_only_fields = ("pk",)

    def validate(self, attrs):
        experience = self.context["experience"]
        _date = attrs.pop("date", None)
        _time = attrs.pop("time", None)
        if (
            not experience.active
            or ExperienceTicket.objects.filter(
                participant=self.context["request"].user,
                experience=experience,
                date=datetime.combine(_date, _time),
            ).exists()
        ):
            raise ValidationError(
                "Experience is cancelled or you already have a ticket for that date and time"
            )
        if experience.type == Experience.ExperienceType.ONE_DATE:
            if (
                not ExperienceTicket.objects.filter(experience=experience).count()
                < experience.participants_limit
            ):
                raise ValidationError("Experience sold out!")
            date = experience.date
        if experience.type == Experience.ExperienceType.PERIODIC:
            if _date and _time:
                if _date < experience.start_date or _date.weekday() not in list(
                    experience.schedule.values_list("week_day", flat=True)
                ):
                    raise ValidationError("You can't book that experience in that day")
                if _time not in list(
                    experience.schedule.filter(week_day=_date.weekday()).values_list(
                        "time", flat=True
                    )
                ):
                    raise ValidationError(
                        "You can't book that experience in that day-time"
                    )
                date = datetime.combine(_date, _time)
                if (
                    not ExperienceTicket.objects.filter(
                        experience=experience, date=date
                    ).count()
                    < experience.participants_limit
                ):
                    raise ValidationError("Experience sold out!")
            else:
                raise ValidationError("You need to specify the date and time")
        attrs["date"] = date
        return super().validate(attrs)

    def save(self, **kwargs):
        validated_data = {**self.validated_data, **kwargs}
        if validated_data.get("check", None):
            return None
        user = self.context["request"].user
        experience = self.context["experience"]
        validated_data["participant"] = user
        validated_data["experience"] = experience
        ticket = super().create(validated_data)
        email_message = f"Hi {user}, \n\nThis email serves as confirmation of your reservation and must be shown to the guide.\n\t{experience.title.upper()}\n\tDate: {ticket.date}\n\tPrice: {ticket.experience.price} $\n\tDuration: {experience.duration}h\n\tGuide: {experience.guide.user.get_full_name()} - {experience.guide.user.email}\n\nPlease contact us if you were not expecting to receive this message.\n\nBest regards,\nGUIDEme Team"
        self.context["request"].user.email_user(
            subject="[GUIDEme] Experince Ticket",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
        )
        return ticket


class ExperienceTicketDetailSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = ExperienceTicket
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["experience"] = {
            "title": instance.experience.title,
            "description": instance.experience.description,
            "duration": instance.experience.duration,
            "guide": instance.experience.guide.pk,
        }
        return ret


class ReviewSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = ExperienceReview
        fields = ("comment", "rating")

    def validate(self, attrs):
        if attrs["rating"] < 0 or attrs["rating"] > 5:
            raise ValidationError("Invalid rating.")
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        validated_data["experience"] = self.context["experience"]
        return super().create(validated_data)


class GuideReviewSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = GuideReview
        fields = ("comment", "rating")

    def validate(self, attrs):
        if attrs["rating"] < 0 or attrs["rating"] > 5:
            raise ValidationError("Invalid rating.")
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        validated_data["guide"] = self.context["guide"]
        return super().create(validated_data)


class ExperienceListSerializer(serializers.ModelSerializer):
    """ """

    images = serializers.SerializerMethodField()
    schedule = serializers.SerializerMethodField()
    premium = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = (
            "pk",
            "title",
            "price",
            "images",
            "description",
            "location",
            "schedule",
            "date",
            "start_date",
            "premium",
            "rating",
            "keywords",
        )

    def get_images(self, obj):
        return list(obj.images.values_list("url", flat=True))

    def get_schedule(self, obj):
        return list(obj.schedule.values_list("week_day", flat=True))

    def get_premium(self, obj):
        if obj.guide.subscription_plan:
            if obj.guide.plan_expire_date:
                return timezone.now().date() < obj.guide.plan_expire_date
        return False

    def get_rating(self, obj):
        qs = ExperienceReview.objects.filter(experience=obj)
        if qs.exists():
            rating = list(qs.values_list("rating", flat=True))
            res = sum(rating) / len(rating)
            return "{:.2f}".format(res)


class ExperienceTicketSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = ExperienceTicket
        fields = (
            "pk",
            "date",
        )

    def to_representation(self, instance):
        ret = {}
        ret["pk"] = instance.pk
        ret["date"] = instance.date
        exp = {}
        exp["images"] = list(instance.experience.images.values_list("url", flat=True))
        exp["title"] = instance.experience.title
        exp["price"] = instance.experience.price
        exp["location"] = instance.experience.location
        exp["pk"] = instance.experience.pk
        ret["experience"] = exp
        return ret
