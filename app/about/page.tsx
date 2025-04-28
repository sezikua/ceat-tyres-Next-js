"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Truck, CheckCircle, Users, Globe, Award, TrendingUp, Zap, ChevronRight, Phone } from "lucide-react"

export default function AboutPage() {
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const whyUsRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLDivElement>(null)

  // InView hooks
  const missionInView = useInView(missionRef, { once: true, threshold: 0.3 })
  const whyUsInView = useInView(whyUsRef, { once: true, threshold: 0.1 })
  const brandInView = useInView(brandRef, { once: true, threshold: 0.3 })
  const visionInView = useInView(visionRef, { once: true, threshold: 0.3 })

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
          <motion.div className="absolute inset-0 bg-blue-900" style={{ y: heroY }}>
            <Image
              src="/ceat-tractor-fieldwork.png"
              alt="CEAT трактор в полі"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/90" />
          </motion.div>

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="container relative h-full flex flex-col justify-center items-center text-center px-4 md:px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <Badge className="mb-6 px-4 py-2 text-sm bg-orange-500 text-white border-none">
                Офіційний імпортер CEAT в Україні
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Про нашу компанію
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Ми об'єднуємо досвід у сільському господарстві та інноваційні рішення для забезпечення аграріїв
                найкращими шинами світового рівня
              </p>
            </motion.div>
          </motion.div>

          {/* Curved divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              ref={missionRef}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
              variants={fadeIn}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                Вітаємо у офіційному інтернет-магазині шин CEAT!
              </h2>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                Ми — команда професіоналів, яка об'єднала досвід у сільському господарстві та інноваційні рішення для
                забезпечення аграріїв найкращими шинами світового рівня.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-blue-800">Наша місія</h3>
                <p className="text-lg text-gray-700">
                  Допомагати вам ефективно працювати в полі, зменшувати витрати та підвищувати врожайність завдяки
                  надійним і сучасним шинам CEAT.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={whyUsRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate={whyUsInView ? "visible" : "hidden"}
              variants={fadeIn}
              className="text-center mb-16"
            >
              <Badge className="mb-4 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full">Переваги</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Чому обирають нас</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ми пропонуємо не просто шини, а комплексні рішення для вашого агробізнесу
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={whyUsInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Shield className="h-10 w-10 text-blue-600" />,
                  title: "Офіційний представник CEAT",
                  description: "Ми пропонуємо тільки оригінальні шини без посередників.",
                },
                {
                  icon: <Globe className="h-10 w-10 text-blue-600" />,
                  title: "Широкий асортимент",
                  description: "Від шин для тракторів і комбайнів до рішень для причіпної техніки.",
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-blue-600" />,
                  title: "Гарантія якості",
                  description:
                    "Кожна шина проходить контроль на відповідність міжнародним стандартам та реальним умовам українських полів.",
                },
                {
                  icon: <Users className="h-10 w-10 text-blue-600" />,
                  title: "Експертна підтримка",
                  description: "Наші фахівці допоможуть підібрати оптимальне рішення для вашої техніки та завдань.",
                },
                {
                  icon: <Truck className="h-10 w-10 text-blue-600" />,
                  title: "Швидка доставка",
                  description: "Маємо власні склади в Україні, що дозволяє оперативно доставляти шини по всій країні.",
                },
                {
                  icon: <Award className="h-10 w-10 text-blue-600" />,
                  title: "Довіра клієнтів",
                  description: "Сотні задоволених клієнтів по всій Україні довіряють нам свій бізнес.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariant}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-blue-500"
                >
                  <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About CEAT Brand */}
        <section ref={brandRef} className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={brandInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image src="/ceat-tire-warehouse.png" alt="Склад шин CEAT" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
                    <Image src="/images/ceat-logo.svg" alt="CEAT Logo" width={120} height={40} className="mb-4" />
                    <p className="text-gray-700">
                      Один із провідних світових виробників шин для сільськогосподарської техніки
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={brandInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full">Про бренд</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">CEAT — інновації та якість</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Індійська компанія CEAT — один із провідних світових виробників шин для сільськогосподарської техніки.
                  Її рішення відзначаються довговічністю, низьким тиском на ґрунт і сприяють збільшенню продуктивності
                  робіт на полі.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  CEAT поєднує інноваційні технології, передовий дизайн та розуміння потреб фермерів у всьому світі.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-orange-500 mb-4" />
                    <h3 className="text-lg font-bold mb-2">Глобальна присутність</h3>
                    <p className="text-gray-600">Продукція CEAT представлена в більш ніж 110 країнах світу</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <Zap className="h-8 w-8 text-orange-500 mb-4" />
                    <h3 className="text-lg font-bold mb-2">Інноваційні технології</h3>
                    <p className="text-gray-600">Постійні інвестиції в дослідження та розробки</p>
                  </div>
                </div>

                <Link href="/shop">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Переглянути каталог шин
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section ref={visionRef} className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="container px-4 md:px-6 relative"
          >
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Наше бачення</h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Ми прагнемо бути вашим надійним партнером у розвитку сучасного агробізнесу. Якість, відповідальність і
                підтримка клієнта — основа нашої роботи.
              </p>
              <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl mb-10">
                <h3 className="text-2xl font-bold mb-4">Долучайтеся до спільноти</h3>
                <p className="text-lg">
                  Долучайтеся до спільноти тих, хто обирає впевненість і результат разом із CEAT!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+380504249510">
                  <Button className="bg-white text-blue-700 hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <Phone className="mr-2 h-5 w-5" />
                    Зв'язатися з нами
                  </Button>
                </a>
                <Link href="/shop">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Переглянути каталог
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Team Section (Placeholder) */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 bg-green-100 text-green-800 rounded-full">Команда</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Наші експерти</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Професіонали, які щодня працюють для забезпечення вашого бізнесу найкращими рішеннями
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto text-center"
            >
              <p className="text-lg text-gray-700 mb-6">
                Наша команда складається з досвідчених фахівців у галузі сільського господарства та шинної індустрії. Ми
                об'єднали експертів з продажу, логістики, технічної підтримки та сервісу, щоб забезпечити комплексний
                підхід до потреб кожного клієнта.
              </p>
              <p className="text-lg text-gray-700">
                Завдяки постійному навчанню та підвищенню кваліфікації, наші спеціалісти завжди в курсі найновіших
                технологій та тенденцій ринку сільськогосподарських шин.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "8+", label: "років на ринку" },
                { number: "1000+", label: "задоволених клієнтів" },
                { number: "5000+", label: "проданих шин" },
                { number: "24/7", label: "підтримка клієнтів" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid-orange" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-orange)" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="container px-4 md:px-6 relative"
          >
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Готові до співпраці?</h2>
              <p className="text-xl text-white/90 mb-10">
                Зв'яжіться з нами сьогодні, щоб отримати консультацію та підібрати оптимальні шини для вашої техніки
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+380504249510">
                  <Button className="bg-white text-orange-600 hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <Phone className="mr-2 h-5 w-5" />
                    Зателефонувати
                  </Button>
                </a>
                <Link href="/contacts">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Написати нам
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
