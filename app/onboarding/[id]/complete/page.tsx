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

        {/* Important Notice Box */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-600 mb-6 text-left">
          <h3 className="text-base font-bold mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            IMPORTANT: Install Apps & Enable Notifications
          </h3>
          <p className="text-sm mb-3">
            You <strong>must</strong> install both Zoho Cliq and TickTick mobile apps and enable all notifications to
            ensure you don't miss any important communications or tasks.
          </p>
          <div className="pl-4 text-sm">
            <p className="font-semibold">For each app:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Install the app from your device's app store</li>
              <li>Log in with your provided credentials</li>
              <li>
                Go to app settings and enable <strong>ALL notifications</strong>
              </li>
              <li>Allow the app to send notifications in your device settings</li>
            </ol>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6 text-left">
          <h3 className="text-base font-bold mb-2">Next Steps:</h3>
          <ol className="list-decimal pl-5 space-y-3">
            <li className="text-sm">
              <strong>Log in to Zoho Cliq</strong> using the following credentials:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Login URL:{" "}
                  <a
                    href="https://cliq.zoho.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://cliq.zoho.in/
                  </a>
                </li>
                <li>Login ID: yourfirstname@itskaivalya.com</li>
                <li>Password: Yourfirstname.Yourlastname@A123</li>
                <li className="text-xs italic">
                  Example: If your name is John Smith, your password would be John.Smith@A123
                </li>
              </ul>
            </li>
            <li className="text-sm">
              <strong>Install the Zoho Cliq mobile app</strong> from your device's app store and enable all
              notifications.
            </li>
            <li className="text-sm">
              <strong>Check your Zoho Mail</strong> at{" "}
              <a
                href="https://mail.zoho.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                mail.zoho.in
              </a>{" "}
              for your TickTick access invitation.
            </li>
            <li className="text-sm">
              <strong>Install the TickTick mobile app</strong> after receiving your invitation and enable all
              notifications.
            </li>
          </ol>
        </div>
        <p className="mb-6">
          Our team will review your information and will be in touch with you shortly through Zoho Cliq.
        </p>
        <Link
          href="https://cliq.zoho.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Access Zoho Cliq
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
