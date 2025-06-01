"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { validateOnboardingToken } from "./actions"

export function ClientRedirect({
  submissionId,
  token,
  currentStep,
}: {
  submissionId: string
  token: string
  currentStep: number
}) {
  const router = useRouter()

  useEffect(() => {
    async function validateAndRedirect() {
      try {
        const validationResult = await validateOnboardingToken(submissionId, token)

        // Handle different validation result formats
        if (validationResult === false) {
          // Invalid token
          console.error("Invalid token")
          router.push("/")
          return
        }

        // Check if token is disabled
        if (typeof validationResult === "object" && validationResult.disabled === true) {
          console.error("Token is disabled")
          router.push("/")
          return
        }

        // Valid token, redirect to the current step
        if (currentStep > 0 && currentStep <= 5) {
          router.push(`/onboarding/${submissionId}/step/${currentStep}?token=${token}`)
        } else {
          router.push(`/onboarding/${submissionId}/step/1?token=${token}`)
        }
      } catch (error) {
        console.error("Error validating token:", error)
        router.push("/")
      }
    }

    validateAndRedirect()
  }, [submissionId, token, currentStep, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4">Redirecting to the correct step...</p>
      </div>
    </div>
  )
}
