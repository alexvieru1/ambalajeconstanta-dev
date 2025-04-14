"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify/types";
import { CategoryBreadcrumb } from "@/components/category-breadcrumb";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IconShoppingCartPlus, IconZoomIn } from "@tabler/icons-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductPage = ({
  product,
  slugArray,
  searchQuery,
}: {
  product: Product;
  slugArray: string[];
  searchQuery?: string;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [showZoom, setShowZoom] = useState<boolean>(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );

  const getMetafield = (product: Product, namespace: string, key: string) => {
    return product.metafields?.find(
      (field) => field.namespace === namespace && field.key === key
    )?.value;
  };

  const unit = getMetafield(product, "custom", "unitate_masura");

  const hasMultipleVariants = product.variants.length > 1;
  const isAvailable = product.variants.some(
    (variant) => variant.availableForSale
  );

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId
  );

  const handleAddToCart = () => {
    toast.success(
      <div>
        <span style={{ color: "#166534", fontWeight: "600" }}>
          {product.title}
        </span>
        <div style={{ color: "#15803d", fontWeight: "500" }}>
          {quantity} produs(e) adăugat(e) în coș!
        </div>
      </div>,
      {
        style: { color: "#166534" },
        duration: 4000,
        position: "bottom-right",
      }
    );
  };

  console.log(product)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 min-h-[80vh] flex flex-col">
      <CategoryBreadcrumb slugArray={slugArray} searchQuery={searchQuery} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images or Carousel */}
        <div className="relative w-full">
          {product.images.length > 1 ? (
            <Carousel>
              <CarouselContent>
                {product.images.map((image) => (
                  <CarouselItem key={image.url} className="relative h-96">
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            product.images[0] && (
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )
          )}

          {/* Zoom Button */}
          {product.images[0] && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowZoom(true)}
            >
              <IconZoomIn className="w-4 h-4 mr-2" />
              Zoom imagine
            </Button>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>

          <p className="text-gray-600 text-sm">
            Cod produs: {product.id.split("/").pop()}
          </p>

          {unit && (
            <p className="text-sm text-gray-500">Unitate de măsură: {unit}</p>
          )}

          <p className="text-[#44b74a] font-semibold">
            {hasMultipleVariants
              ? `De la ${product.priceRange.minVariantPrice.amount} RON`
              : `${product.variants[0]?.price.amount} RON`}
          </p>

          {/* Variant Selector */}
          {hasMultipleVariants && (
            <div className="flex flex-col">
              <Select
                defaultValue={product.variants[0]?.id}
                onValueChange={(value) => setSelectedVariantId(value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selectează o variantă" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.title} — {variant.price.amount} RON
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={!isAvailable}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              disabled={!isAvailable}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center"
              min={1}
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={!isAvailable}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>

          {/* Add to Cart */}
          {isAvailable ? (
            <Button
              type="button"
              className="bg-green-600 w-full md:w-1/2"
              onClick={handleAddToCart}
            >
              <IconShoppingCartPlus className="w-4 h-4 mr-2" />
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-gray-400 w-full md:w-1/2 cursor-not-allowed"
              disabled
            >
              Stoc epuizat
            </Button>
          )}

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t">
              <h2 className="text-sm font-semibold mb-2 text-gray-700">
                Descriere
              </h2>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for zoom */}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg max-w-4xl w-full p-4 mx-4">
            {product.images.length > 1 ? (
              <Carousel>
                <CarouselContent>
                  {product.images.map((image) => (
                    <CarouselItem
                      key={image.url}
                      className="flex items-center justify-center"
                    >
                      <div className="relative w-full h-[60vh]">
                        <Image
                          src={image.url}
                          alt={image.altText || product.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="relative w-full h-[60vh] flex items-center justify-center">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            <Button
              type="button"
              size="sm"
              className="absolute top-4 right-4 bg-white text-black hover:bg-gray-500"
              onClick={() => setShowZoom(false)}
            >
              X
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
