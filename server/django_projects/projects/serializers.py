from rest_framework import serializers

from .utils import get_changed_data
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity, Roadmap, RoadmapPhase, RoadmapItem
import json

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["id"] = user.id
        token["username"] = user.username
        token["email"] = user.email
        token["firstname"] = user.first_name
        token["lastname"] = user.last_name
        token["profile_image_url"] = user.profile_image_url

        return token


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_image_url')
        read_only_fields = ('id',)


class FeatureSerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    tags = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    estimatedWorkTime = serializers.DurationField(source='estimated_work_time', required=False, allow_null=True)
    priority = serializers.CharField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Feature
        fields = ('id', 'projectId', 'description', 'status', 'rank', 'tags', 'estimatedWorkTime', 'priority', 'deadline', 'createdAt')
        read_only_fields = ('id', 'createdAt', 'projectId')

    def get_tags(self, obj):
        try:
            return json.loads(obj.tags) if obj.tags else []
        except:
            return []

    def create(self, validated_data):
        validated_data['tags'] = json.dumps(validated_data.get('tags', []))
        instance = super().create(validated_data)
        project_instance = instance.project
        Activity.objects.create(
                project=project_instance,
                type="create",
                entity="feature",
                entity_id=instance.id,
                description=f"Feature '{instance.description}' created"
            )
        return instance

    def update(self, instance, validated_data):
        if 'tags' in validated_data:
            validated_data['tags'] = json.dumps(validated_data['tags'])
        changed_data = get_changed_data(instance, validated_data)
        for attr, (old_value, new_value) in changed_data.items():
            setattr(instance, attr, new_value)
        instance = super().update(instance, validated_data)
        project_instance = instance.project
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
                project=project_instance,
                type="update",
                entity="feature",
                entity_id=instance.id,
                description=f"Feature '{instance.description}' updated with {', '.join(activity_description)}"
            )
        return instance


class FeatureStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ("status",)
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        Activity.objects.create(
                project=instance.project,
                type="status_change",
                entity="feature",
                entity_id=instance.id,
                description=f"Feature '{instance.description}' status updated to '{instance.status}'"
            )
        return instance


class BugStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bug
        fields = ("status",)
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        Activity.objects.create(
                project=instance.project,
                type="status_change",
                entity="bug",
                entity_id=instance.id,
                description=f"Bug '{instance.description}' status updated to '{instance.status}'"
            )
        return instance


class ImprovementStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Improvement
        fields = ("status",)
        
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        Activity.objects.create(
                project=instance.project,
                type="status_change",
                entity="improvement",
                entity_id=instance.id,
                description=f"Improvement '{instance.description}' status updated to '{instance.status}'"
            )
        return instance


class BugSerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    tags = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    estimatedWorkTime = serializers.DurationField(source='estimated_work_time', required=False, allow_null=True)
    priority = serializers.CharField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Bug
        fields = ('id', 'projectId', 'description', 'status', 'rank', 'tags', 'estimatedWorkTime', 'priority', 'deadline', 'createdAt')
        read_only_fields = ('id', 'createdAt', 'projectId')

    def get_tags(self, obj):
        try:
            return json.loads(obj.tags) if obj.tags else []
        except:
            return []

    def create(self, validated_data):
        validated_data['tags'] = json.dumps(validated_data.get('tags', []))
        instance = super().create(validated_data)
        Activity.objects.create(
                project=instance.project,
                type="create",
                entity="bug",
                entity_id=instance.id,
                description=f"Bug '{instance.description}' created"
            )
        return instance

    def update(self, instance, validated_data):
        if 'tags' in validated_data:
            validated_data['tags'] = json.dumps(validated_data['tags'])
        changed_data = get_changed_data(instance, validated_data)
        for attr, (old_value, new_value) in changed_data.items():
            setattr(instance, attr, new_value)
        instance = super().update(instance, validated_data)
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
                project=instance.project,
                type="update",
                entity="bug",
                entity_id=instance.id,
                description=f"Bug '{instance.description}' updated with {', '.join(activity_description)}"
            )
        return instance


class ImprovementSerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    tags = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    estimatedWorkTime = serializers.DurationField(source='estimated_work_time', required=False, allow_null=True)
    priority = serializers.CharField(required=False, allow_null=True)
    deadline = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Improvement
        fields = ('id', 'projectId', 'description', 'status', 'rank', 'tags', 'estimatedWorkTime', 'priority', 'deadline', 'createdAt')
        read_only_fields = ('id', 'createdAt', 'projectId')

    def get_tags(self, obj):
        try:
            return json.loads(obj.tags) if obj.tags else []
        except:
            return []

    def create(self, validated_data):
        validated_data['tags'] = json.dumps(validated_data.get('tags', []))
        instance = super().create(validated_data)
        Activity.objects.create(
                project=instance.project,
                type="create",
                entity="improvement",
                entity_id=instance.id,
                description=f"Improvement '{instance.description}' created"
            )
        return instance

    def update(self, instance, validated_data):
        if 'tags' in validated_data:
            validated_data['tags'] = json.dumps(validated_data['tags'])
        changed_data = get_changed_data(instance, validated_data)
        for attr, (old_value, new_value) in changed_data.items():
            setattr(instance, attr, new_value)
        instance = super().update(instance, validated_data)
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
                project=instance.project,
                type="update",
                entity="improvement",
                entity_id=instance.id,
                description=f"Improvement '{instance.description}' updated with {', '.join(activity_description)}"
            )
        return instance


class ActivitySerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    entityId = serializers.IntegerField(source='entity_id', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Activity
        fields = ('id', 'projectId', 'type', 'entity', 'entityId', 'description', 'createdAt')
        read_only_fields = ('id', 'createdAt', 'projectId')


class ProjectSerializer(serializers.ModelSerializer):
    features = serializers.SerializerMethodField()
    bugs = serializers.SerializerMethodField()
    improvements = serializers.SerializerMethodField()
    userId = serializers.IntegerField(source='user.id', read_only=True)
    productionLink = serializers.CharField(source='production_link', required=False, allow_blank=True, allow_null=True)
    repoLink = serializers.ListField(source='repo_link', required=False, allow_null=True, allow_empty=True)
    frontendLink = serializers.CharField(source='frontend_link', required=False, allow_blank=True, allow_null=True)
    backendLink = serializers.CharField(source='backend_link', required=False, allow_blank=True, allow_null=True)
    frontendDetails = serializers.CharField(source='frontend_details', required=False, allow_blank=True, allow_null=True)
    backendDetails = serializers.CharField(source='backend_details', required=False, allow_blank=True, allow_null=True)
    envDetails = serializers.CharField(source='env_details', required=False, allow_blank=True, allow_null=True)
    testUserDetails = serializers.CharField(source='test_user_details', required=False, allow_blank=True, allow_null=True)
    authDetails = serializers.CharField(source='auth_details', required=False, allow_blank=True, allow_null=True)
    development_notes = serializers.CharField( required=False, allow_blank=True, allow_null=True)
    setupSteps = serializers.JSONField(
        source="setup_steps",
        required=False
    )
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'userId', 'name', 'description', 'status', 'development_notes', 'productionLink', 'repoLink',
            'frontendLink', 'backendLink', 'frontendDetails', 'backendDetails',
            'envDetails', 'testUserDetails', 'authDetails', 'setupSteps', 'createdAt',
            'features', 'bugs', 'improvements'
        )
        read_only_fields = ('id', 'createdAt', 'userId', 'features', 'bugs', 'improvements')

    def get_features(self, obj):
        features = Feature.objects.filter(project=obj)
        return FeatureSerializer(features, many=True).data

    def get_bugs(self, obj):
        bugs = Bug.objects.filter(project=obj)
        return BugSerializer(bugs, many=True).data

    def get_improvements(self, obj):
        improvements = Improvement.objects.filter(project=obj)
        return ImprovementSerializer(improvements, many=True).data

    def create(self, validated_data):
        user_id = self.context['request'].user.id
        setup_steps = validated_data.pop('setup_steps', [])
        if setup_steps:
            validated_data['setup_steps'] = json.dumps(setup_steps)
        
        instance = Project.objects.create(user_id=user_id, **validated_data)
        
        Activity.objects.create(
                project=instance,
                type="create",
                entity="project",
                entity_id=instance.id,
                description=f"Project '{instance.name}' created"
            )
        return instance

   

    def update(self, instance, validated_data):
        changed_data = get_changed_data(instance, validated_data)
        for attr, (old_value, new_value) in changed_data.items():
            setattr(instance, attr, new_value)
        instance.save()
        print(validated_data)
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
                project=instance,
                type="update",
                entity="project",
                entity_id=instance.id,
                description=f"Project '{instance.name}' updated with {', '.join(activity_description)}"
            )
        return instance


class RoadmapItemSerializer(serializers.ModelSerializer):
    roadmapPhaseId = serializers.IntegerField(source='roadmap_phase.id', read_only=True)
    linkedFeatureId = serializers.IntegerField(source='linked_feature.id', allow_null=True, required=False, read_only=False)
    linkedBugId = serializers.IntegerField(source='linked_bug.id', allow_null=True, required=False, read_only=False)
    linkedImprovementId = serializers.IntegerField(source='linked_improvement.id', allow_null=True, required=False, read_only=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    estimatedWorkTime = serializers.DurationField(source='estimated_work_time', required=False, allow_null=True)
    deadline = serializers.DateField(source='deadline', required=False, allow_null=True)

    class Meta:
        model = RoadmapItem
        fields = ('id', 'roadmapPhaseId', 'title', 'description', 'status', 'priority', 'estimatedWorkTime', 'deadline',
                 'linkedFeatureId', 'linkedBugId', 'linkedImprovementId', 'createdAt', 'updatedAt')
        read_only_fields = ('id', 'createdAt', 'updatedAt', 'roadmapPhaseId')

    def create(self, validated_data):
        instance = super().create(validated_data)
        Activity.objects.create(
            project=instance.roadmap_phase.roadmap.project,
            type="create",
            entity="roadmap_item",
            entity_id=instance.id,
            description=f"Item '{instance.title}' created in phase '{instance.roadmap_phase.name}'"
        )
        return instance

    def update(self, instance, validated_data):
        changed_data = get_changed_data(instance, validated_data)
        instance = super().update(instance, validated_data)
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
            project=instance.roadmap_phase.roadmap.project,
            type="update",
            entity="roadmap_item",
            entity_id=instance.id,
            description=f"Item '{instance.title}' updated: {', '.join(activity_description)}"
        )
        return instance


class RoadmapPhaseSerializer(serializers.ModelSerializer):
    roadmapId = serializers.IntegerField(source='roadmap.id', read_only=True)
    items = RoadmapItemSerializer(many=True, read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    targetDate = serializers.DateField(source='target_date', required=False, allow_null=True)
    estimatedWorkTime = serializers.DurationField(source='estimated_work_time', required=False, allow_null=True)
    deadline = serializers.DateField(source='deadline', required=False, allow_null=True)

    class Meta:
        model = RoadmapPhase
        fields = ('id', 'roadmapId', 'name', 'order', 'targetDate', 'estimatedWorkTime', 'deadline', 'status', 'items', 'createdAt', 'updatedAt')
        read_only_fields = ('id', 'roadmapId', 'items', 'createdAt', 'updatedAt')

    def create(self, validated_data):
        instance = super().create(validated_data)
        Activity.objects.create(
            project=instance.roadmap.project,
            type="create",
            entity="roadmap_phase",
            entity_id=instance.id,
            description=f"Phase '{instance.name}' created in roadmap '{instance.roadmap.name}'"
        )
        return instance

    def update(self, instance, validated_data):
        changed_data = get_changed_data(instance, validated_data)
        instance = super().update(instance, validated_data)
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
            project=instance.roadmap.project,
            type="update",
            entity="roadmap_phase",
            entity_id=instance.id,
            description=f"Phase '{instance.name}' updated: {', '.join(activity_description)}"
        )
        return instance


class RoadmapSerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    phases = RoadmapPhaseSerializer(many=True, read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Roadmap
        fields = ('id', 'projectId', 'name', 'description', 'status', 'phases', 'createdAt', 'updatedAt')
        read_only_fields = ('id', 'projectId', 'phases', 'createdAt', 'updatedAt')

    def create(self, validated_data):
        instance = super().create(validated_data)
        Activity.objects.create(
            project=instance.project,
            type="create",
            entity="roadmap",
            entity_id=instance.id,
            description=f"Roadmap '{instance.name}' created"
        )
        return instance

    def update(self, instance, validated_data):
        changed_data = get_changed_data(instance, validated_data)
        instance = super().update(instance, validated_data)
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
            project=instance.project,
            type="update",
            entity="roadmap",
            entity_id=instance.id,
            description=f"Roadmap '{instance.name}' updated: {', '.join(activity_description)}"
        )
        return instance
