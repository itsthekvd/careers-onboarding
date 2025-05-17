import { validateOnboardingToken, getCurrentStep } from "../../../actions"
import { Step3Form } from "./step3-form"
import { Step4Form } from "./step4-form"
import { Step5Form } from "./step5-form"
import { StepForm } from "./step-form"
import { ClientRedirect } from "../../client-redirect"

export default async function StepPage({
  params,
  searchParams,
}: {
  params: { id: string; step: string }
  searchParams: { token: string }
}) {
  const { id, step } = params
  const stepNumber = Number.parseInt(step, 10)
  const token = searchParams.token

  console.log(`Step page loaded for submission ${id}, step ${stepNumber}`)
  console.log(`Token present: ${!!token}`)

  // Handle missing token
  if (!token) {
    console.log("No token provided, redirecting to home")
    return <ClientRedirect to="/" />
  }

  // Handle invalid step number
  if (isNaN(stepNumber) || stepNumber < 2 || stepNumber > 5) {
    console.log(`Invalid step number: ${step}`)
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

  // Check current step
  let currentStep = 1
  try {
    console.log("Getting current step...")
    currentStep = await getCurrentStep(id)
    console.log(`Current step: ${currentStep}`)
  } catch (error) {
    console.error("Error getting current step:", error)
    // Continue with provided step if there's an error
  }

  // If user is trying to access a step they haven't reached yet, redirect to their current step
  if (stepNumber > currentStep) {
    console.log(`User trying to access step ${stepNumber} but is only at step ${currentStep}`)
    return <ClientRedirect to={`/onboarding/${id}/step/${currentStep}?token=${token}`} />
  }

  // Render the appropriate step form based on the step number
  switch (stepNumber) {
    case 2:
      return <StepForm submissionId={id} token={token} stepNumber={stepNumber} title="Getting to Know You" />
    case 3:
      return <Step3Form submissionId={id} token={token} />
    case 4:
      return <Step4Form submissionId={id} token={token} />
    case 5:
      return <Step5Form submissionId={id} token={token} />
    default:
      return <ClientRedirect to={`/onboarding/${id}?token=${token}`} />
  }
}
