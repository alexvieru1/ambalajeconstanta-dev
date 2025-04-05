"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { createUrl } from "@/lib/utils";

export const SearchNavbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/search", newParams));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="relative w-full">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <IconSearch size={18} />
        </span>
        <Input
          key={searchParams?.get("q")}
          type="text"
          name="search"
          placeholder="Căutați un produs..."
          autoComplete="off"
          defaultValue={searchParams?.get("q") || ""}
          className="pr-10"
        />
      </div>
    </form>
  );
};

export const SearchSkeleton = () => {
  return (
    <div className="relative w-full max-w-sm">
      <Skeleton className="h-10 w-full rounded-md pr-10" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
        <IconSearch size={18} />
      </span>
    </div>
  );
};
