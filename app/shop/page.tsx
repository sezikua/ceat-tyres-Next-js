"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { getProducts } from "@/lib/woocommerce"
import type { Product } from "@/types/product"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchProducts(page = 1) {
    try {
      setLoading(true)
      const { products: data, totalPages: pages } = await getProducts(page)
      setProducts(data)
      setFilteredProducts(data)
      setTotalPages(pages)
    } catch (err) {
      setError("Помилка завантаження товарів. Спробуйте пізніше.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Магазин шин CEAT</h1>
            <p className="text-gray-600">Знайдіть ідеальні шини для вашої сільськогосподарської техніки</p>
          </div>

          <ProductFilters
            products={products}
            onFilter={(filtered) => {
              setFilteredProducts(filtered)
              setCurrentPage(1) // Скидаємо на першу сторінку при фільтрації
            }}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Товари не знайдено</h3>
              <p className="text-gray-600">Спробуйте змінити параметри фільтрації або пошуку</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="mt-10 flex justify-center">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Попередня
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Наступна
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
