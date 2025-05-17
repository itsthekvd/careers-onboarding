import { validateOnboardingToken } from "../../actions"
import { ClientRedirect } from "../client-redirect"
import Link from "next/link"

export default async function CompletePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token: string }
}) {
  const { id } = params
  const token = searchParams.token

  // Handle missing token
  if (!token) {
    return <ClientRedirect to="/" />
  }

  // Validate the token
  let isValid = false
  try {
    isValid = await validateOnboardingToken(id, token)
  } catch (error) {
    console.error("Error validating token:", error)
  }

  if (!isValid) {
    return <ClientRedirect to="/" />
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="bg-card rounded-lg shadow-xl p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Onboarding Complete!</h1>
        <p className="mb-6">
          Thank you for completing the onboarding process. We're excited to have you join our team!
        </p>
        <p className="mb-6">
          Our team will review your information and will be in touch with you shortly. In the meantime, you can access
          your TickTick dashboard to get started.
        </p>
        <Link
          href="https://ticktick.com/pub/project/collaboration/invite/9239d23c7a7144759702d6c802e4eb98?u=6d9ea2da0a274ab4b68daffa4e4b4a4f"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Access TickTick Dashboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 h-4 w-4"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </Link>
      </div>
    </div>
  )
}
