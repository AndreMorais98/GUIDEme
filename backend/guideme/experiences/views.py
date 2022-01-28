from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    GenericAPIView,
    RetrieveAPIView,
    ListAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from accounts.models import Guide, User

from guideme import settings

from .models import Experience, ExperienceTicket
from .permissions import IsGuide
from .serializers import (
    BookExperienceSerializer,
    ExperienceListSerializer,
    ExperienceSerializer,
    ExperienceDetailSerializer,
    ExperienceTicketDetailSerializer,
    ExperienceTicketSerializer,
    GuideReviewSerializer,
    ReviewSerializer,
)


class ListCreateExperienceView(ListCreateAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.filter(active=True).exclude(date__lte=timezone.now())

    def get(self, request, *args, **kwargs):
        self.serializer_class = ExperienceListSerializer
        return super().get(request, *args, **kwargs)


class ExperienceView(RetrieveUpdateAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceDetailSerializer
    queryset = Experience.objects.all()

    def put(self, request, *args, **kwargs):
        if not request.user.is_guide:
            raise Response(status=status.HTTP_401_UNAUTHORIZED)
        self.serializer_class = ExperienceSerializer
        self.queryset = Experience.objects.filter(guide=request.user.guide_profile)
        return super().put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_guide:
            raise Response(status=status.HTTP_401_UNAUTHORIZED)
        self.serializer_class = ExperienceSerializer
        self.queryset = Experience.objects.filter(guide=request.user.guide_profile)
        return super().patch(request, *args, **kwargs)


class BookExperienceView(CreateAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BookExperienceSerializer
    queryset = Experience.objects.all()

    def get_serializer_context(self):
        ret = super().get_serializer_context()
        ret["experience"] = self.get_object()
        return ret


class CancelExperienceView(GenericAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsGuide]
    queryset = Experience.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(guide=self.request.user.guide_profile)

    def post(self, request, *args, **kwargs):
        experience = self.get_object()
        if (
            experience.date
            and timezone.now() + timezone.timedelta(days=3) > experience.date
        ):
            return Response(
                {
                    "non_field_errors": "You can only cancel an experience three or more days before its due date."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        experience.active = False
        experience.save()
        tickets = ExperienceTicket.objects.filter(experience=experience)
        for ticket in tickets:
            email_message = f"Hi {ticket.user}, \n\nSadly the experience {experience.title} you reserved for {ticket.date} was cancelled\n\nPlease contact us if you were not expecting to receive this message.\n\nBest regards,\nGUIDEme Team"
            ticket.participant.email_user(
                subject="[GUIDEme] Experience Cancelled",
                message=email_message,
                from_email=settings.EMAIL_HOST_USER,
            )
        return Response(status=status.HTTP_200_OK)


class TicketDetailView(RetrieveAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceTicketDetailSerializer
    queryset = ExperienceTicket.objects.all()


class TicketListView(ListAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceTicketSerializer
    queryset = ExperienceTicket.objects.all()

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(participant=self.request.user, date__gt=timezone.now())
        )


class ReviewExperienceView(ListCreateAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    queryset = Experience.objects.all()

    def get_queryset(self):
        avaib_exp = ExperienceTicket.objects.filter(
            participant=self.request.user, date__lt=timezone.now()
        ).values_list("experience", flat=True)
        return Experience.objects.filter(pk__in=avaib_exp)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["experience"] = self.get_object()
        return context


class ReviewGuideView(ListCreateAPIView):
    """ """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = GuideReviewSerializer
    queryset = Guide.objects.all()

    def get_queryset(self):
        avaib_exp = ExperienceTicket.objects.filter(
            participant=self.request.user, date__lt=timezone.now()
        ).values_list("experience", flat=True)
        avaib_guide = Experience.objects.filter(pk__in=avaib_exp).values_list(
            "guide", flat=True
        )
        return Guide.objects.filter(pk__in=avaib_guide)

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=User.objects.get(pk=self.kwargs["pk"]).guide_profile.pk)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["guide"] = self.get_object()
        return context
