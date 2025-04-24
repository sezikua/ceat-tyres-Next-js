"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { fetchAllTyreSizes } from "@/lib/fetchTyreSizes"
import { getTireSize } from "@/lib/woocommerce"

interface ProductFiltersProps {
  products: Product[]
  onFilter: (filteredProducts: Product[]) => void
  initialSize?: string
}

export function ProductFilters({ products, onFilter, initialSize = "" }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSize, setSelectedSize] = useState(initialSize)
  const [showFilters, setShowFilters] = useState(false)
  const [sizes, setSizes] = useState<string[]>([])
  const [loadingSizes, setLoadingSizes] = useState(true)

  // Extract unique categories
  const categories = Array.from(
    new Set(products.flatMap((product) => product.categories?.map((cat) => cat.name) || [])),
  ).sort()

  // Fetch all tire sizes
  useEffect(() => {
    async function loadSizes() {
      try {
        setLoadingSizes(true)
        const allSizes = await fetchAllTyreSizes()
        setSizes(allSizes)
      } catch (error) {
        console.error("Error loading tire sizes:", error)
      } finally {
        setLoadingSizes(false)
      }
    }

    loadSizes()
  }, [])

  // Apply initial size filter if provided
  useEffect(() => {
    if (initialSize && products.length > 0) {
      setSelectedSize(initialSize)
      handleFilter()
    }
  }, [initialSize, products])

  const handleFilter = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.categories?.some((cat) => cat.name === selectedCategory))
    }

    if (selectedSize && selectedSize !== "all") {
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
    <div className="mb-8 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 items-end w-full">
        <div className="flex-1 w-full">
          <div className="relative w-full">
            <Input
              placeholder="Пошук за назвою або артикулом..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden w-full">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Фільтри
        </Button>

        <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4 w-full`}>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
              {loadingSizes ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Завантаження...</span>
                </div>
              ) : (
                <SelectValue placeholder="Розмір шини" />
              )}
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Всі розміри</SelectItem>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none">
              Застосувати
            </Button>
            <Button variant="outline" onClick={resetFilters} className="flex-1 md:flex-none">
              Скинути
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
