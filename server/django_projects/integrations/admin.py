from django.contrib import admin
from .models import Integration, ProjectIntegration


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
	list_display = ('id', 'key', 'name', 'category', 'user', 'created_at')
	search_fields = ('key', 'name', 'category')
	list_filter = ('category',)


@admin.register(ProjectIntegration)
class ProjectIntegrationAdmin(admin.ModelAdmin):
	list_display = ("id", 'project', 'integration', 'created_at')
	search_fields = ('project__name', 'integration__name')
