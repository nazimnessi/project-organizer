from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity, Roadmap, RoadmapPhase, RoadmapItem
from .serializers import (
    BugStatusUpdateSerializer, CustomUserSerializer, FeatureStatusUpdateSerializer, ImprovementStatusUpdateSerializer, ImprovementStatusUpdateSerializer, ProjectSerializer, FeatureSerializer,
    BugSerializer, ImprovementSerializer, ActivitySerializer, RoadmapSerializer, RoadmapPhaseSerializer, RoadmapItemSerializer
)

class IsOwner(permissions.BasePermission):
    """Custom permission to check if user owns the project."""
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            return obj.user == request.user
        elif isinstance(obj, (Feature, Bug, Improvement, Activity)):
            return obj.project.user == request.user
        elif isinstance(obj, Roadmap):
            return obj.project.user == request.user
        elif isinstance(obj, RoadmapPhase):
            return obj.roadmap.project.user == request.user
        elif isinstance(obj, RoadmapItem):
            return obj.roadmap_phase.roadmap.project.user == request.user
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = Project.objects.filter(user=self.request.user).prefetch_related(
            'feature_set', 'bug_set', 'improvement_set'
        ).order_by("-id")
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        instance.delete()


    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        project = self.get_object()
        activities = Activity.objects.filter(project=project).order_by('-created_at')
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def roadmaps(self, request, pk=None):
        """Get all roadmaps or create new roadmap for this project."""
        project = self.get_object()
        self.check_object_permissions(request, project)
        
        if request.method == 'POST':
            data = request.data.copy()
            data['projectId'] = project.id
            serializer = RoadmapSerializer(data=data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save(project=project)
            return Response(serializer.data, status=201)
        
        roadmaps = Roadmap.objects.filter(project=project).prefetch_related('phases__items')
        serializer = RoadmapSerializer(roadmaps, many=True)
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


class RoadmapViewSet(viewsets.ModelViewSet):
    serializer_class = RoadmapSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Roadmap.objects.filter(project__user=self.request.user).prefetch_related('phases__items')

    def perform_create(self, serializer):
        project_id = self.request.data.get('projectId')
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        serializer.save(project=project)

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        activity_project = instance.project
        activity_name = instance.name
        instance.delete()
        Activity.objects.create(
            project=activity_project,
            type="delete",
            entity="roadmap",
            entity_id=instance.id,
            description=f"Roadmap '{activity_name}' deleted"
        )

    @action(detail=True, methods=['get', 'post'])
    def phases(self, request, pk=None):
        """Get all phases or create new phase for this roadmap."""
        roadmap = self.get_object()
        self.check_object_permissions(request, roadmap)
        
        if request.method == 'POST':
            data = request.data.copy()
            data['roadmapId'] = roadmap.id
            serializer = RoadmapPhaseSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(roadmap=roadmap)
            Activity.objects.create(
                project=roadmap.project,
                type="create",
                entity="roadmap_phase",
                entity_id=serializer.instance.id,
                description=f"Phase '{serializer.instance.name}' created in roadmap '{roadmap.name}'"
            )
            return Response(serializer.data, status=201)
        
        phases = RoadmapPhase.objects.filter(roadmap=roadmap).prefetch_related('items')
        serializer = RoadmapPhaseSerializer(phases, many=True)
        return Response(serializer.data)


class RoadmapPhaseViewSet(viewsets.ModelViewSet):
    serializer_class = RoadmapPhaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return RoadmapPhase.objects.filter(roadmap__project__user=self.request.user).prefetch_related('items')

    def perform_create(self, serializer):
        roadmap_id = self.request.data.get('roadmapId')
        roadmap = get_object_or_404(Roadmap, id=roadmap_id, project__user=self.request.user)
        serializer.save(roadmap=roadmap)

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        roadmap = instance.roadmap
        phase_name = instance.name
        instance.delete()
        Activity.objects.create(
            project=roadmap.project,
            type="delete",
            entity="roadmap_phase",
            entity_id=instance.id,
            description=f"Phase '{phase_name}' deleted"
        )

    @action(detail=True, methods=['get', 'post'])
    def items(self, request, pk=None):
        """Get all items or create new item for this phase."""
        phase = self.get_object()
        self.check_object_permissions(request, phase)
        
        if request.method == 'POST':
            data = request.data.copy()
            data['roadmapPhaseId'] = phase.id
            serializer = RoadmapItemSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            
            # Handle linked items
            linked_feature_id = request.data.get('linkedFeatureId')
            linked_bug_id = request.data.get('linkedBugId')
            linked_improvement_id = request.data.get('linkedImprovementId')
            
            if linked_feature_id:
                serializer.validated_data['linked_feature_id'] = linked_feature_id
            if linked_bug_id:
                serializer.validated_data['linked_bug_id'] = linked_bug_id
            if linked_improvement_id:
                serializer.validated_data['linked_improvement_id'] = linked_improvement_id
            
            serializer.save(roadmap_phase=phase)
            return Response(serializer.data, status=201)
        
        items = RoadmapItem.objects.filter(roadmap_phase=phase)
        serializer = RoadmapItemSerializer(items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        """Update phase status."""
        phase = self.get_object()
        self.check_object_permissions(request, phase)
        
        old_status = phase.status
        phase.status = request.data.get('status', phase.status)
        phase.save()
        Activity.objects.create(
            project=phase.roadmap.project,
            type="status_change",
            entity="roadmap_phase",
            entity_id=phase.id,
            description=f"Phase '{phase.name}' status changed from '{old_status}' to '{phase.status}'"
        )
        serializer = self.get_serializer(phase)
        return Response(serializer.data)


class RoadmapItemViewSet(viewsets.ModelViewSet):
    serializer_class = RoadmapItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return RoadmapItem.objects.filter(roadmap_phase__roadmap__project__user=self.request.user)

    def perform_create(self, serializer):
        # Get roadmapPhaseId from request body (required for flat endpoint)
        phase_id = self.request.data.get('roadmapPhaseId')
        if not phase_id:
            return Response(
                {'error': 'roadmapPhaseId is required'}, 
                status=400
            )
        
        phase = get_object_or_404(RoadmapPhase, id=phase_id, roadmap__project__user=self.request.user)
        
        # Handle linked items
        linked_feature_id = self.request.data.get('linkedFeatureId')
        linked_bug_id = self.request.data.get('linkedBugId')
        linked_improvement_id = self.request.data.get('linkedImprovementId')
        
        if linked_feature_id:
            serializer.validated_data['linked_feature_id'] = linked_feature_id
        if linked_bug_id:
            serializer.validated_data['linked_bug_id'] = linked_bug_id
        if linked_improvement_id:
            serializer.validated_data['linked_improvement_id'] = linked_improvement_id
        
        serializer.save(roadmap_phase=phase)

    def perform_destroy(self, instance):
        self.check_object_permissions(self.request, instance)
        project = instance.roadmap_phase.roadmap.project
        item_title = instance.title
        instance.delete()
        Activity.objects.create(
            project=project,
            type="delete",
            entity="roadmap_item",
            entity_id=instance.id,
            description=f"Item '{item_title}' deleted"
        )

    @action(detail=True, methods=["patch"], url_path="update-status")
    def update_status(self, request, pk=None):
        item = self.get_object()
        old_status = item.status
        item.status = request.data.get('status', item.status)
        item.save()
        Activity.objects.create(
            project=item.roadmap_phase.roadmap.project,
            type="status_change",
            entity="roadmap_item",
            entity_id=item.id,
            description=f"Item '{item.title}' status changed from '{old_status}' to '{item.status}'"
        )
        serializer = self.get_serializer(item)
        return Response(serializer.data)

    @action(detail=True, methods=["PATCH"], url_path="link")
    def link(self, request, pk=None):
        item = self.get_object()
        feature_id = request.data.get('linkedFeatureId')
        bug_id = request.data.get('linkedBugId')
        improvement_id = request.data.get('linkedImprovementId')
        
        if feature_id:
            item.linked_feature = get_object_or_404(Feature, id=feature_id)
        if bug_id:
            item.linked_bug = get_object_or_404(Bug, id=bug_id)
        if improvement_id:
            item.linked_improvement = get_object_or_404(Improvement, id=improvement_id)
        
        item.save()
        Activity.objects.create(
            project=item.roadmap_phase.roadmap.project,
            type="update",
            entity="roadmap_item",
            entity_id=item.id,
            description=f"Item '{item.title}' linked to feature/bug/improvement"
        )
        serializer = self.get_serializer(item)
        return Response(serializer.data)

    @action(detail=True, methods=["PATCH"], url_path="unlink")
    def unlink(self, request, pk=None):
        item = self.get_object()
        link_type = request.data.get('link_type')
        
        if link_type == 'feature':
            item.linked_feature = None
        elif link_type == 'bug':
            item.linked_bug = None
        elif link_type == 'improvement':
            item.linked_improvement = None
        
        item.save()
        Activity.objects.create(
            project=item.roadmap_phase.roadmap.project,
            type="update",
            entity="roadmap_item",
            entity_id=item.id,
            description=f"Item '{item.title}' unlinked from {link_type}"
        )
        serializer = self.get_serializer(item)
        return Response(serializer.data)
