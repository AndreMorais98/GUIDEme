from django.urls import path

from .views import (SubscribeView, SubscriptionDetailView,
                    SubscriptionsListView, SubscriptionStats,
                    SubscriptionStatsList)

app_name = "subscriptions"

urlpatterns = (
    path("", view=SubscriptionsListView.as_view(), name="subscriptions_list"),
    path(
        "<slug:slug>/",
        view=SubscriptionDetailView.as_view(),
        name="subscription_plan",
    ),
    path(
        "subscribe/<slug:slug>/",
        view=SubscribeView.as_view(),
        name="subscribe_plan",
    ),
    path("stats/", view=SubscriptionStatsList.as_view(), name="stats_list"),
    path("stats/<slug:slug>/", view=SubscriptionStats.as_view(), name="stats"),
)
