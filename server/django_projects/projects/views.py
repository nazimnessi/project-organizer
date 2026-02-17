from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

import requests
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from .models import CustomUser, Project, Feature, Bug, Improvement, Activity

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


def get_user_from_session(request):
    """Extract user from session claims."""
    claims = request.session.get('claims')
    if not claims:
        return None
    return claims.get('sub')

class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        access_token = request.data.get("access_token")

        # Fetch user info from Google
        google_user = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        if "email" not in google_user:
            return Response({"error": "Invalid token"}, status=400)

        email = google_user["email"]
        try:
            user = CustomUser.objects.get(
                    email=email,
                )
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


@require_http_methods(["GET"])
def project_detail(request, pk):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        project = Project.objects.get(pk=pk, user_id=user_id)
        return JsonResponse({
            'id': project.id,
            'userId': project.user_id,
            'name': project.name,
            'description': project.description,
            'productionLink': project.production_link,
            'repoLink': project.repo_link,
            'frontendLink': project.frontend_link,
            'backendLink': project.backend_link,
            'frontendDetails': project.frontend_details,
            'backendDetails': project.backend_details,
            'envDetails': project.env_details,
            'testUserDetails': project.test_user_details,
            'authDetails': project.auth_details,
            'setupSteps': project.setup_steps,
            'createdAt': project.created_at.isoformat(),
        })
    except Project.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def feature_list(request, project_id):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        project = Project.objects.get(pk=project_id, user_id=user_id)
        features = Feature.objects.filter(project=project).values()
        return JsonResponse(list(features), safe=False)
    except Project.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def feature_detail(request, pk):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        feature = Feature.objects.select_related('project').get(pk=pk, project__user_id=user_id)
        return JsonResponse({
            'id': feature.id,
            'projectId': feature.project_id,
            'description': feature.description,
            'status': feature.status,
            'rank': feature.rank,
            'tags': feature.tags,
            'createdAt': feature.created_at.isoformat(),
        })
    except Feature.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def bug_list(request, project_id):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        project = Project.objects.get(pk=project_id, user_id=user_id)
        bugs = Bug.objects.filter(project=project).values()
        return JsonResponse(list(bugs), safe=False)
    except Project.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def bug_detail(request, pk):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        bug = Bug.objects.select_related('project').get(pk=pk, project__user_id=user_id)
        return JsonResponse({
            'id': bug.id,
            'projectId': bug.project_id,
            'description': bug.description,
            'status': bug.status,
            'rank': bug.rank,
            'tags': bug.tags,
            'createdAt': bug.created_at.isoformat(),
        })
    except Bug.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def improvement_list(request, project_id):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        project = Project.objects.get(pk=project_id, user_id=user_id)
        improvements = Improvement.objects.filter(project=project).values()
        return JsonResponse(list(improvements), safe=False)
    except Project.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def improvement_detail(request, pk):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        improvement = Improvement.objects.select_related('project').get(pk=pk, project__user_id=user_id)
        return JsonResponse({
            'id': improvement.id,
            'projectId': improvement.project_id,
            'description': improvement.description,
            'status': improvement.status,
            'rank': improvement.rank,
            'tags': improvement.tags,
            'createdAt': improvement.created_at.isoformat(),
        })
    except Improvement.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)


@require_http_methods(["GET"])
def activity_list(request, project_id):
    user_id = get_user_from_session(request)
    if not user_id:
        return JsonResponse({'message': 'Unauthorized'}, status=401)
    
    try:
        project = Project.objects.get(pk=project_id, user_id=user_id)
        activities = Activity.objects.filter(project=project).values()
        return JsonResponse(list(activities), safe=False)
    except Project.DoesNotExist:
        return JsonResponse({'message': 'Not found'}, status=404)
