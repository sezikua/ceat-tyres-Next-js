"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAllTyreSizes } from "@/lib/fetchTyreSizes"

export function TyreSizeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSize = searchParams.get("size") || ""

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSize, setSelectedSize] = useState(currentSize)
  const [allSizes, setAllSizes] = useState<string[]>([])
  const [filteredSizes, setFilteredSizes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all tire sizes
  useEffect(() => {
    async function loadSizes() {
      try {
        setLoading(true)
        const sizes = await fetchAllTyreSizes()
        setAllSizes(sizes)
        setFilteredSizes(sizes)
      } catch (error) {
        console.error("Error loading tire sizes:", error)
        setError("Не вдалося завантажити розміри шин")
      } finally {
        setLoading(false)
      }
    }

    loadSizes()
  }, [])

  // Update selected size when URL changes
  useEffect(() => {
    setSelectedSize(currentSize)
  }, [currentSize])

  // Filter sizes based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = allSizes.filter((size) => size.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredSizes(filtered)
    } else {
      setFilteredSizes(allSizes)
    }
  }, [searchTerm, allSizes])

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setIsOpen(false)
    router.push(`/?size=${encodeURIComponent(size)}`)
  }

  // Handle search button click
  const handleSearch = () => {
    if (selectedSize) {
      router.push(`/?size=${encodeURIComponent(selectedSize)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Пошук шин по розміру</h2>

          <div className="relative mb-6">
            <div
              className="border border-gray-300 rounded-lg p-4 flex items-center justify-between cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`${!selectedSize ? "text-gray-500" : "text-black"}`}>
                {selectedSize || "Оберіть розмір шини"}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Введіть розмір для пошуку..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Завантаження розмірів...
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                  ) : filteredSizes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Розміри не знайдено</div>
                  ) : (
                    filteredSizes.map((size, index) => (
                      <div
                        key={index}
                        className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedSize === size ? "bg-blue-50 font-medium" : ""}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Знайти шини
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
