"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

type CategoryBreadcrumbProps = {
  slugArray: string[];
};

// Capitalize utility
const capitalizeWords = (str: string) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function CategoryBreadcrumb({ slugArray }: CategoryBreadcrumbProps) {
  const buildHref = (index: number) => {
    const segments = slugArray.slice(0, index + 1);
    return `/produse/${segments.join("/")}`;
  };

  return (
    <Breadcrumb className="mb-4 text-sm text-muted-foreground list-none flex items-center flex-wrap space-x-1">
      <BreadcrumbItem className="list-none flex items-center">
        <BreadcrumbLink asChild>
          <Link href="/produse" className="hover:text-green-600 transition-colors">
            Produse
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {slugArray.map((slug, index) => (
        <React.Fragment key={slug}>
          <BreadcrumbSeparator className="mx-1 inline-flex"/>
          <BreadcrumbItem className="list-none flex items-center">
            <BreadcrumbLink asChild>
              <Link href={buildHref(index)} className="hover:text-green-600 transition-colors">
                {capitalizeWords(decodeURIComponent(slug))}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}
