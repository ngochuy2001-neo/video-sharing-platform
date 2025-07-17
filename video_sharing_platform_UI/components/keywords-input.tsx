"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Tag, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/utils/axios";

interface Keyword {
  id: number;
  name: string;
}

interface KeywordsInputProps {
  keywordIds: number[];
  onChange: (keywordIds: number[]) => void;
  maxKeywords?: number;
  error?: string;
}

export function KeywordsInput({
  keywordIds,
  onChange,
  maxKeywords = 10,
  error,
}: KeywordsInputProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [availableKeywords, setAvailableKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/api/media/keywords/")
      .then((res) => setAvailableKeywords(res.data))
      .catch((err) => console.error("Lỗi fetch keywords:", err))
      .finally(() => setLoading(false));
  }, []);

  const removeKeyword = (id: number) => {
    onChange(keywordIds.filter((kid) => kid !== id));
  };

  const toggleKeyword = (id: number) => {
    if (keywordIds.includes(id)) {
      removeKeyword(id);
    } else if (keywordIds.length < maxKeywords) {
      onChange([...keywordIds, id]);
    }
  };

  const getKeywordLabel = (id: number) => {
    return availableKeywords.find((k) => k.id === id)?.name || id;
  };

  const filteredKeywords = availableKeywords.filter(
    (keyword) =>
      keyword.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Selected Keywords Display */}
      {keywordIds.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
          {keywordIds.map((kid) => (
            <Badge
              key={kid}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <Tag className="h-3 w-3" />
              {getKeywordLabel(kid)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeKeyword(kid)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Keywords Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-destructive"
            )}
            disabled={keywordIds.length >= maxKeywords}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {keywordIds.length === 0
                ? "Chọn keywords cho video..."
                : `Đã chọn ${keywordIds.length} keyword${
                    keywordIds.length > 1 ? "s" : ""
                  }`}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Tìm kiếm keywords..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                {loading ? "Đang tải..." : "Không tìm thấy keyword nào."}
              </CommandEmpty>
              <CommandGroup heading="Tất cả keywords">
                {filteredKeywords.map((keyword) => {
                  const isSelected = keywordIds.includes(keyword.id);
                  const isDisabled = !isSelected && keywordIds.length >= maxKeywords;
                  return (
                    <CommandItem
                      key={keyword.id}
                      value={String(keyword.id)}
                      onSelect={() => !isDisabled && toggleKeyword(keyword.id)}
                      className={cn(
                        "flex items-center space-x-2 cursor-pointer",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isDisabled}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => !isDisabled && toggleKeyword(keyword.id)}
                        disabled={isDisabled}
                      />
                      <div className="flex-1">
                        <span className="font-medium">{keyword.name}</span>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs">
                          Đã chọn
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Select Popular Keywords */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Keywords phổ biến:</p>
        <div className="flex flex-wrap gap-2">
          {availableKeywords.slice(0, 8).map((keyword) => {
            const isSelected = keywordIds.includes(keyword.id);
            const isDisabled = !isSelected && keywordIds.length >= maxKeywords;
            return (
              <Button
                key={keyword.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => !isDisabled && toggleKeyword(keyword.id)}
                disabled={isDisabled}
              >
                {isSelected && <X className="h-3 w-3 mr-1" />}
                {keyword.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Counter and Info */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Chọn keywords phù hợp để video được tìm thấy dễ dàng hơn</span>
        <span
          className={keywordIds.length >= maxKeywords ? "text-destructive" : ""}
        >
          {keywordIds.length}/{maxKeywords}
        </span>
      </div>
    </div>
  );
}
