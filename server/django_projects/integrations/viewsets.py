from django.db.models import Q
from rest_framework import permissions, viewsets

from .models import Integration, ProjectIntegration
from .serializers import IntegrationSerializer, ProjectIntegrationSerializer


class IsIntegrationOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (obj.user_id == request.user.id) or request.user.is_superuser


class IntegrationViewSet(viewsets.ModelViewSet):
    serializer_class = IntegrationSerializer
    permission_classes = [permissions.IsAuthenticated, IsIntegrationOwnerOrReadOnly]

    def get_queryset(self):
        return Integration.objects.filter(
            Q(user=self.request.user) | Q(user__isnull=True)
        ).order_by('name')


class ProjectIntegrationViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectIntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectIntegration.objects.filter(
            project__user=self.request.user
        ).select_related('project', 'integration').order_by('-created_at')