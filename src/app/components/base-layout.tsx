import type React from "react"
import { Navbar } from "./navbar"
import { Footer } from "./footer"

interface BaseLayoutProps {
  children: React.ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
