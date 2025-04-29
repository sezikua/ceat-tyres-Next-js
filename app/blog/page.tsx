import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/blog/post-card"
import { Pagination } from "@/components/blog/pagination"
import { BlogSidebar } from "@/components/blog/sidebar"
import { getPosts } from "@/lib/wordpress"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Блог | CEAT Agro Tyres",
  description: "Новини, статті та корисна інформація про шини CEAT для сільськогосподарської техніки",
}

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Отримуємо номер сторінки з параметрів URL
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  // Отримуємо пости
  const { posts, pageInfo } = await getPosts(page)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          {/* Заголовок сторінки */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Блог CEAT Agro Tyres</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Новини, статті та корисна інформація про шини CEAT для сільськогосподарської техніки
            </p>
          </div>

          {/* Контент */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основний контент */}
            <div className="lg:col-span-2">
              {posts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-600">Публікації не знайдено</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>

                  {/* Пагінація */}
                  <Pagination hasNextPage={pageInfo.hasNextPage} currentPage={page} />
                </>
              )}
            </div>

            {/* Бічна панель */}
            <div className="lg:col-span-1">
              <Suspense
                fallback={
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                }
              >
                <BlogSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
