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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetchAllTyreSizes } from "@/lib/fetchTyreSizes"
import { normalizeTireSize } from "@/lib/woocommerce"

// Замінюємо функцію Header
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-[#203F99]/95 backdrop-blur-sm shadow-md" : "bg-[#203F99]"}`}
      >
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
                { name: "Блог", path: "/blog" },
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
              <Button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-4 py-2 rounded-full"
              >
                <Search className="h-4 w-4" />
                <span>Пошук шин за розміром</span>
              </Button>

              <div className="flex items-center ml-4">
                <span className="text-sm font-medium text-white">🇺🇦 UA</span>
              </div>

              <Link href="/shop" className="hidden md:flex text-white hover:text-orange-200 mr-2">
                <ShoppingCart className="h-6 w-6" />
              </Link>

              <a href="tel:+380504249510">
                <Button className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
                  Замовити консультацію
                </Button>
              </a>

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
                <div className="mb-4">
                  <Button
                    onClick={() => {
                      setSearchModalOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Пошук шин за розміром</span>
                  </Button>
                </div>
                {[
                  { name: "Головна", path: "/" },
                  { name: "Магазин", path: "/shop" },
                  { name: "Блог", path: "/blog" },
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
                <a href="tel:+380504249510">
                  <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                    Замовити консультацію
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Модальне вікно пошуку шин */}
      <TireSizeSearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </>
  )
}

// Замінюємо функцію TireSizeSearch на TireSizeSearchModal
function TireSizeSearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [allSizes, setAllSizes] = useState<string[]>([])
  const [filteredSizes, setFilteredSizes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Фокус на інпуті при відкритті модального вікна
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Завантаження всіх розмірів шин
  useEffect(() => {
    async function loadSizes() {
      try {
        setLoading(true)
        const sizes = await fetchAllTyreSizes()
        console.log(`Loaded ${sizes.length} tire sizes in modal`)
        setAllSizes(sizes)
      } catch (error) {
        console.error("Error loading tire sizes:", error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadSizes()
    }
  }, [open])

  // Фільтрація розмірів на основі пошукового запиту
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSizes([])
      return
    }

    const normalizedSearchTerm = normalizeTireSize(searchTerm)

    const filtered = allSizes.filter((size) => {
      // Нормалізуємо розмір для порівняння
      const normalizedSize = normalizeTireSize(size)

      // Перевіряємо різні варіанти співпадіння
      return (
        normalizedSize === normalizedSearchTerm || // Точне співпадіння після нормалізації
        normalizedSize.includes(normalizedSearchTerm) || // Частковий збіг (пошуковий термін є частиною розміру)
        normalizedSearchTerm.includes(normalizedSize) || // Частковий збіг (розмір є частиною пошукового терміну)
        // Додаткова перевірка для розмірів з префіксами VF, IF
        normalizedSize === normalizedSearchTerm.replace(/^(vf|if)/, "") ||
        normalizedSearchTerm === normalizedSize.replace(/^(vf|if)/, "") ||
        // Перевірка на співпадіння без урахування пробілів та регістру
        size
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
      )
    })

    setFilteredSizes(filtered.slice(0, 15)) // Обмежуємо кількість результатів
  }, [searchTerm, allSizes])

  // Обробка вибору розміру
  const handleSizeSelect = (size: string) => {
    setSearchTerm(size)
    onOpenChange(false)

    // Використовуємо encodeURIComponent для правильного кодування URL
    router.push(`/shop?size=${encodeURIComponent(size)}`)
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

    // Якщо є співпадіння після нормалізації, використовуємо перше
    const normalizedSearchTerm = normalizeTireSize(searchTerm)
    const normalizedMatch = allSizes.find((size) => normalizeTireSize(size) === normalizedSearchTerm)

    if (normalizedMatch) {
      handleSizeSelect(normalizedMatch)
      return
    }

    // Якщо є хоча б часткові співпадіння, використовуємо перше
    if (filteredSizes.length > 0) {
      handleSizeSelect(filteredSizes[0])
      return
    }

    // Якщо нічого не знайдено, просто переходимо на сторінку магазину
    onOpenChange(false)
    router.push("/shop")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Пошук шин за розміром</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative mb-4">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Введіть розмір шини (напр. 710/70R42)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12 py-6 text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          <div className="max-h-[300px] overflow-y-auto rounded-md border">
            {loading ? (
              <div className="p-6 text-center text-gray-500 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Завантаження розмірів шин...</span>
              </div>
            ) : filteredSizes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm.trim() === "" ? "Введіть розмір шини для пошуку" : "Розміри не знайдено"}
              </div>
            ) : (
              filteredSizes.map((size, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={() => handleSizeSelect(size)}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-lg">{size}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Знайдіть ідеальні шини CEAT для вашої сільськогосподарської техніки</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
