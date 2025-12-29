"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-bold text-2xl">
            Worklynk
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/browse-freelancers" className="hover:opacity-80">
              Freelancers
            </Link>
            <Link href="/browse-projects" className="hover:opacity-80">
              Projects
            </Link>
            <Link href="/login" className="hover:opacity-80">
              Login
            </Link>
            <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/browse-freelancers" className="block py-2 hover:opacity-80">
              Freelancers
            </Link>
            <Link href="/browse-projects" className="block py-2 hover:opacity-80">
              Projects
            </Link>
            <Link href="/login" className="block py-2 hover:opacity-80">
              Login
            </Link>
            <Button asChild className="w-full bg-secondary text-secondary-foreground">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
