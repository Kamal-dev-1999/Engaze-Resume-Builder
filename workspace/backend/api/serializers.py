from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Resume, Section, Style

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        user = User.objects.create_user(**validated_data)
        return user

class StyleSerializer(serializers.ModelSerializer):
    """Serializer for the Style model"""
    class Meta:
        model = Style
        fields = ('id', 'primary_color', 'font_family', 'font_size')

class SectionSerializer(serializers.ModelSerializer):
    """Serializer for the Section model"""
    class Meta:
        model = Section
        fields = ('id', 'type', 'content', 'order')

class ResumeSerializer(serializers.ModelSerializer):
    """Serializer for the Resume model"""
    sections = SectionSerializer(many=True, read_only=True)
    style = StyleSerializer(read_only=True)
    
    class Meta:
        model = Resume
        fields = ('id', 'title', 'template_name', 'share_slug', 'created_at', 'updated_at', 'sections', 'style')
        read_only_fields = ('share_slug', 'created_at', 'updated_at', 'user')
    
    def create(self, validated_data):
        """Create a new resume and associated style"""
        user = self.context['request'].user
        resume = Resume.objects.create(user=user, **validated_data)
        
        # Create default style for the resume
        Style.objects.create(resume=resume)
        
        return resume

class ResumeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing resumes"""
    class Meta:
        model = Resume
        fields = ('id', 'title', 'template_name', 'updated_at')

class PublicResumeSerializer(serializers.ModelSerializer):
    """Serializer for publicly shared resumes"""
    sections = SectionSerializer(many=True, read_only=True)
    style = StyleSerializer(read_only=True)
    
    class Meta:
        model = Resume
        fields = ('id', 'title', 'template_name', 'sections', 'style')