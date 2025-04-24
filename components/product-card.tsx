"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"
import { formatPrice, getTireSize, getBrand } from "@/lib/woocommerce"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : "/worn-tire-close-up.png"

  const tireSize = getTireSize(product)
  const brand = getBrand(product)
  const isInStock = product.stock_status === "instock"

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.id}`} className="relative h-64 overflow-hidden bg-gray-100 block">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className={`object-contain p-4 transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        {!isInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Немає в наявності</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-600 text-white">{brand}</Badge>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link
            href={`/shop/${product.id}`}
            className="font-bold text-lg line-clamp-2 flex-1 hover:text-blue-600 transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          <p>Артикул: {product.sku}</p>
          <p>Розмір: {tireSize}</p>
          {product.categories && product.categories.length > 0 && <p>Категорія: {product.categories[0].name}</p>}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="text-xl font-bold text-blue-700">{formatPrice(product.price)}</div>
          <div className="flex space-x-2">
            <Link href={`/shop/${product.id}`}>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">
                <Eye className="h-4 w-4 mr-1" />
                Деталі
              </Button>
            </Link>
            <Button
              disabled={!isInStock}
              className="rounded-full bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Купити
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
