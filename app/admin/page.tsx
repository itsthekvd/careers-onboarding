import { getSubmissions } from "./actions"
import { SubmissionsTable } from "./submissions-table"
import { AddDisabledColumnButton } from "./add-disabled-column-button"

export default async function AdminPage() {
  const submissions = await getSubmissions()

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <AddDisabledColumnButton />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Submissions</h2>
        <SubmissionsTable submissions={submissions} />
      </div>
    </div>
  )
}
