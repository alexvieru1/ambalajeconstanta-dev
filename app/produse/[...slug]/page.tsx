import { getProducts } from "@/lib/shopify";
import { defaultSort, sorting } from "@/lib/constants";
import React from "react";

type PageProps = {
  params: { slug?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const awaitedParams = await params;

  const { sort } = (awaitedSearchParams ?? {}) as { [key: string]: string };
  const { slug = [] } = awaitedParams;

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const handle = slug[slug.length - 1] || "";

  const query = handle ? `collection:${handle}` : undefined;

  const products = await getProducts({ sortKey, reverse, query });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {handle ? `Colecția: ${handle}` : "Toate Produsele"}
      </h1>

      {products.length === 0 ? (
        <p>Nu am găsit produse în această categorie.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-md shadow-sm">
              <p className="font-medium">{product.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
