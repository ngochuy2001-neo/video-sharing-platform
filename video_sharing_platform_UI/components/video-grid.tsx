"use client";
import { useEffect, useState } from "react";
import { VideoCard } from "@/components/video-card";
import api from "@/utils/axios";

interface Video {
  id: number;
  title: string;
  thumbnail: string | null;
  duration?: string;
  views?: number;
  uploadTime?: string;
  channel?: string;
  channelAvatar?: string;
}

export function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/api/media/videos/")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Lỗi fetch videos:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-full text-center py-8">Đang tải video...</div>
      ) : videos.length === 0 ? (
        <div className="col-span-full text-center py-8">Chưa có video nào.</div>
      ) : (
        videos.map((video) => <VideoCard key={video.id} video={video} />)
      )}
    </div>
  );
}
