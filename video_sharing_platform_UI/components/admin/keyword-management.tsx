"use client";

import { useState, useEffect } from "react";
import api from "@/utils/axios";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  TrendingUp,
  Hash,
} from "lucide-react";

interface Keyword {
  id: number;
  name: string;
  // Có thể bổ sung các trường khác nếu backend trả về
}

export function KeywordManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [newKeyword, setNewKeyword] = useState<{ label: string }>({
    label: "",
  });

  // Lấy danh sách keywords từ API
  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const res = await api.get<Keyword[]>("/api/media/keywords/");
      setKeywords(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách keywords:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  // Thêm keyword mới qua API
  const handleAddKeyword = async () => {
    try {
      await api.post("/api/media/keywords/", {
        name: newKeyword.label,
      });
      setNewKeyword({ label: "" });
      setIsAddDialogOpen(false);
      fetchKeywords();
    } catch (err) {
      alert("Lỗi khi thêm keyword!");
      console.error(err);
    }
  };

  // Xóa keyword qua API
  const handleDelete = async (keywordId: number) => {
    try {
      await api.delete(`/api/media/keywords/${keywordId}/`);
      fetchKeywords();
    } catch (err) {
      alert("Lỗi khi xóa keyword!");
      console.error(err);
    }
  };

  // Lọc keywords (nếu backend có category thì dùng, nếu không thì bỏ)
  const filteredKeywords = keywords.filter((keyword) => {
    const matchesSearch =
      (keyword.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    // Nếu có category thì lọc, không thì luôn true
    const matchesCategory =
      filterCategory === "all" || (keyword as any).category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalKeywords = keywords.length;
  // Nếu backend không có status/usageCount thì để 0 hoặc bỏ
  const activeKeywords = keywords.length;
  const totalUsage = 0;
  const topKeyword = keywords[0];

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Keywords</h1>
              <p className="text-muted-foreground">
                Quản lý từ khóa cho video trên nền tảng
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Keyword
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Thêm Keyword Mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Tên keyword</Label>
                    <Input
                      id="label"
                      value={newKeyword.label}
                      onChange={(e) =>
                        setNewKeyword({ ...newKeyword, label: e.target.value })
                      }
                      placeholder="React"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleAddKeyword}>Thêm Keyword</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng Keywords
                </CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalKeywords}</div>
                <p className="text-xs text-muted-foreground">
                  {activeKeywords} đang hoạt động
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng lượt sử dụng
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalUsage.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trên tất cả keywords
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Keyword Hot nhất
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topKeyword?.name}</div>
                <p className="text-xs text-muted-foreground">
                  {/* Nếu có usageCount thì hiển thị */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {/* Nếu có category thì hiển thị số lượng */}
                </div>
                <p className="text-xs text-muted-foreground">
                  Danh mục keywords
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Nếu có category thì giữ filter, không thì bỏ */}
          </div>

          {/* Keywords Table */}
          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  {/* Nếu có category thì hiển thị */}
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{keyword.name}</div>
                          <code className="text-xs text-muted-foreground">
                            {keyword.id}
                          </code>
                        </div>
                      </div>
                    </TableCell>
                    {/* Nếu có category thì hiển thị */}
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(keyword.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredKeywords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Không tìm thấy keyword nào
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
