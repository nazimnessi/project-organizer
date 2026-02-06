from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """Custom user model extending Django's AbstractUser."""
    profile_image_url = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.email or self.username


class Project(models.Model):
    """Project model."""
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, db_column='user_id')
    name = models.TextField()
    description = models.TextField(null=True, blank=True)
    production_link = models.TextField(null=True, blank=True)
    repo_link = models.TextField(null=True, blank=True)
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
