"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

const sql = neon(process.env.DATABASE_URL)

export async function getSubmissions() {
  try {
    console.log("Fetching submissions from database...")

    // Improved query to fetch all submissions with their onboarding data
    const result = await sql`
      WITH submission_data AS (
        SELECT 
          s.id, 
          s.profile_url, 
          s.status, 
          s.created_at,
          s.onboarding_token,
          s.disabled,
          u.name,
          u.email,
          u.whatsapp,
          u.current_step,
          json_agg(
            json_build_object(
              'step', od.step,
              'data', od.data
            ) ORDER BY od.step
          ) FILTER (WHERE od.id IS NOT NULL) AS onboarding_data
        FROM 
          submissions s
        LEFT JOIN 
          users u ON s.id = u.submission_id
        LEFT JOIN
          onboarding_data od ON s.id = od.submission_id
        GROUP BY
          s.id, u.id
      )
      SELECT * FROM submission_data
      ORDER BY created_at DESC
    `

    console.log("Submissions query result:", result)

    // Handle different response formats
    let submissions = []

    if (result && Array.isArray(result)) {
      submissions = result
      console.log("Array response detected, submissions count:", submissions.length)
    } else if (result && result.rows && Array.isArray(result.rows)) {
      submissions = result.rows
      console.log("Rows response detected, submissions count:", submissions.length)
    } else if (result && typeof result === "object") {
      // Try to extract rows from the response object
      const possibleRows = Object.values(result).find((val) => Array.isArray(val))
      if (possibleRows) {
        submissions = possibleRows
        console.log("Object with array property detected, submissions count:", submissions.length)
      }
    }

    // Process the submissions to ensure onboarding_data is properly formatted
    submissions = submissions.map((submission) => {
      // If onboarding_data is null, initialize it as an empty array
      if (!submission.onboarding_data) {
        submission.onboarding_data = []
      }

      // Convert onboarding_data to the expected format
      if (Array.isArray(submission.onboarding_data)) {
        submission.onboardingData = submission.onboarding_data.map((item) => item.data)
        delete submission.onboarding_data // Remove the original property
      }

      return submission
    })

    console.log("Returning processed submissions:", submissions.length)
    return submissions
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return []
  }
}

export async function getOnboardingData(submissionId: string) {
  try {
    const result = await sql`
      SELECT step, data FROM onboarding_data 
      WHERE submission_id = ${submissionId}
      ORDER BY step ASC
    `

    if (result && result.rows && result.rows.length > 0) {
      return result.rows.map((row) => row.data)
    }

    return []
  } catch (error) {
    console.error(`Error fetching onboarding data for submission ${submissionId}:`, error)
    return []
  }
}

export async function createOnboardingLink(submissionId: string) {
  try {
    console.log(`Creating onboarding link for submission ${submissionId}`)

    // Generate a unique token
    const token = randomUUID()
    console.log(`Generated token: ${token.substring(0, 5)}...`)

    // Update the submission with the token
    const result = await sql`
      UPDATE submissions 
      SET onboarding_token = ${token},
          disabled = FALSE
      WHERE id = ${submissionId}
      RETURNING id, onboarding_token
    `

    console.log("Update result:", result)

    // Verify the token was saved
    const verifyResult = await sql`
      SELECT id, onboarding_token FROM submissions
      WHERE id = ${submissionId}
    `

    console.log("Verification result:", verifyResult)

    revalidatePath("/admin")
    console.log("Admin page revalidated")

    return {
      success: true,
      onboardingLink: `/onboarding/${submissionId}?token=${token}`,
    }
  } catch (error) {
    console.error("Error creating onboarding link:", error)
    return {
      success: false,
      error: "Failed to create onboarding link",
    }
  }
}

// New function to disable an onboarding token
export async function disableOnboardingToken(submissionId: string) {
  try {
    console.log(`Disabling onboarding token for submission ${submissionId}`)

    // Update the submission to disable the token
    await sql`
      UPDATE submissions 
      SET disabled = TRUE
      WHERE id = ${submissionId}
    `

    revalidatePath("/admin")
    console.log("Admin page revalidated")

    return {
      success: true,
      message: "Token disabled successfully",
    }
  } catch (error) {
    console.error("Error disabling onboarding token:", error)
    return {
      success: false,
      error: "Failed to disable token",
    }
  }
}

// New function to enable an onboarding token
export async function enableOnboardingToken(submissionId: string) {
  try {
    console.log(`Enabling onboarding token for submission ${submissionId}`)

    // Update the submission to enable the token
    await sql`
      UPDATE submissions 
      SET disabled = FALSE
      WHERE id = ${submissionId}
    `

    revalidatePath("/admin")
    console.log("Admin page revalidated")

    return {
      success: true,
      message: "Token enabled successfully",
    }
  } catch (error) {
    console.error("Error enabling onboarding token:", error)
    return {
      success: false,
      error: "Failed to enable token",
    }
  }
}
