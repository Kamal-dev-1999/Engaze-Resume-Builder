from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.db import IntegrityError

def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that improves error responses with detailed information
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # Log the exception for debugging
    import logging
    logger = logging.getLogger(__name__)
    request = context.get('request')
    
    if request:
        logger.error(f"Error handling request: {request.method} {request.path}")
    
    logger.error(f"Exception: {str(exc)}")

    # If the exception is not handled by DRF, handle it here
    if response is None:
        if isinstance(exc, Http404):
            response = Response(
                {'error': 'Resource not found', 'detail': str(exc)},
                status=status.HTTP_404_NOT_FOUND
            )
        elif isinstance(exc, PermissionDenied):
            response = Response(
                {'error': 'You do not have permission to perform this action', 'detail': str(exc)},
                status=status.HTTP_403_FORBIDDEN
            )
        elif isinstance(exc, IntegrityError):
            response = Response(
                {'error': 'Database integrity error', 'detail': str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            # Generic error handling
            response = Response(
                {'error': 'An unexpected error occurred', 'detail': str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        # Add request information to help debugging
        if hasattr(response, 'data') and isinstance(response.data, dict):
            if request:
                path_info = f"{request.method} {request.path}"
                if 'detail' in response.data and isinstance(response.data['detail'], str):
                    # Keep the original detail but add request info
                    original_detail = response.data['detail']
                    response.data['detail'] = f"{original_detail} (Request: {path_info})"
    
    return response