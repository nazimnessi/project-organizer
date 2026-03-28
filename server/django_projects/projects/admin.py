from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity, Roadmap, RoadmapPhase, RoadmapItem


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


@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'name', 'status', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'project__name')
    list_filter = ('status', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(RoadmapPhase)
class RoadmapPhaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'roadmap', 'name', 'order', 'status', 'target_date', 'created_at')
    search_fields = ('name', 'roadmap__name', 'roadmap__project__name')
    list_filter = ('status', 'created_at', 'target_date', 'roadmap__project')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('roadmap', 'order')


@admin.register(RoadmapItem)
class RoadmapItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'roadmap_phase', 'title', 'status', 'priority', 'created_at')
    search_fields = ('title', 'description', 'roadmap_phase__name', 'roadmap_phase__roadmap__name')
    list_filter = ('status', 'priority', 'created_at', 'roadmap_phase__roadmap__project')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Info', {
            'fields': ('roadmap_phase', 'title', 'description', 'status', 'priority')
        }),
        ('Links', {
            'fields': ('linked_feature', 'linked_bug', 'linked_improvement'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
