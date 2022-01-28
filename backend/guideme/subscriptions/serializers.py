from accounts.models import Guide
from rest_framework import serializers

from .models import SubscriptionPlan


class SubscriptionSerializer(serializers.ModelSerializer):
    """ """

    class Meta:
        model = SubscriptionPlan
        fields = ("slug", "designation", "description", "price", "duration")


class SubscriptionStatsSerializer(serializers.ModelSerializer):
    """ """

    stats = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = ("slug", "designation", "stats")

    def get_stats(self, obj):
        return Guide.objects.filter(subscription_plan=obj).count()
