from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name', 'username')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'description', 'status', 'rank', 'created_at')
    search_fields = ('description', 'project__name')
    list_filter = ('status', 'created_at')


@admin.register(Bug)
class BugAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'description', 'status', 'rank', 'created_at')
    search_fields = ('description', 'project__name')
    list_filter = ('status', 'created_at')


@admin.register(Improvement)
class ImprovementAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'description', 'status', 'rank', 'created_at')
    search_fields = ('description', 'project__name')
    list_filter = ('status', 'created_at')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'type', 'entity', 'created_at')
    search_fields = ('description', 'project__name')
    list_filter = ('type', 'entity', 'created_at')
