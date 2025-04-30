"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PartnershipPage() {
  const router = useRouter()

  useEffect(() => {
    // Симулюємо перенаправлення на неіснуючу сторінку
    const timeout = setTimeout(() => {
      router.push("/non-existent-page")
    }, 1000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Перенаправлення...</h1>
        <p className="text-gray-600">Демонстрація сторінки 404</p>
      </div>
    </div>
  )
}
