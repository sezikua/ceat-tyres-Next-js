"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAllTyreSizes } from "@/lib/fetchTyreSizes"

interface TireSizeSearchProps {
  onSelect?: () => void
}

export function TireSizeSearch({ onSelect }: TireSizeSearchProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [allSizes, setAllSizes] = useState<string[]>([])
  const [filteredSizes, setFilteredSizes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Завантаження всіх розмірів шин
  useEffect(() => {
    async function loadSizes() {
      try {
        setLoading(true)
        const sizes = await fetchAllTyreSizes()
        console.log("Завантажені розміри шин:", sizes)
        setAllSizes(sizes)
      } catch (error) {
        console.error("Error loading tire sizes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSizes()
  }, [])

  // Закриття випадаючого списку при кліку поза ним
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Фільтрація розмірів на основі пошукового запиту
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSizes([])
      return
    }

    const searchTermLower = searchTerm.toLowerCase()

    const filtered = allSizes.filter((size) => {
      const sizeLower = size.toLowerCase()

      // Перевіряємо різні варіанти написання
      return (
        sizeLower.includes(searchTermLower) ||
        sizeLower.replace(/\//g, "-").includes(searchTermLower.replace(/\//g, "-")) ||
        sizeLower.replace(/-/g, "/").includes(searchTermLower.replace(/-/g, "/")) ||
        sizeLower.replace(/\s+/g, "").includes(searchTermLower.replace(/\s+/g, ""))
      )
    })

    setFilteredSizes(filtered.slice(0, 10)) // Обмежуємо кількість результатів
  }, [searchTerm, allSizes])

  // Обробка вибору розміру
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSearchTerm(size)
    setIsOpen(false)

    // Використовуємо sizeToSlug для правильного форматування URL
    router.push(`/shop?size=${encodeURIComponent(size)}`)

    // Викликаємо onSelect, якщо він переданий
    if (onSelect) onSelect()
  }

  // Обробка відправки форми пошуку
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchTerm.trim() === "") return

    // Якщо є точне співпадіння, використовуємо його
    const exactMatch = allSizes.find((size) => size.toLowerCase() === searchTerm.toLowerCase())

    if (exactMatch) {
      handleSizeSelect(exactMatch)
      return
    }

    // Якщо є хоча б часткові співпадіння, використовуємо перше
    if (filteredSizes.length > 0) {
      handleSizeSelect(filteredSizes[0])
      return
    }

    // Якщо нічого не знайдено, просто переходимо на сторінку магазину з пошуковим запитом
    router.push(`/shop?size=${encodeURIComponent(searchTerm)}`)

    // Викликаємо onSelect, якщо він переданий
    if (onSelect) onSelect()
  }

  return (
    <div ref={searchRef} className="w-full relative">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Введіть розмір шини (напр. 710/70R42)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onClick={() => setIsOpen(true)}
          className="pl-10 pr-12 py-2 bg-white border-gray-300 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:bg-gray-100"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <AnimatePresence>
        {isOpen && (searchTerm.trim() !== "" || loading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-xl max-h-80 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Завантаження розмірів...
              </div>
            ) : filteredSizes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm.trim() === "" ? "Введіть розмір шини" : "Розміри не знайдено"}
              </div>
            ) : (
              filteredSizes.map((size, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
