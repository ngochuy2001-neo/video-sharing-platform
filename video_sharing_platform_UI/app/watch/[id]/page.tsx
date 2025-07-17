"use client"
import { VideoPlayer } from "@/components/video-player"
import { VideoInfo } from "@/components/video-info"
import { CommentSection } from "@/components/comment-section"
import { RelatedVideos } from "@/components/related-videos"
import api from "@/utils/axios"
import { useEffect, useState } from "react"

interface WatchPageProps {
  params: {
    id: string
  }
}

export default function WatchPage({ params }: WatchPageProps) {
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/api/media/videos/${params.id}/`)
      .then(res => setVideo(res.data))
      .catch(() => setError("Không tìm thấy video hoặc có lỗi khi tải."))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div>Đang tải video...</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : video ? (
            <>
              <VideoPlayer fileUrl={video.file} posterUrl={video.thumbnail} />
              <VideoInfo videoId={params.id} />
              <CommentSection videoId={params.id} />
            </>
          ) : null}
        </div>
        <div className="lg:col-span-1">
          <RelatedVideos videoId={params.id} />
        </div>
      </div>
    </div>
  )
}
