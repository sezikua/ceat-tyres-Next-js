import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/blog/post-card"
import { Pagination } from "@/components/blog/pagination"
import { BlogSidebar } from "@/components/blog/sidebar"
import { getPostsByCategory, getCategories } from "@/lib/wordpress"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Динамічні метадані
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // Отримуємо всі категорії
  const categories = await getCategories()

  // Знаходимо поточну категорію
  const category = categories.find((cat) => cat.slug === params.slug)

  if (!category) {
    return {
      title: "Категорія не знайдена | CEAT Agro Tyres",
    }
  }

  return {
    title: `${category.name} | Блог CEAT Agro Tyres`,
    description: `Статті та новини з категорії "${category.name}" від CEAT Agro Tyres`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Отримуємо номер сторінки з параметрів URL
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  // Отримуємо всі категорії
  const categories = await getCategories()

  // Знаходимо поточну категорію
  const category = categories.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
  }

  // Отримуємо пости для цієї категорії
  const { posts, pageInfo } = await getPostsByCategory(params.slug, page)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          {/* Заголовок сторінки */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Категорія: {category.name}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Статті та новини з категорії "{category.name}"</p>
          </div>

          {/* Контент */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основний контент */}
            <div className="lg:col-span-2">
              {posts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-600">Публікації в цій категорії не знайдено</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>

                  {/* Пагінація */}
                  <Pagination hasNextPage={pageInfo.hasNextPage} currentPage={page} categorySlug={params.slug} />
                </>
              )}
            </div>

            {/* Бічна панель */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
