from accounts.views import (AccountView, ChangePasswordView, CreateAccountView,
                            EditUserView, ListGuidesView, LoginView,
                            LogoutView, MySubscriptionView, ProfileView, ResetPasswordView,
                            SetGuideView)
from django.urls import path

app_name = "users"

urlpatterns = (
    path("", view=CreateAccountView.as_view(), name="create_account"),
    path("edit/", view=EditUserView.as_view(), name="edit_account"),
    path("set_guide/", view=SetGuideView.as_view(), name="set_guide"),
    path("<int:pk>/", view=AccountView.as_view(), name="account"),
    path("profile/", view=ProfileView.as_view(), name="profile"),
    path("guides/", view=ListGuidesView.as_view(), name="list_guides"),
    path("login/", view=LoginView.as_view(), name="login"),
    path("logout/", view=LogoutView.as_view(), name="logout"),
    path("password_change/", view=ChangePasswordView.as_view(), name="password_change"),
    path("password_reset/", view=ResetPasswordView.as_view(), name="password_reset"),
    path("subscription/", view=MySubscriptionView.as_view(), name="my_subscription"),
)
