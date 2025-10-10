from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError

def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that improves error responses
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If the exception is not handled by DRF, handle it here
    if response is None:
        if isinstance(exc, Http404):
            response = Response(
                {'error': 'Resource not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        elif isinstance(exc, PermissionDenied):
            response = Response(
                {'error': 'You do not have permission to perform this action'},
                status=status.HTTP_403_FORBIDDEN
            )
        elif isinstance(exc, IntegrityError):
            response = Response(
                {'error': 'Database integrity error'},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            # Generic error handling
            response = Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return response