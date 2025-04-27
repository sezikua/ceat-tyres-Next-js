"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingCart, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAllTyreSizes } from "@/lib/fetchTyreSizes"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-[#203F99] shadow-sm">
      <div className="container flex flex-col items-center justify-between h-auto px-4 md:px-6">
        <div className="w-full flex items-center justify-between h-20">
          <Link href="/" className="flex items-center relative z-50">
            <Image src="/images/ceat-logo.svg" alt="CEAT Logo" width={150} height={50} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Головна", path: "/" },
              { name: "Магазин", path: "/shop" },
              { name: "Для кого", path: "/for-whom" },
              { name: "Про нас", path: "/about" },
              { name: "Контакти", path: "/contacts" },
            ].map((item, index) => (
              <Link key={index} href={item.path} className="text-base font-medium relative group text-white">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-white">🇺🇦 UA</span>
            </div>

            <Link href="/shop" className="hidden md:flex text-white hover:text-orange-200 mr-2">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            <Button className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
              Замовити консультацію
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Пошук шин по розміру */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 flex items-center gap-2 mb-4"
          onClick={() => setSearchModalOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>Пошук шин за розміром</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container py-4 px-4 space-y-4">
              {[
                { name: "Головна", path: "/" },
                { name: "Магазин", path: "/shop" },
                { name: "Для кого", path: "/for-whom" },
                { name: "Про нас", path: "/about" },
                { name: "Контакти", path: "/contacts" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="block py-2 text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchModalOpen(true)
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Пошук шин за розміром
              </Button>
              <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                Замовити консультацію
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальне вікно пошуку шин */}
      <AnimatePresence>
        {searchModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSearchModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-0 right-0 mx-auto z-50 bg-white rounded-lg shadow-xl p-6 max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Пошук шин за розміром</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <TireSizeSearch onSelect={() => setSearchModalOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

function TireSizeSearch({ onSelect }: { onSelect?: () => void }) {
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
