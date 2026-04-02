from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Project, Feature, Bug, Improvement, RoadmapPhase, RoadmapItem
from datetime import timedelta, date

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

class BacklogAndPhaseFieldsTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='backloguser', password='testpass')
        self.project = Project.objects.create(user=self.user, name='Backlog Project')
        self.phase = RoadmapPhase.objects.create(roadmap=None, name='Phase 1', order=1)

    def test_feature_fields(self):
        feature = Feature.objects.create(
            project=self.project,
            description='Test Feature',
            estimated_work_time=timedelta(hours=5),
            priority='high',
            deadline=date(2026, 4, 10)
        )
        self.assertEqual(feature.estimated_work_time, timedelta(hours=5))
        self.assertEqual(feature.priority, 'high')
        self.assertEqual(feature.deadline, date(2026, 4, 10))

    def test_bug_fields(self):
        bug = Bug.objects.create(
            project=self.project,
            description='Test Bug',
            estimated_work_time=timedelta(hours=2),
            priority='medium',
            deadline=date(2026, 4, 12)
        )
        self.assertEqual(bug.estimated_work_time, timedelta(hours=2))
        self.assertEqual(bug.priority, 'medium')
        self.assertEqual(bug.deadline, date(2026, 4, 12))

    def test_improvement_fields(self):
        improvement = Improvement.objects.create(
            project=self.project,
            description='Test Improvement',
            estimated_work_time=timedelta(hours=3),
            priority='low',
            deadline=date(2026, 4, 15)
        )
        self.assertEqual(improvement.estimated_work_time, timedelta(hours=3))
        self.assertEqual(improvement.priority, 'low')
        self.assertEqual(improvement.deadline, date(2026, 4, 15))

    def test_roadmap_phase_fields(self):
        phase = RoadmapPhase.objects.create(
            roadmap=None,
            name='Phase 2',
            order=2,
            estimated_work_time=timedelta(hours=8),
            deadline=date(2026, 4, 20)
        )
        self.assertEqual(phase.estimated_work_time, timedelta(hours=8))
        self.assertEqual(phase.deadline, date(2026, 4, 20))

    def test_roadmap_item_fields(self):
        phase = RoadmapPhase.objects.create(roadmap=None, name='Phase 3', order=3)
        item = RoadmapItem.objects.create(
            roadmap_phase=phase,
            title='Item 1',
            estimated_work_time=timedelta(hours=4),
            deadline=date(2026, 4, 25)
        )
        self.assertEqual(item.estimated_work_time, timedelta(hours=4))
        self.assertEqual(item.deadline, date(2026, 4, 25))