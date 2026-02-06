from rest_framework import serializers

from .utils import get_changed_data
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity
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

    class Meta:
        model = Feature
        fields = ('id', 'projectId', 'description', 'status', 'rank', 'tags', 'createdAt')
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
                type="Create",
                entity="Feature",
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
                type="Update",
                entity="Feature",
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
                entity="Feature",
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
                entity="Bug",
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
                entity="Improvement",
                entity_id=instance.id,
                description=f"Improvement '{instance.description}' status updated to '{instance.status}'"
            )
        return instance


class BugSerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    tags = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Bug
        fields = ('id', 'projectId', 'description', 'status', 'rank', 'tags', 'createdAt')
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
                type="Create",
                entity="Bug",
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
                type="Update",
                entity="Bug",
                entity_id=instance.id,
                description=f"Bug '{instance.description}' updated with {', '.join(activity_description)}"
            )
        return instance


class ImprovementSerializer(serializers.ModelSerializer):
    projectId = serializers.IntegerField(source='project.id', read_only=True)
    tags = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Improvement
        fields = ('id', 'projectId', 'description', 'status', 'rank', 'tags', 'createdAt')
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
                type="Create",
                entity="Improvement",
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
                type="Update",
                entity="Improvement",
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
    repoLink = serializers.CharField(source='repo_link', required=False, allow_blank=True, allow_null=True)
    frontendLink = serializers.CharField(source='frontend_link', required=False, allow_blank=True, allow_null=True)
    backendLink = serializers.CharField(source='backend_link', required=False, allow_blank=True, allow_null=True)
    frontendDetails = serializers.CharField(source='frontend_details', required=False, allow_blank=True, allow_null=True)
    backendDetails = serializers.CharField(source='backend_details', required=False, allow_blank=True, allow_null=True)
    envDetails = serializers.CharField(source='env_details', required=False, allow_blank=True, allow_null=True)
    testUserDetails = serializers.CharField(source='test_user_details', required=False, allow_blank=True, allow_null=True)
    authDetails = serializers.CharField(source='auth_details', required=False, allow_blank=True, allow_null=True)
    setupSteps = serializers.JSONField(
        source="setup_steps",
        required=False
    )
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'userId', 'name', 'description', 'productionLink', 'repoLink',
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
                type="Create",
                entity="Project",
                entity_id=instance.id,
                description=f"Project '{instance.name}' created"
            )
        return instance

   

    def update(self, instance, validated_data):
        changed_data = get_changed_data(instance, validated_data)
        for attr, (old_value, new_value) in changed_data.items():
            setattr(instance, attr, new_value)
        instance.save()
        activity_description = []
        for attr, (old_value, new_value) in changed_data.items():
            activity_description.append(f"Field '{attr}' changed from '{old_value}' to '{new_value}'")
        Activity.objects.create(
                project=instance,
                type="Update",
                entity="Project",
                entity_id=instance.id,
                description=f"Project '{instance.name}' updated with {', '.join(activity_description)}"
            )
        return instance
