"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

// Định nghĩa interface Video đúng với backend
interface Video {
  id: number;
  title: string;
  description: string;
  file: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  user: string;
  category: { id: number; name: string; description?: string } | null;
  keywords: { id: number; name: string }[];
  // status?: string; // Nếu muốn quản lý trạng thái
}

// Mock data đúng schema backend
const mockVideos: Video[] = [
  {
    id: 1,
    title: "Video hướng dẫn React",
    description: "Học React cơ bản cho người mới bắt đầu.",
    file: "/videos/video1.mp4",
    thumbnail: "/placeholder.jpg",
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-06-01T10:00:00Z",
    user: "admin",
    category: { id: 1, name: "Lập trình" },
    keywords: [
      { id: 1, name: "react" },
      { id: 2, name: "frontend" },
    ],
    // status: "active",
  },
  {
    id: 2,
    title: "Giới thiệu về Python",
    description: "Video nhập môn Python.",
    file: "/videos/video2.mp4",
    thumbnail: null,
    created_at: "2024-06-02T12:30:00Z",
    updated_at: "2024-06-02T12:30:00Z",
    user: "user1",
    category: { id: 2, name: "Khoa học dữ liệu" },
    keywords: [
      { id: 3, name: "python" },
      { id: 4, name: "data" },
    ],
    // status: "pending",
  },
]

export function VideoManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<Video[]>(mockVideos)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="text-green-600">
            Hoạt động
          </Badge>
        )
      case "pending":
        return <Badge variant="outline">Chờ duyệt</Badge>
      case "reported":
        return <Badge variant="destructive">Bị báo cáo</Badge>
      case "blocked":
        return <Badge variant="destructive">Bị chặn</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const handleStatusChange = (videoId: number, newStatus: string) => {
    setVideos(videos.map((video) => (video.id === videoId ? { ...video, status: newStatus } : video)))
  }

  const handleDelete = (videoId: number) => {
    setVideos(videos.filter((video) => video.id !== videoId))
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.user.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Video</h1>
              <p className="text-muted-foreground">Quản lý tất cả video trên nền tảng</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm video..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Ngày tải</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            width={100}
                            height={60}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                          <p className="text-xs text-muted-foreground">{video.category?.name || "Không có danh mục"}</p>
                          <p className="text-xs text-muted-foreground">Từ khóa: {video.keywords.map(k => k.name).join(", ")}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{video.user}</TableCell>
                    <TableCell>{new Date(video.created_at).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(video.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không tìm thấy video nào</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
