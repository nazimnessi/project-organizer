from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CustomTokenObtainPairView
from .viewsets import ProjectViewSet, FeatureViewSet, BugViewSet, ImprovementViewSet, ActivityViewSet, UserViewSet
from rest_framework_simplejwt.views import  TokenRefreshView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'features', FeatureViewSet, basename='feature')
router.register(r'bugs', BugViewSet, basename='bug')
router.register(r'improvements', ImprovementViewSet, basename='improvement')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
