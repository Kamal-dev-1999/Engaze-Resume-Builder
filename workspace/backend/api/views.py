from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
import uuid

from django.contrib.auth import get_user_model
from .models import Resume, Section, Style
from .serializers import (
    UserSerializer, 
    ResumeSerializer, 
    ResumeListSerializer,
    SectionSerializer, 
    StyleSerializer,
    PublicResumeSerializer
)

User = get_user_model()

class UserCreateView(generics.CreateAPIView):
    """View for creating a new user (registration)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ResumeViewSet(viewsets.ModelViewSet):
    """ViewSet for Resume model"""
    serializer_class = ResumeSerializer
    
    def get_queryset(self):
        """Return resumes for current authenticated user only"""
        return Resume.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'list':
            return ResumeListSerializer
        return ResumeSerializer
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Generate a share link for a resume"""
        resume = self.get_object()
        if not resume.share_slug:
            resume.share_slug = uuid.uuid4()
            resume.save()
        
        share_url = f"/share/{resume.share_slug}"
        return Response({'share_url': share_url}, status=status.HTTP_200_OK)

class SectionViewSet(viewsets.ModelViewSet):
    """ViewSet for Section model"""
    serializer_class = SectionSerializer
    
    def get_queryset(self):
        """Return sections for current authenticated user only"""
        resume_id = self.kwargs.get('resume_pk')
        if resume_id:
            return Section.objects.filter(resume_id=resume_id, resume__user=self.request.user)
        return Section.objects.filter(resume__user=self.request.user)
    
    def perform_create(self, serializer):
        """Create a new section"""
        resume_id = self.kwargs.get('resume_pk')
        resume = get_object_or_404(Resume, pk=resume_id, user=self.request.user)
        serializer.save(resume=resume)

class StyleViewSet(viewsets.ModelViewSet):
    """ViewSet for Style model"""
    serializer_class = StyleSerializer
    
    def get_queryset(self):
        """Return style for current authenticated user only"""
        resume_id = self.kwargs.get('resume_pk')
        if resume_id:
            return Style.objects.filter(resume_id=resume_id, resume__user=self.request.user)
        return Style.objects.filter(resume__user=self.request.user)

class PublicResumeView(generics.RetrieveAPIView):
    """View for publicly shared resumes"""
    queryset = Resume.objects.all()
    serializer_class = PublicResumeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'share_slug'
