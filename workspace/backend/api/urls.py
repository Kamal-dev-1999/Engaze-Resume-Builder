from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserCreateView,
    ResumeViewSet,
    SectionViewSet,
    StyleViewSet,
    PublicResumeView
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'styles', StyleViewSet, basename='style')

# URL patterns for our API
urlpatterns = [
    # Authentication endpoints
    path('auth/register/', UserCreateView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Public resume endpoint
    path('public/resume/<uuid:share_slug>/', PublicResumeView.as_view(), name='public-resume'),
    
    # Nested routes
    path('resumes/<int:resume_pk>/sections/', SectionViewSet.as_view({'get': 'list', 'post': 'create'}), name='resume-sections'),
    path('resumes/<int:resume_pk>/style/', StyleViewSet.as_view({'get': 'list', 'put': 'update', 'patch': 'partial_update'}), name='resume-style'),
    
    # Include all router-generated URLs
    path('', include(router.urls)),
]