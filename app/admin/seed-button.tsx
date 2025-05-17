"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedSampleData } from "./seed"

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSeed() {
    setIsLoading(true)

    try {
      const result = await seedSampleData()

      if (result.success) {
        alert(result.message)
      } else {
        alert(result.error || "Failed to seed data")
      }
    } catch (error) {
      alert("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleSeed} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Sample Data"}
    </Button>
  )
}
