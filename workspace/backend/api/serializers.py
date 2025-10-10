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
        
    def validate(self, data):
        """Validate the entire section data"""
        # For create operations, only validate that the section type is valid if provided
        if self.instance is None:  # This is a create operation
            if 'type' not in data:
                raise serializers.ValidationError({"type": "Section type is required"})
                
        # Make sure type is valid if provided
        if 'type' in data and data['type'] not in dict(Section.SECTION_TYPES).keys():
            valid_types = ', '.join(dict(Section.SECTION_TYPES).keys())
            raise serializers.ValidationError({"type": f"Invalid section type. Valid options are: {valid_types}"})
            
        return data
        
    def validate_content(self, value):
        """Validate content based on section type"""
        # Ensure content is a dict
        if not isinstance(value, dict):
            raise serializers.ValidationError("Content must be a JSON object")
        return value

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