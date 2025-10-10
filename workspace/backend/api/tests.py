from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Resume, Section, Style

User = get_user_model()

class AuthTests(APITestCase):
    """Test the auth API"""
    
    def setUp(self):
        """Setup test data"""
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'Last'
        }
    
    def test_register(self):
        """Test registration"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
    
    def test_obtain_token(self):
        """Test token generation"""
        # Create a user
        User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpassword123'
        )
        
        # Get token
        response = self.client.post(
            self.token_url, 
            {'username': 'testuser', 'password': 'testpassword123'}, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

class ResumeTests(APITestCase):
    """Test the resume API"""
    
    def setUp(self):
        """Setup test data"""
        # Create a user
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpassword123'
        )
        
        # Get token
        response = self.client.post(
            reverse('token_obtain_pair'), 
            {'username': 'testuser', 'password': 'testpassword123'}, 
            format='json'
        )
        self.token = response.data['access']
        self.api_authentication()
        
        # Create a resume
        self.resume = Resume.objects.create(
            user=self.user,
            title='Test Resume',
            template_name='classic'
        )
        
        # Create a style
        Style.objects.create(
            resume=self.resume,
            primary_color='#000000',
            font_family='Inter',
            font_size=10
        )
        
        # URL setup
        self.resumes_url = reverse('resume-list')
    
    def api_authentication(self):
        """Setup API authentication"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_resume_list(self):
        """Test retrieving resume list"""
        response = self.client.get(self.resumes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_resume_create(self):
        """Test creating a resume"""
        data = {'title': 'New Resume', 'template_name': 'modern'}
        response = self.client.post(self.resumes_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Resume.objects.count(), 2)
        
    def test_resume_detail(self):
        """Test retrieving a resume detail"""
        response = self.client.get(reverse('resume-detail', args=[self.resume.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Resume')
    
    def test_share_resume(self):
        """Test sharing a resume"""
        url = reverse('resume-share', args=[self.resume.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('share_url', response.data)
        
        # Verify the resume was updated with a share_slug
        self.resume.refresh_from_db()
        self.assertIsNotNone(self.resume.share_slug)

class SectionTests(APITestCase):
    """Test the section API"""
    
    def setUp(self):
        """Setup test data"""
        # Create a user
        self.user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='testpassword123'
        )
        
        # Get token
        response = self.client.post(
            reverse('token_obtain_pair'), 
            {'username': 'testuser', 'password': 'testpassword123'}, 
            format='json'
        )
        self.token = response.data['access']
        self.api_authentication()
        
        # Create a resume
        self.resume = Resume.objects.create(
            user=self.user,
            title='Test Resume',
            template_name='classic'
        )
        
        # URL setup
        self.sections_url = reverse('resume-sections', args=[self.resume.id])
    
    def api_authentication(self):
        """Setup API authentication"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_section_create(self):
        """Test creating a section"""
        data = {
            'type': 'experience',
            'content': {
                'title': 'Software Developer',
                'company': 'Tech Company',
                'location': 'New York',
                'start_date': '2022-01',
                'end_date': '2025-10',
                'description': 'Developed web applications'
            },
            'order': 1
        }
        response = self.client.post(self.sections_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Section.objects.count(), 1)
        
    def test_section_list(self):
        """Test retrieving section list"""
        # Create a section
        Section.objects.create(
            resume=self.resume,
            type='experience',
            content={
                'title': 'Software Developer',
                'company': 'Tech Company'
            },
            order=1
        )
        
        response = self.client.get(self.sections_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
