"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { validateOnboardingToken } from "./actions"

export function ClientRedirect({ to, submissionId, token }: { to: string; submissionId?: string; token?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(submissionId && token)

  useEffect(() => {
    async function validateAndRedirect() {
      if (submissionId && token) {
        setIsValidating(true)
        try {
          const isValid = await validateOnboardingToken(submissionId, token)
          if (isValid) {
            router.push(to)
          } else {
            setError("Access denied. This submission has been disabled or the token is invalid.")
          }
        } catch (err) {
          console.error("Error validating token:", err)
          setError("An error occurred while validating your access.")
        } finally {
          setIsValidating(false)
        }
      } else {
        // No validation needed, just redirect
        router.push(to)
      }
    }

    validateAndRedirect()
  }, [router, to, submissionId, token])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">If you believe this is an error, please contact the administrator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{isValidating ? "Validating your access..." : "Redirecting..."}</p>
    </div>
  )
}
