# serializers.py

from rest_framework import serializers
from .models import Video, Category, Keyword

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['id', 'name']

class VideoSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    category = CategorySerializer(read_only=True)

    keyword_ids = serializers.PrimaryKeyRelatedField(
        queryset=Keyword.objects.all(), many=True, source='keywords', write_only=True, required=False
    )
    keywords = KeywordSerializer(read_only=True, many=True)

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Video
        fields = [
            'id', 'title', 'description', 'file', 'thumbnail',
            'created_at', 'updated_at', 'user',
            'category_id', 'category', 'keyword_ids', 'keywords'
        ]

    def create(self, validated_data):
        keywords = validated_data.pop('keywords', [])
        user = self.context['request'].user
        video = Video.objects.create(user=user, **validated_data)
        video.keywords.set(keywords)
        return video

    def update(self, instance, validated_data):
        keywords = validated_data.pop('keywords', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if keywords is not None:
            instance.keywords.set(keywords)
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['id', 'name']