"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, User, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate, stripHtml } from "@/lib/wordpress"
import type { Post } from "@/types/wordpress"

interface PostCardProps {
  post: Post
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  // Анімація для карток
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  // Отримуємо першу категорію для відображення
  const primaryCategory = post.categories?.nodes?.[0]

  // Очищаємо excerpt від HTML тегів
  const cleanExcerpt = stripHtml(post.excerpt || "")

  // Обмежуємо довжину excerpt
  const truncatedExcerpt = cleanExcerpt.length > 150 ? `${cleanExcerpt.substring(0, 150)}...` : cleanExcerpt

  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={variants} className="group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Зображення */}
        <Link href={`/blog/${post.slug}`} className="block relative h-56 overflow-hidden">
          {post.featuredImage?.node?.sourceUrl ? (
            <Image
              src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image src="/writing-desk-inspiration.png" alt={post.title} fill className="object-cover" />
          )}

          {/* Категорія */}
          {primaryCategory && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none">{primaryCategory.name}</Badge>
            </div>
          )}
        </Link>

        {/* Контент */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Мета-інформація */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <div className="flex items-center mr-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.author?.node?.name && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author.node.name}</span>
              </div>
            )}
          </div>

          {/* Заголовок */}
          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Короткий опис */}
          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{truncatedExcerpt}</p>

          {/* Кнопка "Читати далі" */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-auto"
          >
            Читати далі
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
