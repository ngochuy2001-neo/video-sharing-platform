"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Video, X } from "lucide-react";
import { KeywordsInput } from "@/components/keywords-input";
import api from "@/utils/axios";

export function VideoUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "", // lưu id dạng string để dùng cho Select
    privacy: "public",
    keywordIds: [] as number[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/api/media/categories/").then((res) => setCategories(res.data));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.length > 100) {
      newErrors.title = "Tiêu đề không được vượt quá 100 ký tự";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length > 5000) {
      newErrors.description = "Mô tả không được vượt quá 5000 ký tự";
    }
    if (!formData.category_id) {
      newErrors.category_id = "Vui lòng chọn danh mục";
    }
    if (formData.keywordIds.length === 0) {
      newErrors.keywordIds = "Vui lòng thêm ít nhất 1 keyword";
    } else if (formData.keywordIds.length > 10) {
      newErrors.keywordIds = "Không được vượt quá 10 keywords";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn file video");
      return;
    }
    if (!validateForm()) {
      return;
    }
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category_id", formData.category_id);
    data.append("privacy", formData.privacy);
    formData.keywordIds.forEach((id) => data.append("keyword_ids", String(id)));
    try {
      await api.post("/api/media/videos/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          } else {
            console.log(`Uploaded: ${progressEvent.loaded} bytes`);
          }
        },
      });
      alert("Video đã được tải lên thành công!");
      setSelectedFile(null);
      setFormData({
        title: "",
        description: "",
        category_id: "",
        privacy: "public",
        keywordIds: [],
      });
    } catch (error: any) {
      if (error.response?.data) {
        console.error("Server responded with errors:", error.response.data);
        alert("Lỗi từ server: " + JSON.stringify(error.response.data));
      } else {
        console.error("Upload error:", error);
        alert("Đã có lỗi xảy ra khi upload video.");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleKeywordsChange = (keywordIds: number[]) => {
    setFormData((prev) => ({ ...prev, keywordIds }));
    if (errors.keywordIds) {
      setErrors((prev) => ({ ...prev, keywordIds: "" }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Tải lên video
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Kéo thả video vào đây
              </h3>
              <p className="text-muted-foreground mb-4">hoặc</p>
              <Button asChild>
                <label htmlFor="video-upload" className="cursor-pointer">
                  Chọn file video
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Hỗ trợ: MP4, AVI, MOV, WMV (tối đa 2GB)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
              <Video className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Details Form */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề hấp dẫn cho video của bạn..."
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
                maxLength={100}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.title ? (
                  <span className="text-destructive">{errors.title}</span>
                ) : (
                  <span>Tiêu đề tốt sẽ thu hút nhiều người xem hơn</span>
                )}
                <span>{formData.title.length}/100</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về nội dung video, bao gồm những gì người xem sẽ học được hoặc trải nghiệm..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`min-h-[120px] ${
                  errors.description ? "border-destructive" : ""
                }`}
                maxLength={5000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.description ? (
                  <span className="text-destructive">{errors.description}</span>
                ) : (
                  <span>
                    Mô tả chi tiết giúp video được tìm thấy dễ dàng hơn
                  </span>
                )}
                <span>{formData.description.length}/5000</span>
              </div>
            </div>

            {/* Category and Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category_id">
                  Danh mục <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                >
                  <SelectTrigger className={errors.category_id ? "border-destructive" : ""}>
                    <SelectValue placeholder="Chọn danh mục phù hợp" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-xs text-destructive">{errors.category_id}</p>
                )}
              </div>
              {/* ... privacy giữ nguyên ... */}
              <div className="space-y-2">
                <Label htmlFor="privacy">Quyền riêng tư</Label>
                <Select
                  value={formData.privacy}
                  onValueChange={(value) => handleInputChange("privacy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">🌍 Công khai</SelectItem>
                    <SelectItem value="unlisted">🔗 Không công khai (chỉ có link)</SelectItem>
                    <SelectItem value="private">🔒 Riêng tư</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Keywords */}
            <div className="space-y-2">
              <Label>
                Keywords <span className="text-destructive">*</span>
              </Label>
              <KeywordsInput
                keywordIds={formData.keywordIds}
                onChange={handleKeywordsChange}
                maxKeywords={10}
                error={errors.keywordIds}
              />
              {errors.keywordIds ? (
                <p className="text-xs text-destructive">{errors.keywordIds}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Thêm keywords giúp video được tìm thấy dễ dàng hơn (tối đa 10 keywords)
                </p>
              )}
            </div>
            {/* Action Buttons giữ nguyên ... */}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Tải lên video
              </Button>
              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
