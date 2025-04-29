import type React from "react"
import "../globals.css"
import "./blog.css"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
