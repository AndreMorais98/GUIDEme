from django.urls import path
from django.urls.conf import include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

app_name = "api"

urlpatterns = (
    path("", SpectacularSwaggerView.as_view(url_name="api:schema"), name="swagger_ui"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("users/", include("accounts.urls", namespace="users")),
    path("subscriptions/", include("subscriptions.urls", namespace="subscriptions")),
    path("experiences/", include("experiences.urls", namespace="experiences")),
)
