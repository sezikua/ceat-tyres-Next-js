"use client"

import { useState, useEffect, useRef } from "react"
import type { Product } from "@/types/product"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, Loader2, ChevronDown } from "lucide-react"
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
  const [filteredSizes, setFilteredSizes] = useState<string[]>([])
  const [loadingSizes, setLoadingSizes] = useState(true)
  const [sizeSearchTerm, setSizeSearchTerm] = useState("")
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false)
  const sizeDropdownRef = useRef<HTMLDivElement>(null)

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
        setFilteredSizes(allSizes)
      } catch (error) {
        console.error("Error loading tire sizes:", error)
      } finally {
        setLoadingSizes(false)
      }
    }

    loadSizes()
  }, [])

  // Filter sizes based on search term
  useEffect(() => {
    if (sizeSearchTerm) {
      const filtered = sizes.filter((size) => size.toLowerCase().includes(sizeSearchTerm.toLowerCase()))
      setFilteredSizes(filtered)
    } else {
      setFilteredSizes(sizes)
    }
  }, [sizeSearchTerm, sizes])

  // Apply initial size filter if provided
  useEffect(() => {
    if (initialSize && products.length > 0) {
      setSelectedSize(initialSize)
      handleFilter()
    }
  }, [initialSize, products])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setIsSizeDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
    setSizeSearchTerm("")
    onFilter(products)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setIsSizeDropdownOpen(false)
    // Не викликаємо handleFilter тут, щоб уникнути подвійної фільтрації
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
          {/* Категорії */}
          <div className="relative w-full md:w-auto md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі категорії</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Розміри шин з пошуком */}
          <div className="relative w-full md:w-auto md:flex-1" ref={sizeDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Розмір шини</label>
            <div
              className="w-full p-2 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer"
              onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
            >
              <span className={selectedSize ? "text-black" : "text-gray-500"}>
                {selectedSize || "Оберіть розмір шини"}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${isSizeDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isSizeDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Пошук розміру..."
                      value={sizeSearchTerm}
                      onChange={(e) => setSizeSearchTerm(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {loadingSizes ? (
                    <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Завантаження розмірів...
                    </div>
                  ) : filteredSizes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Розміри не знайдено</div>
                  ) : (
                    <>
                      <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => handleSizeSelect("all")}>
                        Всі розміри
                      </div>
                      {filteredSizes.map((size, index) => (
                        <div
                          key={index}
                          className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedSize === size ? "bg-blue-50 font-medium" : ""}`}
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto md:self-end">
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
