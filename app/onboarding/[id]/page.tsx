import { validateOnboardingToken, getCurrentStep } from "../actions"
import { OnboardingStep1Form } from "./step1-form"
import { ClientRedirect } from "./client-redirect"

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token: string }
}) {
  const { id } = params
  const token = searchParams.token

  console.log(`Onboarding page loaded for submission ${id}`)
  console.log(`Token present: ${!!token}`)

  // Handle missing token
  if (!token) {
    console.log("No token provided, redirecting to home")
    return <ClientRedirect to="/" />
  }

  // Validate the token
  console.log("Validating token...")
  let isValid = false
  try {
    isValid = await validateOnboardingToken(id, token)
    console.log(`Token validation result: ${isValid}`)
  } catch (error) {
    console.error("Error validating token:", error)
  }

  if (!isValid) {
    console.log("Invalid token, redirecting to home")
    return <ClientRedirect to="/" />
  }

  // Check if user has already started onboarding
  let currentStep = 1
  try {
    console.log("Getting current step...")
    currentStep = await getCurrentStep(id)
    console.log(`Current step: ${currentStep}`)
  } catch (error) {
    console.error("Error getting current step:", error)
    // Continue with step 1 if there's an error
  }

  // If user has already completed step 1, redirect to their current step
  if (currentStep > 1) {
    console.log(`Redirecting to step ${currentStep}`)
    return <ClientRedirect to={`/onboarding/${id}/step/${currentStep}?token=${token}`} />
  }

  // Render step 1 form
  console.log("Rendering step 1 form")
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Internship Onboarding</h1>
        <p className="text-muted-foreground">Step 1 of 5: Personal Information</p>
      </div>

      <div className="w-full bg-secondary h-2 rounded-full mb-8">
        <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
      </div>

      <OnboardingStep1Form submissionId={id} token={token} />
    </div>
  )
}
