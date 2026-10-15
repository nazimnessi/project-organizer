from django.conf import settings
from django.db import models


class Integration(models.Model):
	CATEGORY_CHOICES = [
		('Deployment', 'Deployment'),
		('Database', 'Database'),
		('Email', 'Email'),
		('Source control', 'Source control'),
		('Cloud services', 'Cloud services'),
		('Payments', 'Payments'),
		('Other', 'Other'),
	]

	key = models.SlugField(unique=True, help_text='Stable identifier, such as "render".')
	name = models.CharField(max_length=100, help_text='Display name of the integration.')
	category = models.CharField(
		max_length=30,
		choices=CATEGORY_CHOICES,
		default='Other',
		help_text='Category used to group this integration.',
	)
	description = models.TextField(
		null=True,
		blank=True,
		help_text='Short description; supports Markdown formatting.',
	)
	website_url = models.URLField(
		null=True,
		blank=True,
		help_text='Public website for the integration provider.',
	)
	dashboard_url = models.URLField(
		null=True,
		blank=True,
		help_text='Provider dashboard URL.',
	)
	docs_url = models.URLField(
		null=True,
		blank=True,
		help_text='Documentation URL.',
	)
	logo_url = models.URLField(
		null=True,
		blank=True,
		help_text='URL for the integration logo.',
	)
	fields = models.JSONField(
		default=list,
		help_text='List of configuration field definitions, including labels and helper text.',
	)
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
		related_name='integrations',
		help_text='Owner for a custom integration; empty for shared catalog entries.',
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name


class ProjectIntegration(models.Model):
	project = models.ForeignKey(
		'projects.Project',
		on_delete=models.CASCADE,
		related_name='integrations',
		help_text='Project connected to this integration.',
	)
	integration = models.ForeignKey(
		Integration,
		on_delete=models.CASCADE,
		related_name='project_connections',
		help_text='Integration configured for this project.',
	)
	configuration = models.JSONField(
		default=dict,
		help_text='Project-specific values keyed by the integration field IDs.',
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.project.name} - {self.integration.name}'
