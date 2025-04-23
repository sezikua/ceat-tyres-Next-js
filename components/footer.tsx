"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground className="z-0" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-6">
              <Image src="/images/ceat-logo.svg" alt="CEAT Logo" width={150} height={50} className="h-10 w-auto" />
            </div>
            <p className="text-gray-400 mb-6">
              Офіційний імпортер шин CEAT в Україні. Прямі поставки, гарантія, сервіс.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/ceatua"
                className="bg-gray-800 hover:bg-blue-400 p-2 rounded-full transition-colors"
                aria-label="Telegram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.196-2.783 5.056-4.566c.223-.198-.054-.308-.335-.116l-6.24 3.93-2.69-.918c-.585-.177-.596-.585.124-.866l10.53-4.067c.48-.177.902.107.777.658z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Продукція</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products/front-tractor" className="text-gray-400 hover:text-white transition-colors">
                  Передні тракторні шини
                </Link>
              </li>
              <li>
                <Link href="/products/rear-tractor" className="text-gray-400 hover:text-white transition-colors">
                  Задні тракторні шини
                </Link>
              </li>
              <li>
                <Link href="/products/trailer" className="text-gray-400 hover:text-white transition-colors">
                  Шини для причепів
                </Link>
              </li>
              <li>
                <Link href="/products/sprayer" className="text-gray-400 hover:text-white transition-colors">
                  Шини для обприскувачів
                </Link>
              </li>
              <li>
                <Link href="/products/vf-technology" className="text-gray-400 hover:text-white transition-colors">
                  VF-технології
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Компанія</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link href="/for-whom" className="text-gray-400 hover:text-white transition-colors">
                  Для кого ми працюємо
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  Новини та акції
                </Link>
              </li>
              <li>
                <Link href="/partnership" className="text-gray-400 hover:text-white transition-colors">
                  Партнерство
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-400 hover:text-white transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Контакти</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-orange-500" />
                <a href="tel:+380504249510" className="text-gray-400 hover:text-white transition-colors">
                  +38 (050) 424-95-10
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-orange-500" />
                <a
                  href="mailto:s.kostrov@agrosolar.com.ua"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  s.kostrov@agrosolar.com.ua
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-orange-500 mt-1" />
                <span className="text-gray-400">
                  вул. Сулими, 11, смт. Глеваха, Фастівський район, Київська область, Україна, 08631
                </span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-orange-500" />
                <span className="text-gray-400">Пн-Пт: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Розробник Костров С.М. Всі права захищені.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
              Політика конфіденційності
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
              Умови використання
            </Link>
            <Link href="/sitemap" className="text-gray-500 hover:text-white text-sm transition-colors">
              Карта сайту
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        aria-label="Повернутися вгору"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  )
}
