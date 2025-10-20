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

class UserDetailView(generics.RetrieveUpdateAPIView):
    """View for getting and updating user profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Return the current authenticated user"""
        return self.request.user
    
    def get_serializer(self, *args, **kwargs):
        """Override to exclude password field on updates"""
        serializer_class = self.get_serializer_class()
        kwargs['partial'] = True
        return serializer_class(*args, **kwargs)

class ChangePasswordView(generics.GenericAPIView):
    """View for changing user password"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        """Change password for the authenticated user"""
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response(
                {'detail': 'Both old_password and new_password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify old password
        if not user.check_password(old_password):
            return Response(
                {'detail': 'Old password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate new password
        if len(new_password) < 8:
            return Response(
                {'detail': 'New password must be at least 8 characters long.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response(
            {'detail': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        )

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
        
    def get_object(self):
        """Get section object with better error handling"""
        # Log the lookup attempt
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Looking up section with pk={self.kwargs.get('pk')}")
        
        # Try to get the object
        return super().get_object()
    
    def create(self, request, *args, **kwargs):
        """Create a new section with detailed error reporting and auto-fill defaults"""
        import logging
        logger = logging.getLogger(__name__)
        
        resume_id = self.kwargs.get('resume_pk')
        resume = get_object_or_404(Resume, pk=resume_id, user=self.request.user)
        
        # Copy request data to add missing fields
        data = request.data.copy()
        
        # DEBUG: Log the incoming request data
        logger.info(f"🔍 CREATE SECTION - Resume ID: {resume_id}")
        logger.info(f"🔍 REQUEST DATA RECEIVED: {dict(request.data)}")
        logger.info(f"🔍 Section Type: {data.get('type')}")
        logger.info(f"🔍 Has Content: {'content' in data}")
        if 'content' in data:
            logger.info(f"🔍 Content Value: {data.get('content')}")
        
        # Get the highest order value for existing sections to place new section at the end
        highest_order = Section.objects.filter(resume=resume).order_by('-order').values_list('order', flat=True).first()
        order = 1 if highest_order is None else highest_order + 1
        
        # If order is not provided in the request data, add it
        if 'order' not in data:
            data['order'] = order
            
        # Log the incoming data for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Creating section with data: {data}")
        
        # If content is not provided, create default content based on section type
        if 'content' not in data:
            section_type = data.get('type')
            default_content = {}
            
            if section_type == 'contact':
                default_content = {
                    'email': '',
                    'phone': '',
                    'address': '',
                    'name': '',
                    'title': '',
                    'linkedin': '',
                    'website': '',
                    'location': ''
                }
            elif section_type == 'summary':
                default_content = {
                    'text': ''
                }
            elif section_type == 'experience':
                default_content = {
                    'items': []
                }
            elif section_type == 'education':
                default_content = {
                    'items': []
                }
            elif section_type == 'skills':
                default_content = {
                    'items': []
                }
            elif section_type == 'projects':
                default_content = {
                    'items': []
                }
            elif section_type == 'custom':
                default_content = {
                    'title': '',
                    'content': '',
                    'text': ''
                }
                
            # Add default content to data
            data['content'] = default_content
            logger.info(f"Added default content for {section_type}: {default_content}")
            
        # Create the serializer with our modified data
        serializer = self.get_serializer(data=data)
        
        if not serializer.is_valid():
            # Return detailed validation errors
            logger.error(f"Section validation errors: {serializer.errors}")
            return Response(
                {"detail": "Invalid data", "errors": serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save with the resume instance
        section = serializer.save(resume=resume)
        logger.info(f"✅ Created section: {section.id} for resume: {resume.id}")
        logger.info(f"✅ Section Type: {section.type}")
        logger.info(f"✅ Section Content Saved: {section.content}")
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
            
    def update(self, request, *args, **kwargs):
        """Update a section with detailed error reporting"""
        import logging
        logger = logging.getLogger(__name__)
        
        # DEBUG: Log the incoming update data
        section_id = kwargs.get('pk')
        print(f"\n{'='*80}")
        print(f"🔍 UPDATE SECTION - Section ID: {section_id}")
        print(f"🔍 REQUEST DATA RECEIVED: {dict(request.data)}")
        print(f"🔍 Has Content: {'content' in request.data}")
        if 'content' in request.data:
            content = request.data.get('content')
            print(f"🔍 Content Value: {content}")
            print(f"🔍 Content Type: {type(content)}")
            print(f"🔍 Content Length: {len(str(content))}")
        print(f"🔍 Type Field: {request.data.get('type')}")
        print(f"🔍 Order Field: {request.data.get('order')}")
        print(f"{'='*80}\n")
        
        logger.info(f"🔍 UPDATE SECTION - Section ID: {section_id}")
        logger.info(f"🔍 REQUEST DATA: {dict(request.data)}")
        logger.info(f"🔍 Has Content: {'content' in request.data}")
        if 'content' in request.data:
            logger.info(f"🔍 Content Value: {request.data.get('content')}")
        logger.info(f"🔍 Type Field: {request.data.get('type')}")
        
        partial = kwargs.pop('partial', False)
        
        try:
            instance = self.get_object()
        except:
            # Log the error for debugging
            logger.error(f"Section not found: {kwargs.get('pk')}")
            return Response({"detail": "Section not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Ensure the user owns the resume this section belongs to
        if instance.resume.user != request.user:
            return Response({"detail": "You do not have permission to update this section"}, 
                          status=status.HTTP_403_FORBIDDEN)
            
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            # Return detailed validation errors
            return Response(
                {"detail": "Invalid data", "errors": serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        self.perform_update(serializer)
        
        # DEBUG: Log the updated section
        updated_section = serializer.instance
        print(f"\n{'='*80}")
        print(f"✅ SECTION UPDATED:")
        print(f"   Section ID: {updated_section.id}")
        print(f"   Type: {updated_section.type}")
        print(f"   Order: {updated_section.order}")
        print(f"   Content Saved: {updated_section.content}")
        print(f"{'='*80}\n")
        
        logger.info(f"✅ Updated section: {updated_section.id}")
        logger.info(f"✅ Section Type: {updated_section.type}")
        logger.info(f"✅ Section Content After Update: {updated_section.content}")
        
        return Response(serializer.data)

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
