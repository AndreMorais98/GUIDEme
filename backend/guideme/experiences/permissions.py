from rest_framework.permissions import BasePermission


class IsGuide(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return request.user.is_guide
