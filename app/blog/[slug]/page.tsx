import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogSidebar } from "@/components/blog/sidebar"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getPostBySlug, formatDate } from "@/lib/wordpress"

interface PostPageProps {
  params: {
    slug: string
  }
}

// Динамічні метадані
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Пост не знайдено | CEAT Agro Tyres",
    }
  }

  return {
    title: `${post.title} | CEAT Agro Tyres`,
    description: post.excerpt ? post.excerpt.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160) : undefined,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          {/* Навігація назад */}
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Повернутися до блогу
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основний контент */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Зображення */}
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="relative h-[400px]">
                    <Image
                      src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-8">
                  {/* Категорії */}
                  {post.categories?.nodes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.nodes.map((category) => (
                        <Link key={category.slug} href={`/blog/category/${category.slug}`}>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{category.name}</Badge>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Заголовок */}
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

                  {/* Мета-інформація */}
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">
                    <div className="flex items-center mr-6 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    {post.author?.node?.name && (
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author.node.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Вміст */}
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

                  {/* Інформація про автора */}
                  {post.author?.node?.description && (
                    <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                      <h3 className="text-xl font-bold mb-2">Про автора</h3>
                      <p className="text-gray-600">{post.author.node.description}</p>
                    </div>
                  )}
                </div>
              </article>
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
