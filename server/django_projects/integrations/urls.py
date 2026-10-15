from rest_framework.routers import DefaultRouter

from .viewsets import IntegrationViewSet, ProjectIntegrationViewSet


router = DefaultRouter()
router.register('integrations', IntegrationViewSet, basename='integration')
router.register('project-integrations', ProjectIntegrationViewSet, basename='project-integration')

urlpatterns = router.urls