import { redirect } from "next/navigation"
import { validateOnboardingToken, getCurrentStep } from "../../actions"
import { OnboardingStep } from "./onboarding-step"
import { ClientRedirect } from "../../client-redirect"

export default async function StepPage({
  params,
  searchParams,
}: {
  params: { id: string; step: string }
  searchParams: { token?: string }
}) {
  const { id, step } = params
  const { token } = searchParams
  const stepNumber = Number.parseInt(step, 10)

  if (!token) {
    redirect(`/onboarding/${id}`)
  }

  // Validate the token server-side
  const isValid = await validateOnboardingToken(id, token)

  if (!isValid) {
    // Return the client redirect component with error handling
    return <ClientRedirect to={`/onboarding/${id}`} submissionId={id} token={token} />
  }

  // Get the current step for this user
  const currentStep = await getCurrentStep(id)

  // If trying to access a future step, redirect to the current step
  if (stepNumber > currentStep) {
    return <ClientRedirect to={`/onboarding/${id}/step/${currentStep}?token=${token}`} />
  }

  // If trying to access a previous step, allow it
  return <OnboardingStep submissionId={id} step={stepNumber} token={token} />
}
