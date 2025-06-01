"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addDisabledColumn } from "./add-disabled-column"

export function AddDisabledColumnButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({})

  async function handleAddColumn() {
    setIsLoading(true)
    try {
      const result = await addDisabledColumn()
      setResult({
        success: result.success,
        message: result.success ? "Column added successfully!" : result.error || "Failed to add column",
      })
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <Button onClick={handleAddColumn} disabled={isLoading} variant="outline">
        {isLoading ? "Adding Column..." : "Add Disabled Column"}
      </Button>
      {result.message && (
        <p className={`mt-2 text-sm ${result.success ? "text-green-600" : "text-red-600"}`}>{result.message}</p>
      )}
    </div>
  )
}
