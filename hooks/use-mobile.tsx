"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  // Initialize with false for server-side rendering
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // Initial check
      checkIfMobile()

      // Add event listener for window resize
      window.addEventListener("resize", checkIfMobile)

      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}
