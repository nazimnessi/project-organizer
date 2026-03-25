from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Project

class ProjectModelTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', password='testpass')

    def test_project_creation_with_status_and_deployment_plan(self):
        project = Project.objects.create(
            user=self.user,
            name='Test POC Project',
            description='A test project',
            status='POC',
            deployment_plan='Deploy to Heroku'
        )
        self.assertEqual(project.status, 'POC')
        self.assertEqual(project.deployment_plan, 'Deploy to Heroku')

    def test_project_default_status(self):
        project = Project.objects.create(
            user=self.user,
            name='Test Deployed Project',
            description='A deployed project'
        )
        self.assertEqual(project.status, 'Deployed')