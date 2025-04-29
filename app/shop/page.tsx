"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/woocommerce"
import { fetchProductsBySize } from "@/lib/fetchProductsBySize"
import type { Product } from "@/types/product"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const sizeParam = searchParams.get("size")

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Функція для завантаження продуктів
  async function fetchProducts(page = 1) {
    try {
      setLoading(true)

      // Якщо вказано розмір, використовуємо спеціальну функцію для пошуку за розміром
      if (sizeParam && sizeParam !== "all") {
        console.log(`Шукаємо продукти з розміром: ${sizeParam}`)
        const { products: sizeProducts, totalPages: sizePages } = await fetchProductsBySize(sizeParam, page)
        setProducts(sizeProducts)
        setFilteredProducts(sizeProducts)
        setTotalPages(sizePages)
      } else {
        // Інакше завантажуємо всі продукти
        const { products: allProducts, totalPages: allPages } = await getProducts(page, 100)
        setProducts(allProducts)
        setFilteredProducts(allProducts)
        setTotalPages(allPages)
      }
    } catch (err) {
      setError("Помилка завантаження товарів. Спробуйте пізніше.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Завантажуємо продукти при зміні сторінки
  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage])

  // Завантажуємо продукти при зміні параметра розміру
  useEffect(() => {
    // Скидаємо сторінку до 1 при зміні параметра розміру
    setCurrentPage(1)
    fetchProducts(1)
  }, [sizeParam])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 w-full overflow-x-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {sizeParam && sizeParam !== "all" ? `Шини розміру ${sizeParam}` : "Магазин шин CEAT"}
            </h1>
            <p className="text-gray-600">
              {sizeParam && sizeParam !== "all"
                ? `Всі доступні моделі шин CEAT розміру ${sizeParam}`
                : "Знайдіть ідеальні шини для вашої сільськогосподарської техніки"}
            </p>

            {/* Кнопка для скидання фільтра */}
            {sizeParam && sizeParam !== "all" && (
              <Button variant="outline" onClick={() => (window.location.href = "/shop")} className="mt-4">
                Показати всі шини
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Товари не знайдено</h3>
              <p className="text-gray-600">
                {sizeParam
                  ? `Шини розміру ${sizeParam} відсутні в нашому каталозі. Спробуйте інший розмір.`
                  : "Спробуйте оновити сторінку або зв'язатися з нами"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3"
                >
                  Попередня
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && array[index - 1] !== page - 1

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="flex items-center justify-center w-9 h-9">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    )
                  })}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3"
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
