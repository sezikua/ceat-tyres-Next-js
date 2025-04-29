"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  hasNextPage: boolean
  currentPage: number
  categorySlug?: string
}

export function Pagination({ hasNextPage, currentPage, categorySlug }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Функція для створення URL з параметрами
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())

    // Якщо ми на сторінці категорії
    if (categorySlug) {
      return `/blog/category/${categorySlug}?${params.toString()}`
    }

    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex justify-center mt-12 space-x-2">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)}>
          <Button variant="outline" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Попередня
          </Button>
        </Link>
      )}

      {/* Поточна сторінка */}
      <Button variant="outline" className="bg-blue-50 border-blue-200">
        {currentPage}
      </Button>

      {hasNextPage && (
        <Link href={createPageURL(currentPage + 1)}>
          <Button variant="outline" className="flex items-center gap-1">
            Наступна
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}
