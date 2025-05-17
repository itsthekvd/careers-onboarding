"use server"

import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { ensureTables } from "./ensure-tables"

const sql = neon(process.env.DATABASE_URL)

// Schema validation for the URL
const urlSchema = z.object({
  profileUrl: z.string().url("Please enter a valid URL"),
})

export async function submitUrl(formData: FormData) {
  try {
    // Get and validate the URL
    const profileUrl = formData.get("profileUrl") as string | null

    if (!profileUrl) {
      return {
        success: false,
        error: "URL is required",
      }
    }

    const result = urlSchema.safeParse({ profileUrl })

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0].message,
      }
    }

    // Ensure database tables exist
    const tablesExist = await ensureTables()
    console.log("Tables exist:", tablesExist)

    // Log for debugging
    console.log("Submitting URL to database:", profileUrl)

    try {
      // Use a simpler insert statement first
      console.log("Attempting database insert...")

      // First, try a simple insert without RETURNING
      await sql`
        INSERT INTO submissions (profile_url, status)
        VALUES (${profileUrl}, 'pending')
      `

      console.log("Insert successful")

      // Force revalidation of the admin page
      revalidatePath("/admin")
      console.log("Admin page revalidated")

      return {
        success: true,
        message: "Submission received successfully",
      }
    } catch (dbError) {
      console.error("Database insert error:", dbError)

      // If there's a specific error about the table not existing, try creating it again
      if (dbError.message && dbError.message.includes("relation") && dbError.message.includes("does not exist")) {
        console.log("Table does not exist error detected, trying to create tables again...")

        // Try to create tables again
        await ensureTables()

        // Try insert one more time
        try {
          await sql`
            INSERT INTO submissions (profile_url, status)
            VALUES (${profileUrl}, 'pending')
          `

          console.log("Insert successful after recreating tables")
          revalidatePath("/admin")

          return {
            success: true,
            message: "Submission saved after table recreation",
          }
        } catch (finalError) {
          console.error("Final insert attempt failed:", finalError)
          return {
            success: false,
            error: "Database error. Please try again later.",
          }
        }
      }

      return {
        success: false,
        error: "Failed to save submission. Please try again.",
      }
    }
  } catch (error) {
    console.error("Error submitting URL:", error)
    return {
      success: false,
      error: "Failed to submit URL. Please try again.",
    }
  }
}
