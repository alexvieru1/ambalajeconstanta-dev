import {
  getCollectionProducts,
  getProduseMenu,
  getProductByHandle,
} from "@/lib/shopify";
import { defaultSort, sorting } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { CategoryBreadcrumb } from "@/components/category-breadcrumb";
import { ProductCard } from "@/components/product/product-card";
import { Menu } from "@/lib/shopify/types";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product/product-page";

export default async function CollectionOrProductPage(props: {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { params, searchParams } = await props;

  const awaitedParams = await params;
  const slugArray = awaitedParams.slug || [];

  const searchQuery = (await searchParams)?.q as string | undefined;
  const fromSearch = (await searchParams)?.from === "search";

  const search = await searchParams;
  const sort = typeof search?.sort === "string" ? search.sort : undefined;
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const handle = slugArray[slugArray.length - 1] || "";

  // 🧩 Step 1: Try to fetch product by handle (last slug)
  const productData = await getProductByHandle(handle);
  if (productData) {
    return (
      <ProductPage
        product={productData}
        slugArray={fromSearch ? ["search"] : slugArray}
        searchQuery={fromSearch ? searchQuery : undefined} // ✅ Important!
      />
    );
  }

  // 🧩 Step 2: No product found, try category view
  const menu = await getProduseMenu();

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

  if (currentMenu?.children && currentMenu.children.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 min-h-[80vh] flex flex-col">
        <CategoryBreadcrumb
          slugArray={fromSearch ? ["search"] : slugArray}
          searchQuery={fromSearch ? searchQuery : undefined}
        />
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

  // 🧩 Step 3: No children, show products in collection
  const products = await getCollectionProducts({
    collection: handle,
    sortKey,
    reverse,
  });

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 min-h-[80vh] flex flex-col">
        <CategoryBreadcrumb
          slugArray={fromSearch ? ["search"] : slugArray}
          searchQuery={fromSearch ? searchQuery : undefined}
        />
        <p>Nu am găsit produse în această categorie.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 min-h-[80vh] flex flex-col">
      <CategoryBreadcrumb
        slugArray={fromSearch ? ["search"] : slugArray}
        searchQuery={fromSearch ? searchQuery : undefined}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {products.map((product) => {
          const productSlug = product.handle;
          const productLink = `/produse/${slugArray.join("/")}/${productSlug}`;
          return (
            <ProductCard
              key={product.id}
              product={product}
              href={productLink}
            />
          );
        })}
      </div>
    </div>
  );
}
