import { getSubmissions } from "./actions"
import { SubmissionsTable } from "./submissions-table"
import { SeedButton } from "./seed-button"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  const submissions = await getSubmissions()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <SeedButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-bold">Total Submissions</h2>
          <p className="text-sm text-muted-foreground">All time</p>
          <p className="text-4xl font-bold mt-2">{submissions.length}</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-bold">Pending</h2>
          <p className="text-sm text-muted-foreground">Awaiting onboarding</p>
          <p className="text-4xl font-bold mt-2">{submissions.filter((s) => s.status === "pending").length}</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-bold">Completed</h2>
          <p className="text-sm text-muted-foreground">Finished all steps</p>
          <p className="text-4xl font-bold mt-2">{submissions.filter((s) => s.status === "completed").length}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-sm border mb-8">
        <h2 className="text-xl font-bold mb-2">URL Submissions</h2>
        <p className="text-sm text-muted-foreground mb-6">Manage and track user submissions</p>

        <SubmissionsTable submissions={submissions} />
      </div>
    </div>
  )
}
