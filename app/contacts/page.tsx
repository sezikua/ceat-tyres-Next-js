"use client"

import type React from "react"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactsPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  })

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Імітація відправки форми
    setTimeout(() => {
      setFormStatus("success")
      setFormValues({
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false,
      })
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormValues((prev) => ({ ...prev, consent: checked }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-blue-900">
            <Image
              src="/ceat-tire-warehouse.png"
              alt="CEAT Шини склад"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/90" />
          </div>

          <motion.div
            style={{ opacity, scale, y }}
            className="container relative h-full flex flex-col justify-center items-center text-center px-4 md:px-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Зв'яжіться з нами
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl"
            >
              Ми завжди раді відповісти на ваші запитання та допомогти з підбором шин CEAT для вашої техніки
            </motion.p>
          </motion.div>

          {/* Curved divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 relative z-10">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Phone className="h-8 w-8 text-blue-600" />,
                  title: "Телефонуйте нам",
                  content: (
                    <>
                      <a href="tel:+380504249510" className="text-lg hover:text-blue-600 transition-colors block mb-2">
                        +38 (050) 424-95-10
                      </a>
                      <p className="text-gray-500">Пн-Пт: 9:00 - 18:00</p>
                      <p className="text-gray-500">Сб: 10:00 - 15:00</p>
                    </>
                  ),
                },
                {
                  icon: <Mail className="h-8 w-8 text-blue-600" />,
                  title: "Пишіть нам",
                  content: (
                    <>
                      <a
                        href="mailto:s.kostrov@agrosolar.com.ua"
                        className="text-lg hover:text-blue-600 transition-colors block mb-2"
                      >
                        s.kostrov@agrosolar.com.ua
                      </a>
                      <p className="text-gray-500">Відповідаємо протягом 24 годин</p>
                    </>
                  ),
                },
                {
                  icon: <MapPin className="h-8 w-8 text-blue-600" />,
                  title: "Відвідайте нас",
                  content: (
                    <>
                      <p className="text-lg mb-2">Офіс та склад</p>
                      <p className="text-gray-500">
                        вул. Сулими, 11, смт. Глеваха, Фастівський район, Київська область, Україна, 08631
                      </p>
                    </>
                  ),
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                  <div>{card.content}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
              >
                <h2 className="text-3xl font-bold mb-6">Напишіть нам</h2>
                <p className="text-gray-600 mb-8">
                  Заповніть форму нижче, і наші спеціалісти зв'яжуться з вами найближчим часом
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Ім'я
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        placeholder="Ваше ім'я"
                        className="w-full"
                        required
                        disabled={formStatus !== "idle"}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="+380 XX XXX XX XX"
                        className="w-full"
                        required
                        disabled={formStatus !== "idle"}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="ваш@email.com"
                      className="w-full"
                      required
                      disabled={formStatus !== "idle"}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Повідомлення
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formValues.message}
                      onChange={handleChange}
                      placeholder="Ваше повідомлення"
                      className="w-full min-h-[120px]"
                      required
                      disabled={formStatus !== "idle"}
                    />
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="consent"
                        checked={formValues.consent}
                        onCheckedChange={handleCheckboxChange}
                        disabled={formStatus !== "idle"}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="consent" className="text-gray-700">
                        Я згоден з обробкою персональних даних
                      </label>
                    </div>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={formStatus !== "idle" || !formValues.consent}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Відправка...
                        </>
                      ) : formStatus === "success" ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Відправлено!
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Надіслати повідомлення
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {formStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg"
                  >
                    Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.
                  </motion.div>
                )}

                {formStatus === "error" && (
                  <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
                    Виникла помилка при відправці повідомлення. Будь ласка, спробуйте пізніше.
                  </div>
                )}
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="h-full min-h-[400px] lg:min-h-[600px]"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
                  <div className="h-full relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4318.988711249159!2d30.277159663332604!3d50.24163465158212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sru!2sua!4v1745391677292!5m2!1sru!2sua"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Часті запитання</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Відповіді на найпоширеніші запитання про шини CEAT та нашу компанію
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: "Як здійснюється доставка шин?",
                  answer:
                    "Доставка здійснюється по всій Україні транспортними компаніями Нова Пошта, Делівері та САТ. Термін доставки зазвичай становить 1-3 робочі дні залежно від регіону.",
                },
                {
                  question: "Яка гарантія надається на шини CEAT?",
                  answer:
                    "На всі шини CEAT надається офіційна гарантія від виробника терміном 12 місяців з моменту покупки або до досягнення певного рівня зносу протектора.",
                },
                {
                  question: "Чи можна замовити шини, яких немає в наявності?",
                  answer:
                    "Так, ми приймаємо попередні замовлення на шини, яких немає в наявності. Термін поставки таких шин зазвичай становить 30-45 днів.",
                },
                {
                  question: "Як підібрати правильний розмір шин для моєї техніки?",
                  answer:
                    "Наші спеціалісти допоможуть вам підібрати оптимальний розмір шин для вашої техніки. Для цього потрібно знати марку і модель техніки або поточний розмір встановлених шин.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="container px-4 md:px-6 relative"
          >
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Потрібна консультація?</h2>
              <p className="text-xl text-white/90 mb-10">
                Наші спеціалісти завжди готові відповісти на ваші запитання та допомогти з вибором шин CEAT
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+380504249510">
                  <Button className="bg-white text-blue-700 hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <Phone className="mr-2 h-5 w-5" />
                    Зателефонувати
                  </Button>
                </a>
                <a href="mailto:s.kostrov@agrosolar.com.ua">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Написати листа
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
