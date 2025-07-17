"use client"

interface VideoPlayerProps {
  fileUrl: string;
  posterUrl?: string;
}

export function VideoPlayer({ fileUrl, posterUrl }: VideoPlayerProps) {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video controls className="w-full h-full" poster={posterUrl || "/placeholder.svg?height=400&width=700"}>
        <source src={fileUrl} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  )
}