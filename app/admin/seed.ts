"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL)

export async function seedSampleData() {
  try {
    // Create sample submissions
    const { rows: submissions } = await sql`
      INSERT INTO submissions (profile_url, status, onboarding_token)
      VALUES 
        ('https://linkedin.com/in/sample-user-1', 'pending', 'token-1'),
        ('https://github.com/sample-user-2', 'onboarding', 'token-2'),
        ('https://portfolio.dev/sample-user-3', 'completed', 'token-3')
      RETURNING id
    `

    // Create sample users for the second and third submissions
    await sql`
      INSERT INTO users (submission_id, name, email, whatsapp, current_step)
      VALUES 
        (${submissions[1].id}, 'Jane Smith', 'jane@example.com', '+1234567890', 3),
        (${submissions[2].id}, 'John Doe', 'john@example.com', '+9876543210', 5)
    `

    revalidatePath("/admin")

    return { success: true, message: "Sample data created successfully" }
  } catch (error) {
    console.error("Error seeding sample data:", error)
    return { success: false, error: "Failed to seed sample data" }
  }
}
