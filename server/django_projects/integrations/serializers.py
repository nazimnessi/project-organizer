from rest_framework import serializers

from projects.models import Project
from .models import Integration, ProjectIntegration


class IntegrationSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source='user_id', read_only=True, allow_null=True)
    websiteUrl = serializers.URLField(
        source='website_url', required=False, allow_null=True, allow_blank=True
    )
    dashboardUrl = serializers.URLField(
        source='dashboard_url', required=False, allow_null=True, allow_blank=True
    )
    docsUrl = serializers.URLField(
        source='docs_url', required=False, allow_null=True, allow_blank=True
    )
    logoUrl = serializers.URLField(
        source='logo_url', required=False, allow_null=True, allow_blank=True
    )
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Integration
        fields = (
            'id', 'key', 'name', 'category', 'description', 'websiteUrl',
            'dashboardUrl', 'docsUrl', 'logoUrl', 'fields', 'userId',
            'createdAt', 'updatedAt',
        )
        read_only_fields = ('id', 'userId', 'createdAt', 'updatedAt')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Integration.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)
        instance.save()
        return instance


class ProjectIntegrationSerializer(serializers.ModelSerializer):
    projectId = serializers.PrimaryKeyRelatedField(
        source='project',
        queryset=Project.objects.all(),
    )
    integrationId = serializers.PrimaryKeyRelatedField(
        source='integration',
        queryset=Integration.objects.all(),
    )
    projectName = serializers.CharField(source='project.name', read_only=True)
    integrationKey = serializers.CharField(source='integration.key', read_only=True)
    integrationName = serializers.CharField(source='integration.name', read_only=True)
    category = serializers.CharField(source='integration.category', read_only=True)
    description = serializers.CharField(
        source='integration.description', read_only=True, allow_null=True
    )
    websiteUrl = serializers.URLField(
        source='integration.website_url', read_only=True, allow_null=True
    )
    dashboardUrl = serializers.URLField(
        source='integration.dashboard_url', read_only=True, allow_null=True
    )
    docsUrl = serializers.URLField(
        source='integration.docs_url', read_only=True, allow_null=True
    )
    logoUrl = serializers.URLField(
        source='integration.logo_url', read_only=True, allow_null=True
    )
    fields = serializers.JSONField(source='integration.fields', read_only=True)
    integrationUserId = serializers.IntegerField(
        source='integration.user_id', read_only=True, allow_null=True
    )
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = ProjectIntegration
        fields = (
            'id', 'projectId', 'projectName', 'integrationId',
            'integrationKey', 'integrationName', 'category', 'description',
            'websiteUrl', 'dashboardUrl', 'docsUrl', 'logoUrl', 'fields',
            'integrationUserId', 'configuration', 'createdAt', 'updatedAt',
        )
        read_only_fields = (
            'id', 'projectName', 'integrationKey', 'integrationName',
            'category', 'description', 'websiteUrl', 'dashboardUrl',
            'docsUrl', 'logoUrl', 'fields', 'integrationUserId',
            'createdAt', 'updatedAt',
        )

    def validate(self, attrs):
        request_user = self.context['request'].user
        project = attrs.get('project', getattr(self.instance, 'project', None))
        integration = attrs.get('integration', getattr(self.instance, 'integration', None))

        if project and project.user_id != request_user.id:
            raise serializers.ValidationError({'projectId': 'Project must belong to the authenticated user.'})
        if integration and integration.user_id not in (None, request_user.id):
            raise serializers.ValidationError({'integrationId': 'Integration must be shared or owned by the authenticated user.'})

        return attrs

    def create(self, validated_data):
        return ProjectIntegration.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)
        instance.save()
        return instance