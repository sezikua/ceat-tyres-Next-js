"use client"

import { useScroll } from "framer-motion"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Advantages } from "@/components/advantages"
import { Categories } from "@/components/categories"
import { Calculator } from "@/components/calculator"
import { Clients } from "@/components/clients"
import { AboutCompany } from "@/components/about-company"
import { NewsSection } from "@/components/news-section"
import { ContactForm } from "@/components/contact-form"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Header />

      <main className="flex-1">
        <Hero />
        <Advantages />
        <Categories />
        <Calculator />
        <Clients />
        <AboutCompany />
        <NewsSection />
        <ContactForm />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
