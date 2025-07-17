from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import VideoViewSet, CategoryViewSet, KeywordViewSet

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'keywords', KeywordViewSet, basename='keyword')

urlpatterns = [
    path('', include(router.urls)),
]
