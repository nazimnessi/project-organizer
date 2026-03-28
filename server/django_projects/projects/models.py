from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField


class CustomUser(AbstractUser):
    """Custom user model extending Django's AbstractUser."""
    profile_image_url = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.email or self.username


class Project(models.Model):
    """Project model."""
    STATUS_CHOICES = [
        ('POC', 'POC'),
        ('In Development', 'In Development'),
        ('Deployed', 'Deployed'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, db_column='user_id')
    name = models.TextField()
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Deployed')
    development_notes = models.TextField(null=True, blank=True)
    production_link = models.TextField(null=True, blank=True)
    repo_link = ArrayField(
        base_field=models.TextField(null=True, blank=True),
        default=list,
        blank=True,
    )
    frontend_link = models.TextField(null=True, blank=True)
    backend_link = models.TextField(null=True, blank=True)
    frontend_details = models.TextField(null=True, blank=True)
    backend_details = models.TextField(null=True, blank=True)
    env_details = models.TextField(null=True, blank=True)
    test_user_details = models.TextField(null=True, blank=True)
    auth_details = models.TextField(null=True, blank=True)
    setup_steps = models.JSONField(default=list, blank=True) # JSON string instead of ArrayField
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Feature(models.Model):
    """Feature model."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, db_column='project_id')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rank = models.IntegerField(default=0)
    tags = models.TextField(default='[]', blank=True)  # JSON string instead of ArrayField
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} - {self.description[:50]}"


class Bug(models.Model):
    """Bug model."""
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('fixed', 'Fixed'),
    ]

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, db_column='project_id')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    rank = models.IntegerField(default=0)
    tags = models.TextField(default='[]', blank=True)  # JSON string instead of ArrayField
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} - {self.description[:50]}"


class Improvement(models.Model):
    """Improvement model."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, db_column='project_id')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rank = models.IntegerField(default=0)
    tags = models.TextField(default='[]', blank=True)  # JSON string instead of ArrayField
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} - {self.description[:50]}"


class Activity(models.Model):
    """Activity log model."""
    ACTIVITY_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('status_change', 'Status Change'),
    ]

    ENTITY_TYPES = [
        ('project', 'Project'),
        ('feature', 'Feature'),
        ('bug', 'Bug'),
        ('improvement', 'Improvement'),
        ('roadmap', 'Roadmap'),
        ('roadmap_phase', 'Roadmap Phase'),
        ('roadmap_item', 'Roadmap Item'),
    ]

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, db_column='project_id')
    type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    entity = models.CharField(max_length=50, choices=ENTITY_TYPES)
    entity_id = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.entity} at {self.created_at}"


class Roadmap(models.Model):
    """Roadmap model - contains project phases for planning."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]

    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='roadmaps')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project.name} - {self.name}"


class RoadmapPhase(models.Model):
    """RoadmapPhase model - phases/milestones within a roadmap."""
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    id = models.AutoField(primary_key=True)
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name='phases')
    name = models.CharField(max_length=255)
    order = models.IntegerField()
    target_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.roadmap.name} - {self.name}"


class RoadmapItem(models.Model):
    """RoadmapItem model - individual items/initiatives within a phase."""
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('blocked', 'Blocked'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    id = models.AutoField(primary_key=True)
    roadmap_phase = models.ForeignKey(RoadmapPhase, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, null=True, blank=True)
    linked_feature = models.ForeignKey(Feature, on_delete=models.SET_NULL, null=True, blank=True, related_name='roadmap_items')
    linked_bug = models.ForeignKey(Bug, on_delete=models.SET_NULL, null=True, blank=True, related_name='roadmap_items')
    linked_improvement = models.ForeignKey(Improvement, on_delete=models.SET_NULL, null=True, blank=True, related_name='roadmap_items')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.roadmap_phase.roadmap.name} - {self.title}"
