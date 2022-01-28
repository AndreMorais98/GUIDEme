from accounts.models import Guide, User
from accounts.serializers import (AccountProfileSerializer, EditUserSerializer, EmailSerializer, GuideSerializer,
                                  LoginSerializer, MySubscriptionSerializer, PasswordChangeSerializer,
                                  UserSerializer)
from django.conf import settings
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.generics import (CreateAPIView, GenericAPIView,
                                     RetrieveAPIView, UpdateAPIView, ListAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from experiences.permissions import IsGuide


class CreateAccountView(CreateAPIView):
    """Create user account"""

    serializer_class = UserSerializer


class EditUserView(UpdateAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = EditUserSerializer

    def get_object(self):
        return self.request.user


class AccountView(RetrieveAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AccountProfileSerializer
    queryset = User.objects.all()


class LoginView(GenericAPIView):
    """ """

    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        # create authentication token
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})


class LogoutView(APIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # delete authentication token for user
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class SetGuideView(APIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # creates guide profile for user
        if request.user.is_guide:
            # when user already is a guide
            return Response(status=status.HTTP_400_BAD_REQUEST)
        Guide.objects.create(user=request.user)
        return Response(status=status.HTTP_201_CREATED)


class ChangePasswordView(GenericAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, instance=self.get_object())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class ResetPasswordView(GenericAPIView):
    """ """

    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.send_recovery_email(serializer.data)
        return Response(status=status.HTTP_200_OK)


class ProfileView(RetrieveAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AccountProfileSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class ListGuidesView(ListAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GuideSerializer
    queryset = Guide.objects.all()


class MySubscriptionView(RetrieveAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsGuide]
    serializer_class = MySubscriptionSerializer

    def get_object(self):
        return self.request.user.guide_profile
