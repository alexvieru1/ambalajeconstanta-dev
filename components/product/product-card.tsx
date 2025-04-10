"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
  href?: string; // ✅ optional href
};

export const ProductCard = ({ product, href }: ProductCardProps) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    console.log(
      `Adding to cart: Product ID ${product.id}, Variant ID ${selectedVariantId}, Quantity ${quantity}`
    );
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

  const cleanProductId = product.id.split("/").pop();
  const hasMultipleVariants = product.variants.length > 1;
  const isAvailable = product.variants.some(
    (variant) => variant.availableForSale
  );

  return (
    <Card className="relative flex flex-col items-center p-4 shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="relative w-full h-48 mb-4">
        {product.images[0] && (
          <>
            {href ? (
              <Link
                href={href}
                aria-label={`Vezi detalii pentru ${product.title}`}
                className="absolute inset-0 z-10"
              >
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
            ) : (
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText || product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
          </>
        )}
      </div>

      {/* Content */}
      <CardContent className="w-full text-center space-y-2 z-10">
        <h3 className="text-sm font-medium">{product.title}</h3>

        <p className="text-xs text-gray-500">Cod produs: {cleanProductId}</p>

        <p className="text-sm text-green-600 font-semibold">
          {hasMultipleVariants
            ? `De la ${product.priceRange.minVariantPrice.amount} RON`
            : `Preț: ${product.variants[0]?.price.amount} RON`}
        </p>

        {/* Variant Selector */}
        {hasMultipleVariants && (
          <div className="flex justify-center items-center">
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
        <div className="flex items-center justify-center space-x-1 mt-2">
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
            className="w-14 text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            className="w-1/2 bg-green-600 mt-2"
            onClick={handleAddToCart}
          >
            <IconShoppingCartPlus className="w-4 h-4 mr-2" />
          </Button>
        ) : (
          <Button
            type="button"
            className="w-1/2 bg-gray-400 mt-2 cursor-not-allowed"
            disabled
          >
            Stoc epuizat
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
