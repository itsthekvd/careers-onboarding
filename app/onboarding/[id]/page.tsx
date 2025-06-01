import { validateOnboardingToken, getCurrentStep } from "./actions"
import { ClientRedirect } from "./client-redirect"

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const { id } = params
  const { token } = searchParams

  if (!token) {
    // No token provided, show an error or redirect to a login page
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Access Token Required</h2>
          <p className="text-yellow-600 mb-4">You need a valid access token to view this onboarding page.</p>
          <p className="text-gray-600 text-sm">
            Please use the link provided in your invitation email or contact the administrator.
          </p>
        </div>
      </div>
    )
  }

  // Validate the token server-side
  const isValid = await validateOnboardingToken(id, token)

  if (!isValid) {
    // Return the client redirect component with error handling
    return <ClientRedirect to={`/onboarding/${id}`} submissionId={id} token={token} />
  }

  // Get the current step for this user
  const currentStep = await getCurrentStep(id)

  // Redirect to the current step
  return <ClientRedirect to={`/onboarding/${id}/step/${currentStep}?token=${token}`} />
}
