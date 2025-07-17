# models.py

from django.db import models
from django.conf import settings
import os

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Keyword(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Video(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    file = models.FileField(upload_to='')  # lưu file lên thư mục MEDIA_ROOT/videos/
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='videos')
    keywords = models.ManyToManyField(Keyword, through='VideoKeyword', related_name='videos')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        # Xóa file video vật lý nếu tồn tại
        if self.file and self.file.name:
            try:
                file_path = self.file.storage.path(self.file.name)
                if os.path.isfile(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Lỗi xóa file video: {e}")
        # Xóa file thumbnail vật lý nếu tồn tại
        if self.thumbnail and self.thumbnail.name:
            try:
                thumb_path = self.thumbnail.storage.path(self.thumbnail.name)
                if os.path.isfile(thumb_path):
                    os.remove(thumb_path)
            except Exception as e:
                print(f"Lỗi xóa thumbnail: {e}")
        super().delete(*args, **kwargs)

class VideoKeyword(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('video', 'keyword')
