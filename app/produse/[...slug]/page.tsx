import { getCollectionProducts, getProduseMenu } from "@/lib/shopify";
import { defaultSort, sorting } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Menu } from "@/lib/shopify/types";
import { CategoryBreadcrumb } from "@/components/category-breadcrumb";

export default async function CollectionPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { params, searchParams } = await props;

  const awaitedParams = await params;
  const slugArray = awaitedParams.slug || [];
  const handle = slugArray[slugArray.length - 1] || "";

  const search = await searchParams;
  const sort = typeof search?.sort === "string" ? search.sort : undefined;
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // ✅ Step 1: Fetch menu
  const menu = await getProduseMenu();

  // ✅ Step 2: Find current menu item recursively
  const findCurrentMenu = (items: Menu[], slugParts: string[]): Menu | null => {
    if (slugParts.length === 0) return null;

    const [current, ...rest] = slugParts;
    const matched = items.find((item) => item.path.endsWith(current));

    if (!matched) return null;

    if (rest.length > 0 && matched.children?.length) {
      return findCurrentMenu(matched.children, rest);
    }

    return matched;
  };

  const currentMenu = findCurrentMenu(menu, slugArray);

  // ✅ Step 3: If current menu has children, show categories
  if (currentMenu?.children && currentMenu.children.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <CategoryBreadcrumb slugArray={slugArray} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {currentMenu.children.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="group block border rounded-md overflow-hidden hover:shadow-lg transition"
            >
              {item.image?.url ? (
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Imagine categorie
                </div>
              )}

              <div className="p-3 text-center">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Step 4: Fallback to product grid (your original working logic)
  const products = await getCollectionProducts({
    collection: handle,
    sortKey,
    reverse,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {products.length === 0 ? (
        <div>
          <CategoryBreadcrumb slugArray={slugArray} />
          <p>Nu am găsit produse în această categorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-md shadow-sm hover:shadow-md transition"
            >
              <CategoryBreadcrumb slugArray={slugArray} />
              <p className="font-medium">{product.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
