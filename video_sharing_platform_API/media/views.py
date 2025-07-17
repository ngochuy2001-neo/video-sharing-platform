from rest_framework import viewsets, permissions
from .models import Video, Category, Keyword
from .serializers import VideoSerializer, CategorySerializer, KeywordSerializer
from moviepy.editor import VideoFileClip
from django.core.files.base import ContentFile
import os
from PIL import Image
import io

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-created_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        video = serializer.save()
        # Tạo thumbnail từ frame đầu tiên
        if video.file:
            try:
                clip = VideoFileClip(video.file.path)
                frame = clip.get_frame(0)  # Lấy frame đầu tiên
                image = Image.fromarray(frame)
                thumb_io = io.BytesIO()
                image.save(thumb_io, format='JPEG')
                thumb_name = os.path.splitext(os.path.basename(video.file.name))[0] + '_thumb.jpg'
                video.thumbnail.save(thumb_name, ContentFile(thumb_io.getvalue()), save=True)
                clip.close()
            except Exception as e:
                print('Lỗi tạo thumbnail:', e)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer