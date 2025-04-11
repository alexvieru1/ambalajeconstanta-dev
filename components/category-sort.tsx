"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sorting } from "@/lib/constants";

type CategorySortProps = {
  currentSort?: string;
};

export const CategorySort = ({ currentSort }: CategorySortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (selectedSort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedSort === "relevanta") {
      params.delete("sort"); // ✅ clean URL if it's the default
    } else {
      params.set("sort", selectedSort);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sortează" />
      </SelectTrigger>
      <SelectContent>
        {sorting.map((option) => (
          <SelectItem
            key={option.slug ?? "relevanta"}
            value={option.slug ?? "relevanta"} // ✅ safe string, not empty
          >
            {option.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
