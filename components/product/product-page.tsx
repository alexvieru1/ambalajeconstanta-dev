"use client";

import { useEffect, useMemo, useState } from "react";
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

type QuantityBreaks = Record<number, number>;

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

  const getMetafield = (
    product: Product,
    namespace: string,
    key: string
  ): string | undefined => {
    if (!Array.isArray(product.metafields)) return undefined;

    const field = product.metafields.find(
      (field) =>
        field &&
        "namespace" in field &&
        "key" in field &&
        field.namespace === namespace &&
        field.key === key
    );

    return field?.value;
  };

  const unit = getMetafield(product, "custom", "unitate_masura");

  const hasMultipleVariants = product.variants.length > 1;
  const isAvailable = product.variants.some(
    (variant) => variant.availableForSale
  );

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId
  );

  // ✅ Quantity Breaks (safe parsing)
  const quantityBreaks = useMemo<QuantityBreaks | null>(() => {
    try {
      const metafieldsArray = selectedVariant?.metafields as
        | { namespace: string; key: string; value: string }[]
        | undefined;

      const metafield = metafieldsArray?.find(
        (field) => field.key === "quantity_breaks"
      );

      return metafield?.value
        ? (JSON.parse(metafield.value) as QuantityBreaks)
        : null;
    } catch {
      return null;
    }
  }, [selectedVariant]);

  const dynamicPrice = useMemo(() => {
    if (!quantityBreaks) return selectedVariant?.price.amount;

    const sortedQuantities = Object.keys(quantityBreaks)
      .map(Number)
      .sort((a, b) => b - a);

    const applicableQuantity = sortedQuantities.find((qty) => quantity >= qty);

    return applicableQuantity
      ? quantityBreaks[applicableQuantity]
      : selectedVariant?.price.amount;
  }, [quantity, quantityBreaks, selectedVariant]);

  const handleAddToCart = () => {
    toast.success(
      <div>
        <span style={{ color: "#166534", fontWeight: "600" }}>
          {product.title}
        </span>
        <div style={{ color: "#15803d", fontWeight: "500" }}>
          {quantity} x {dynamicPrice} RON adăugat(e) în coș!
        </div>
      </div>,
      {
        style: { color: "#166534" },
        duration: 4000,
        position: "bottom-right",
      }
    );
  };

  // ✅ Disable scroll when modal open
  useEffect(() => {
    if (showZoom) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showZoom]);

  const renderCarousel = (images: Product["images"]) => (
    <Carousel className="w-full">
      <CarouselContent className="h-96">
        {images.map((image) => (
          <CarouselItem key={image.url} className="relative h-full">
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

      {/* Arrows below image */}
      <div className="flex justify-center space-x-4 mt-4">
        <CarouselPrevious className="relative translate-y-0" />
        <CarouselNext className="relative translate-y-0" />
      </div>
    </Carousel>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 min-h-[80vh] flex flex-col">
      <CategoryBreadcrumb slugArray={slugArray} searchQuery={searchQuery} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images or Carousel */}
        <div className="relative w-full max-w-full md:max-w-[500px]">
          {product.images.length > 1
            ? renderCarousel(product.images)
            : product.images[0] && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altText || product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}

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

          <p className="text-[#44b74a] font-semibold">{dynamicPrice} RON</p>

          {quantityBreaks && (
            <div className="text-sm text-gray-500 space-y-1">
              <p className="font-medium">Discount cantitate:</p>
              <ul>
                {Object.entries(quantityBreaks)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([qty, price]) => (
                    <li key={qty}>
                      {qty} buc: {price} RON
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Variant Selector */}
          {hasMultipleVariants && (
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
              className="w-16 text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
          <Button
            type="button"
            className={`w-full md:w-1/2 ${
              isAvailable ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            <IconShoppingCartPlus className="w-4 h-4 mr-2" />
            {isAvailable ? "" : "Stoc epuizat"}
          </Button>

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
              renderCarousel(product.images)
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
