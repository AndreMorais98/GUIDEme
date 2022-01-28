from accounts.models import Guide, User
from django.contrib.auth import authenticate, get_user_model, password_validation
from django.utils import timezone
from rest_framework import serializers
from django.conf import settings

from experiences.models import (
    Experience,
    ExperienceImage,
    ExperienceTicket,
    GuideReview,
)


class UserSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = User
        fields = (
            "pk",
            "first_name",
            "last_name",
            "country",
            "district",
            "description",
            "phone",
            "email",
            "password",
        )
        read_only_fields = ("pk",)
        extra_kwargs = {
            "first_name": {"write_only": True},
            "last_name": {"write_only": True},
            "country": {"write_only": True},
            "district": {"write_only": True},
            "description": {"write_only": True},
            "phone": {"write_only": True},
            "email": {"write_only": True},
            "password": {"write_only": True},
        }

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        User = get_user_model()
        user = User.objects.create_user(**validated_data)
        email_message = f"Hi {user.get_full_name()}, \n\nWelcome to GUIDEme, hope you enjoy our trip together.\n\nBest regards,\nGUIDEme Team"
        if user:
            user.email_user(
                subject="[GUIDEme] Account created",
                message=email_message,
                from_email=settings.EMAIL_HOST_USER,
            )
        return user


class LoginSerializer(serializers.Serializer):
    """ """

    email = serializers.EmailField(label="Email", required=True, write_only=True)
    password = serializers.CharField(
        label="Password",
        trim_whitespace=False,
        required=True,
        write_only=True,
    )
    token = serializers.CharField(label="Token", read_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), email=email, password=password
            )
            if not user:
                raise serializers.ValidationError(
                    "Unable to log in with provided credentials.", code="authorization"
                )
            # update user's last_login date
            user.last_login = timezone.now()
            user.save(update_fields=("last_login",))

        attrs["user"] = user
        return attrs


class EditUserSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "country",
            "district",
            "description",
            "phone",
            "profile_pic",
            "header_pic",
        )


class AccountProfileSerializer(serializers.ModelSerializer):
    """ """

    is_guide = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField(required=False)
    num_rating = serializers.SerializerMethodField(required=False)
    last_exp = serializers.SerializerMethodField()
    guide_experiences = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    can_review = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "country",
            "district",
            "description",
            "phone",
            "email",
            "profile_pic",
            "header_pic",
            "is_guide",
            "rating",
            "num_rating",
            "last_exp",
            "guide_experiences",
            "reviews",
            "can_review",
        )

    def get_is_guide(self, obj):
        return obj.is_guide

    def get_rating(self, obj):
        if obj.is_guide:
            qs = GuideReview.objects.filter(guide=obj.guide_profile)
            if qs.exists():
                rating = list(qs.values_list("rating", flat=True))
                res = sum(rating) / len(rating)
                return "{:.2f}".format(res)

    def get_reviews(self, obj):
        if obj.is_guide:
            revs = list(
                GuideReview.objects.filter(guide=obj.guide_profile)
                .order_by("-created")
                .values("comment", "rating", "user", "created")
            )
            for rev in revs:
                user = User.objects.get(pk=rev.pop("user"))
                rev["user"] = {
                    "pk": user.pk,
                    "name": user.get_full_name(),
                    "image": user.profile_pic,
                }
                rev["created"] = rev["created"].strftime("%d %b %y")
            return revs

    def get_num_rating(self, obj):
        if obj.is_guide:
            return GuideReview.objects.filter(guide=obj.guide_profile).count()

    def get_last_exp(self, obj):
        last_five = list(
            dict(
                obj.tickets.filter(date__lt=timezone.now())
                .order_by("-date")
                .values_list("experience", "date")
            ).items()
        )
        ret = []
        for (pk, date) in last_five:
            experience = Experience.objects.get(pk=pk)
            ret.append(
                {
                    "pk": experience.pk,
                    "images": list(experience.images.values_list("url", flat=True)),
                    "title": experience.title,
                    "description": experience.description,
                    "date": date.strftime("%d %b %y"),
                }
            )
        return ret

    def get_guide_experiences(self, obj):
        if obj.is_guide:
            exps = list(
                obj.guide_profile.experiences.filter(active=True)
                .exclude(date__lte=timezone.now())
                .order_by("date")
            )
            ret = []
            for exp in exps:
                ret.append(
                    {
                        "pk": exp.pk,
                        "images": list(exp.images.values_list("url", flat=True)),
                        "title": exp.title,
                        "description": exp.description,
                        "price": exp.price,
                    }
                )
            return ret

    def get_can_review(self, obj):
        if not obj.is_guide:
            return False
        avaib_exp = ExperienceTicket.objects.filter(
            participant=self.context["request"].user, date__lt=timezone.now()
        ).values_list("experience", flat=True)
        avaib_guide = Experience.objects.filter(pk__in=avaib_exp).values_list(
            "guide", flat=True
        )
        return obj.guide_profile.pk in avaib_guide


class EmailSerializer(serializers.Serializer):
    """ """

    email = serializers.EmailField(required=True)

    def send_recovery_email(self, validated_data):
        email = validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return
        random_pwd = User.objects.make_random_password()
        user.set_password(random_pwd)
        user.save()
        email_message = f"Hi {user.get_full_name()}, \n\nYour password has been reset. We generated a new password for you: {random_pwd}\nNote that it is important to only use this password to log into the account and define a new password.\n\nPlease contact us if you were not expecting to receive this message.\n\nBest regards,\nGUIDEme Team"
        user.email_user(
            subject="[GUIDEme] Password reset",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
        )


class PasswordChangeSerializer(serializers.Serializer):
    """ """

    old_password = serializers.CharField(
        label="Old password",
        trim_whitespace=False,
        required=True,
        write_only=True,
    )
    new_password = serializers.CharField(
        label="New password",
        trim_whitespace=False,
        required=True,
        write_only=True,
    )
    new_password_confirmation = serializers.CharField(
        label="New password confirmation",
        trim_whitespace=False,
        required=True,
        write_only=True,
    )

    def validate_old_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate_new_password_confirm(self, value):
        password_validation.validate_password(value)
        return value

    def validate(self, attrs):
        if not self.instance.check_password(attrs["old_password"]):
            raise serializers.ValidationError("Incorrect password.")
        if attrs["new_password"] != attrs["new_password_confirmation"]:
            raise serializers.ValidationError("Passwords mismatch.")
        return attrs

    def save(self, **kwargs):
        self.instance.set_password(self.validated_data["new_password"])
        self.instance.save()
        email_message = f"Hi {self.instance.get_full_name()}, \n\nYour password has been successfully changed.\n\nPlease contact us if you were not expecting to receive this message.\n\nBest regards,\nGUIDEme Team"
        self.instance.email_user(
            subject="[GUIDEme] Password changed",
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
        )


class GuideSerializer(serializers.ModelSerializer):
    """ """

    pk = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    num_rating = serializers.SerializerMethodField()
    premium = serializers.SerializerMethodField()

    class Meta:
        model = Guide
        fields = (
            "pk",
            "name",
            "image",
            "rating",
            "location",
            "description",
            "num_rating",
            "premium",
        )
        read_only_fields = fields

    def get_pk(self, obj):
        return obj.user.pk

    def get_image(self, obj):
        return obj.user.profile_pic

    def get_name(self, obj):
        return obj.user.get_full_name()

    def get_rating(self, obj):
        qs = GuideReview.objects.filter(guide=obj)
        if qs.exists():
            rating = list(qs.values_list("rating", flat=True))
            res = sum(rating) / len(rating)
            return "{:.2f}".format(res)

    def get_location(self, obj):
        return "{}, {}".format(obj.user.district, obj.user.country)

    def get_description(self, obj):
        return obj.user.description

    def get_premium(self, obj):
        if obj.subscription_plan:
            if obj.plan_expire_date:
                return timezone.now().date() < obj.plan_expire_date
        return False

    def get_num_rating(self, obj):
        return GuideReview.objects.filter(guide=obj).count()


class MySubscriptionSerializer(serializers.ModelSerializer):
    """ """

    can_purchase = serializers.SerializerMethodField()
    sub_plan = serializers.SerializerMethodField()
    plan_expire_date = serializers.SerializerMethodField()

    class Meta:
        model = Guide
        fields = ("sub_plan", "plan_expire_date", "can_purchase")

    def get_can_purchase(self, obj):
        return (
            not self.instance.subscription_plan
            or self.instance.plan_expire_date < timezone.now().date()
        )

    def get_sub_plan(self, obj):
        return (
            self.instance.subscription_plan.slug
            if self.instance.subscription_plan
            else None
        )

    def get_plan_expire_date(self, obj):
        return (
            self.instance.plan_expire_date.strftime("%d %b %y")
            if self.instance.plan_expire_date
            else None
        )
