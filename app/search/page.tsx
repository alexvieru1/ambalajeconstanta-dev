import { defaultSort, sorting } from "@/lib/constants";
import { getProducts, getProduseMenu } from "@/lib/shopify";
import React from "react";
import { ProductCard } from "@/components/product/product-card";
import { normalizeString } from "@/lib/utils";

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { searchParams } = props;

  const awaitedSearchParams = await searchParams;
  const sort =
    typeof awaitedSearchParams?.sort === "string"
      ? awaitedSearchParams.sort
      : undefined;
  const searchValue =
    typeof awaitedSearchParams?.q === "string"
      ? awaitedSearchParams.q
      : undefined;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  let products = await getProducts({
    sortKey,
    reverse,
    query: "availableForSale:true",
  });

  // ✅ Normalize search term and products for diacritics-free matching
  if (searchValue) {
    const normalizedSearch = normalizeString(searchValue);

    products = products.filter((product) => {
      const normalizedTitle = normalizeString(product.title);
      return normalizedTitle.includes(normalizedSearch);
    });
  }

  // ✅ Fetch menu for paths (optional but you already have it)
  const menu = await getProduseMenu();

  const resultsText = products.length === 1 ? "rezultat" : "rezultate";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Search header */}
      {searchValue && (
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">
            Rezultate căutare pentru: “{searchValue}”
          </h1>
          {products.length === 0 ? (
            <p className="text-muted-foreground">Nu au fost găsite produse.</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {products.length} {resultsText} găsite
            </p>
          )}
        </div>
      )}

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => {
            // ✅ Build product link WITH query param
            const productLink = `/produse/${product.handle}?from=search&q=${encodeURIComponent(searchValue || "")}`;

            return (
              <ProductCard
                key={product.id}
                product={product}
                href={productLink}
              />
            );
          })}
        </div>
      ) : (
        searchValue && (
          <p className="text-sm text-muted-foreground">
            Încercați alte cuvinte cheie sau verificați ortografia.
          </p>
        )
      )}
    </div>
  );
}
