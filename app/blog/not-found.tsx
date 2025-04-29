import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-6">404</h1>
          <h2 className="text-3xl font-bold mb-4">Сторінку не знайдено</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Публікація, яку ви шукаєте, не існує або була видалена.</p>
          <Link href="/blog">
            <Button className="bg-blue-600 hover:bg-blue-700">Повернутися до блогу</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
