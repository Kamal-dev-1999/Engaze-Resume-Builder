from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    """Extended User model"""
    # Add any additional fields here if needed
    pass

class Resume(models.Model):
    """Resume model to store user's resume information"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255)
    template_name = models.CharField(max_length=50, default='classic')
    share_slug = models.UUIDField(unique=True, null=True, blank=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-updated_at']

class Style(models.Model):
    """Style model for resume styling options"""
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='style')
    primary_color = models.CharField(max_length=7, default='#000000')
    font_family = models.CharField(max_length=100, default='Inter')
    font_size = models.IntegerField(default=10)
    
    def __str__(self):
        return f"Style for {self.resume.title}"

class Section(models.Model):
    """Section model for different resume sections"""
    SECTION_TYPES = (
        ('experience', 'Experience'),
        ('education', 'Education'),
        ('skills', 'Skills'),
        ('projects', 'Projects'),
        ('summary', 'Summary'),
        ('contact', 'Contact Information'),
        ('custom', 'Custom'),
    )
    
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='sections')
    type = models.CharField(max_length=20, choices=SECTION_TYPES)
    content = models.JSONField()
    order = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.type} section - {self.resume.title}"
    
    class Meta:
        ordering = ['order']
