import { Product } from "@/lib/shopify/types";
import { CategoryBreadcrumb } from "@/components/category-breadcrumb";
import Image from "next/image";

export const ProductPage = ({
    product,
    slugArray,
    searchQuery, // ✅ Add this
  }: {
    product: Product;
    slugArray: string[];
    searchQuery?: string; // ✅ Optional
  }) => {
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 min-h-[80vh] flex flex-col">
      <CategoryBreadcrumb slugArray={slugArray} searchQuery={searchQuery} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.images[0].altText || product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600 text-sm">
            Cod produs: {product.id.split("/").pop()}
          </p>
          <p className="text-green-600 font-semibold">
            {product.variants.length > 1
              ? `De la ${product.priceRange.minVariantPrice.amount} RON`
              : `${product.variants[0]?.price.amount} RON`}
          </p>
          {/* 👇 Later, here you can add: quantity selector, add to cart, description etc. */}
        </div>
      </div>
    </div>
  );
};
