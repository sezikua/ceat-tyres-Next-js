"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Search, ChevronDown, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllTireSizes } from "@/lib/woocommerce"

export function TireSearch() {
  const router = useRouter()
  const [searchRef, searchInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [allSizes, setAllSizes] = useState<string[]>([])
  const [filteredSizes, setFilteredSizes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all tire sizes
  useEffect(() => {
    async function fetchSizes() {
      try {
        setLoading(true)
        const sizes = await getAllTireSizes()
        setAllSizes(sizes)
        setFilteredSizes(sizes)
      } catch (error) {
        console.error("Error fetching tire sizes:", error)
        setError("Не вдалося завантажити розміри шин. Спробуйте пізніше.")
      } finally {
        setLoading(false)
      }
    }

    fetchSizes()
  }, [])

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
    router.push(`/shop?size=${encodeURIComponent(size)}`)
  }

  // Variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section ref={searchRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={searchInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Пошук шин по розміру</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Оберіть розмір шини, і ми покажемо всі доступні моделі CEAT для ваших потреб
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={searchInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="relative">
                <div
                  className="border border-gray-300 rounded-lg p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={`${!searchTerm ? "text-gray-500" : "text-black"}`}>
                    {searchTerm || "Оберіть розмір шини"}
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
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSearchTerm(size)
                              setIsOpen(false)
                              handleSizeSelect(size)
                            }}
                          >
                            {size}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => {
                    if (searchTerm) {
                      handleSizeSelect(searchTerm)
                    } else {
                      router.push("/shop")
                    }
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Знайти шини
                </Button>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Популярні розміри</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {allSizes.slice(0, 5).map((size, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer px-3 py-1.5"
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
