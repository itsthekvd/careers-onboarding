"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  const scrollToForm = () => {
    // If on homepage, scroll to the form
    if (window.location.pathname === "/") {
      const formElement = document.querySelector(".url-submission-form")
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = "/#url-submission"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mobile-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">Maitreya Labs</span>
            <span className="bg-black text-white px-2 py-1 text-xs font-bold rounded">Careers</span>
          </Link>
        </div>

        {/* Single button to take users to the form */}
        <div>
          <Button variant="default" size="sm" onClick={scrollToForm}>
            Apply Now
          </Button>
        </div>
      </div>
    </header>
  )
}
