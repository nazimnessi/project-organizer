from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity
from .serializers import (
    BugStatusUpdateSerializer, CustomUserSerializer, FeatureStatusUpdateSerializer, ImprovementStatusUpdateSerializer, ImprovementStatusUpdateSerializer, ProjectSerializer, FeatureSerializer,
    BugSerializer, ImprovementSerializer, ActivitySerializer
)

class IsOwner(permissions.BasePermission):
    """Custom permission to check if user owns the project."""
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            return obj.user == request.user
        elif isinstance(obj, (Feature, Bug, Improvement, Activity)):
            return obj.project.user == request.user
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).prefetch_related(
            'feature_set', 'bug_set', 'improvement_set'
        )

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        instance.delete()


    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        project = self.get_object()
        activities = Activity.objects.filter(project=project).order_by('-created_at')
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)



class FeatureViewSet(viewsets.ModelViewSet):
    serializer_class = FeatureSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_serializer_class(self):
        if self.action == "update_status":
            return FeatureStatusUpdateSerializer
        return FeatureSerializer

    def get_queryset(self):
        return Feature.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('projectId') or self.kwargs.get('project_id')        
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        serializer.save(project=project)

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        instance.delete()
        
    @action(detail=True, methods=["PUT"], url_path="update-status")
    def update_status(self, request, pk=None):
        feature = self.get_object()
        serializer = self.get_serializer(
            feature, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    



class BugViewSet(viewsets.ModelViewSet):
    serializer_class = BugSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_serializer_class(self):
        if self.action == "update_status":
            return BugStatusUpdateSerializer
        return BugSerializer

    def get_queryset(self):
        return Bug.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('projectId') or self.kwargs.get('project_id')
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        serializer.save(project=project)

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        instance.delete()
    
    @action(detail=True, methods=["PUT"], url_path="update-status")
    def update_status(self, request, pk=None):
        feature = self.get_object()
        serializer = self.get_serializer(
            feature, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ImprovementViewSet(viewsets.ModelViewSet):
    serializer_class = ImprovementSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_serializer_class(self):
        if self.action == "update_status":
            return ImprovementStatusUpdateSerializer
        return ImprovementSerializer

    def get_queryset(self):
        return Improvement.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('projectId') or self.kwargs.get('project_id')
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        serializer.save(project=project)

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        instance.delete()
    
    @action(detail=True, methods=["PUT"], url_path="update-status")
    def update_status(self, request, pk=None):
        feature = self.get_object()
        serializer = self.get_serializer(
            feature, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(project__user=self.request.user).order_by('-created_at')


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
