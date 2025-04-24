"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductById, formatPrice, getTireSize, getBrand } from "@/lib/woocommerce"
import type { Product } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ShoppingCart, ChevronLeft, Check, AlertTriangle } from "lucide-react"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        if (!id || Array.isArray(id)) {
          throw new Error("Invalid product ID")
        }

        const data = await getProductById(Number.parseInt(id))
        if (!data) {
          throw new Error("Product not found")
        }

        setProduct(data)
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].src)
        }
      } catch (err) {
        setError("Помилка завантаження товару. Спробуйте пізніше.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="bg-red-50 text-red-600 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2">Помилка</h2>
              <p>{error || "Товар не знайдено"}</p>
              <Link href="/shop" className="mt-4 inline-block">
                <Button variant="outline" className="mt-4">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Повернутися до магазину
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const tireSize = getTireSize(product)
  const brand = getBrand(product)
  const isInStock = product.stock_status === "instock"

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 w-full overflow-x-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-6">
            <Link href="/shop" className="text-blue-600 hover:underline inline-flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад до магазину
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
                <div className="relative h-[400px] bg-gray-100">
                  <Image
                    src={selectedImage || "/placeholder.svg?height=400&width=400&query=tire"}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.src)}
                      className={`relative w-20 h-20 border-2 rounded-md overflow-hidden flex-shrink-0 ${
                        selectedImage === image.src ? "border-blue-600" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt || product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Badge className="bg-blue-600 text-white mb-2">{brand}</Badge>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">Артикул: {product.sku}</p>

                <div className="flex items-center mb-6">
                  <div className="text-3xl font-bold text-blue-700 mr-4">{formatPrice(product.price)}</div>

                  <div className="flex items-center">
                    {isInStock ? (
                      <>
                        <Badge className="bg-green-500 text-white">
                          <Check className="h-3 w-3 mr-1" />В наявності
                        </Badge>
                      </>
                    ) : (
                      <Badge className="bg-red-500 text-white">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Немає в наявності
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  disabled={!isInStock}
                  className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Додати в кошик
                </Button>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Розмір шини</p>
                    <p className="font-semibold">{tireSize}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Категорія</p>
                    <p className="font-semibold">
                      {product.categories && product.categories.length > 0 ? product.categories[0].name : "Не вказано"}
                    </p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="description" className="text-sm">
                    Опис
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="text-sm">
                    Характеристики
                  </TabsTrigger>
                  <TabsTrigger value="delivery" className="text-sm">
                    Доставка
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-4 bg-white rounded-b-lg border border-t-0">
                  <div dangerouslySetInnerHTML={{ __html: product.description || "Опис відсутній" }} />
                </TabsContent>

                <TabsContent value="specifications" className="p-4 bg-white rounded-b-lg border border-t-0">
                  <div className="space-y-2">
                    {product.attributes && product.attributes.length > 0 ? (
                      product.attributes.map((attr, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                          <div className="font-medium">{attr.name}</div>
                          <div>{attr.options.join(", ")}</div>
                        </div>
                      ))
                    ) : (
                      <p>Характеристики відсутні</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="delivery" className="p-4 bg-white rounded-b-lg border border-t-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-2">Доставка по Україні</h3>
                      <p>Доставка здійснюється транспортними компаніями Нова Пошта, Делівері, САТ.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Оплата</h3>
                      <p>Оплата при отриманні або безготівковий розрахунок.</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Гарантія</h3>
                      <p>На всі шини CEAT надається офіційна гарантія від виробника.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
