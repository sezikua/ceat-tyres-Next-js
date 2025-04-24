"use client"

import { useState } from "react"
import type { Product } from "@/types/product"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { getUniqueTireSizes, getTireSize } from "@/lib/woocommerce"

interface ProductFiltersProps {
  products: Product[]
  onFilter: (filteredProducts: Product[]) => void
}

export function ProductFilters({ products, onFilter }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique categories and brands
  const categories = Array.from(
    new Set(products.flatMap((product) => product.categories?.map((cat) => cat.name) || [])),
  ).sort()

  const sizes = getUniqueTireSizes(products)

  const handleFilter = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.categories?.some((cat) => cat.name === selectedCategory))
    }

    if (selectedSize) {
      filtered = filtered.filter((product) => {
        const tireSize = getTireSize(product)
        return tireSize === selectedSize
      })
    }

    onFilter(filtered)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedSize("")
    onFilter(products)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Пошук за назвою або артикулом..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Фільтри
        </Button>

        <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4 w-full md:w-auto`}>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Категорія" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі категорії</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Розмір шини" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі розміри</SelectItem>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700">
              Застосувати
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Скинути
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
