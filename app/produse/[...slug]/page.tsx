import { getProducts } from "@/lib/shopify";
import { defaultSort, sorting } from "@/lib/constants";
import React from "react";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // Build the collection handle from params
  const slugArray = params.slug || [];
  const handle = slugArray[slugArray.length - 1] || ""; // Get the last part of the slug

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
