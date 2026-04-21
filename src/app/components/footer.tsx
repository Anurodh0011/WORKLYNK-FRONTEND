import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/Worklynk-logo-white.png" 
                alt="Worklynk Logo" 
                width={140} 
                height={35} 
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm opacity-90">Connecting talented freelancers with projects worldwide.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse-freelancers" className="hover:opacity-80">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link href="/browse-projects" className="hover:opacity-80">
                  Find Projects
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:opacity-80">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:opacity-80">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm opacity-80">© 2025 Worklynk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
