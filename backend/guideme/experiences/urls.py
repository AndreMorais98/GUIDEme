from django.urls import path

from .views import BookExperienceView, CancelExperienceView, ListCreateExperienceView, ExperienceView, ListCreateExperienceView, ReviewExperienceView, ReviewGuideView, TicketDetailView, TicketListView

app_name = "experiences"

urlpatterns = (
    path("", view=ListCreateExperienceView.as_view(), name="create"),
    path("<int:pk>/", view=ExperienceView.as_view(), name="detail"),
    path("<int:pk>/book/", view=BookExperienceView.as_view(), name="book"),
    path("<int:pk>/cancel/", view=CancelExperienceView.as_view(), name="cancel"),
    path("ticket/<int:pk>/", view=TicketDetailView.as_view(), name="ticket-detail"),
    path("<int:pk>/reviews/", view=ReviewExperienceView.as_view(), name="review-experience"),
    path("guide/<int:pk>/reviews/", view=ReviewGuideView.as_view(), name="review-guide"),
    path("tickets/", view=TicketListView.as_view(), name="ticket-list"),
)
