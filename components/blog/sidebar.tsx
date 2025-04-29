import Link from "next/link"
import { getCategories } from "@/lib/wordpress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export async function BlogSidebar() {
  // Отримуємо категорії
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Категорії */}
      <Card>
        <CardHeader>
          <CardTitle>Категорії</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/blog/category/${category.slug}`}>
                <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer transition-colors">
                  {category.name} ({category.count})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Популярні пости (можна додати пізніше) */}
      <Card>
        <CardHeader>
          <CardTitle>Про блог</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Блог компанії CEAT Agro Tyres - це джерело корисної інформації про шини для сільськогосподарської техніки,
            новини галузі та поради щодо вибору та експлуатації шин.
          </p>
        </CardContent>
      </Card>

      {/* Підписка на розсилку */}
      <Card className="bg-blue-50 border-blue-100">
        <CardHeader>
          <CardTitle>Підписка на новини</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Отримуйте останні новини та спеціальні пропозиції на вашу електронну пошту
          </p>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="Ваш email"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Підписатися
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
