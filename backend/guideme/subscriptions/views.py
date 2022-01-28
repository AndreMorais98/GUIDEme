from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import (GenericAPIView, ListAPIView,
                                     RetrieveAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import SubscriptionPlan
from .serializers import SubscriptionSerializer, SubscriptionStatsSerializer


class SubscriptionsListView(ListAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer
    queryset = SubscriptionPlan.objects.all()


class SubscriptionDetailView(RetrieveAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer
    queryset = SubscriptionPlan.objects.all().order_by("duration")
    lookup_field = "slug"


class SubscribeView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = SubscriptionPlan.objects.all()
    lookup_field = "slug"

    def post(self, request, *args, **kwargs):
        if not request.user.is_guide:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        sub_plan = self.get_object()
        guide = request.user.guide_profile
        guide.subscription_plan = sub_plan
        guide.plan_expire_date = sub_plan.expire_date()
        guide.save()
        return Response(status=status.HTTP_200_OK)


class SubscriptionStatsList(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionStatsSerializer
    queryset = SubscriptionPlan.objects.all()


class SubscriptionStats(RetrieveAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionStatsSerializer
    queryset = SubscriptionPlan.objects.all()
    lookup_field = "slug"
