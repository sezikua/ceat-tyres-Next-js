"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-[#203F99] shadow-sm">
      <div className="container flex items-center justify-between h-20 px-4 md:px-6">
        <Link href="/" className="flex items-center relative z-50">
          <Image src="/images/ceat-logo.svg" alt="CEAT Logo" width={150} height={50} className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: "Головна", path: "/" },
            { name: "Магазин", path: "/shop" },
            { name: "Продукція", path: "/products" },
            { name: "Для кого", path: "/for-whom" },
            { name: "Про нас", path: "/about" },
            { name: "Контакти", path: "/contacts" },
          ].map((item, index) => (
            <Link key={index} href={item.path} className="text-base font-medium relative group text-white">
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-white">🇺🇦 UA</span>
          </div>

          <Link href="/shop" className="hidden md:flex text-white hover:text-orange-200 mr-2">
            <ShoppingCart className="h-6 w-6" />
          </Link>

          <Button className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
            Замовити консультацію
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container py-4 px-4 space-y-4">
              {[
                { name: "Головна", path: "/" },
                { name: "Магазин", path: "/shop" },
                { name: "Продукція", path: "/products" },
                { name: "Для кого", path: "/for-whom" },
                { name: "Про нас", path: "/about" },
                { name: "Контакти", path: "/contacts" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="block py-2 text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                Замовити консультацію
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
