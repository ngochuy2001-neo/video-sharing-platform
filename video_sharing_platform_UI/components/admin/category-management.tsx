"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
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
  FolderOpen,
  Video,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
  created_at: string;
}

export function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://http://192.168.10.83//api/media/categories/"
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error", err);
    }
  };

  const handleAddCategory = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        "http://http://192.168.10.83//api/media/categories/",
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories([...categories, res.data]);
      setNewCategory({ name: "", description: "", icon: "" });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Add category error", err);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://http://192.168.10.83//api/media/categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Delete category error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-muted/10">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm danh mục</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Tên danh mục"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Mô tả"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Icon (emoji)"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddCategory}>Tạo</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Tìm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="text-xl">
                      {cat.icon || "📁"}
                    </TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell>
                      {new Date(cat.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
