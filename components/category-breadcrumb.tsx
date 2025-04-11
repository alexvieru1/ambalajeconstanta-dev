"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

type CategoryBreadcrumbProps = {
  slugArray: string[];
  searchQuery?: string;
};

// Capitalize utility
const capitalizeWords = (str: string) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function CategoryBreadcrumb({
  slugArray,
  searchQuery,
}: CategoryBreadcrumbProps) {
  const isSearch = slugArray[0] === "search";

  const buildHref = (index: number) => {
    if (isSearch) {
      // Always return search with query for search mode
      return `/search?q=${encodeURIComponent(searchQuery || "")}`;
    } else {
      const segments = slugArray.slice(0, index + 1);
      return `/produse/${segments.join("/")}`;
    }
  };

  return (
    <Breadcrumb className="mb-4 text-sm text-muted-foreground list-none flex items-center flex-wrap space-x-1">
      <BreadcrumbItem className="list-none flex items-center">
        <BreadcrumbLink asChild>
          <Link
            href={
              isSearch
                ? `/search?q=${encodeURIComponent(searchQuery || "")}`
                : "/produse"
            }
            className="hover:text-green-600 transition-colors"
          >
            {isSearch ? "Căutare" : "Produse"}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {slugArray.slice(1).map((slug, index) => (
        <React.Fragment key={slug}>
          <BreadcrumbSeparator className="mx-1 inline-flex" />
          <BreadcrumbItem className="list-none flex items-center">
            <BreadcrumbLink asChild>
              <Link
                href={buildHref(index + 1)} // shift index because we slice(1)
                className="hover:text-green-600 transition-colors capitalize"
              >
                {capitalizeWords(decodeURIComponent(slug))}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}
