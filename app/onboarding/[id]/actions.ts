"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL)

export async function validateOnboardingToken(submissionId: string, token: string) {
  try {
    console.log(`Validating token for submission ${submissionId} with token ${token.substring(0, 5)}...`)

    // Check if the parameters are valid
    if (!submissionId || !token) {
      console.log("Missing submissionId or token")
      return false
    }

    // Query the database to validate the token
    const result = await sql`
      SELECT id FROM submissions 
      WHERE id = ${submissionId} 
      AND onboarding_token = ${token}
    `

    console.log("Token validation query result:", result)

    // Check if we got a valid result
    const isValid = result && (Array.isArray(result) ? result.length > 0 : result.rows && result.rows.length > 0)

    console.log(`Token validation result: ${isValid}`)

    return isValid
  } catch (error) {
    console.error("Error validating token:", error)
    return false
  }
}

export async function getCurrentStep(submissionId: string) {
  try {
    const result = await sql`
      SELECT current_step FROM users 
      WHERE submission_id = ${submissionId}
    `

    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0].current_step || 1
    }

    return 1 // Default to step 1 if no record exists
  } catch (error) {
    console.error("Error getting current step:", error)
    return 1 // Default to step 1 on error
  }
}

export async function submitOnboardingStep1(submissionId: string, token: string, formData: FormData) {
  try {
    // Validate the token first
    const isValid = await validateOnboardingToken(submissionId, token)

    if (!isValid) {
      return {
        success: false,
        error: "Invalid token",
      }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const whatsapp = formData.get("whatsapp") as string

    if (!name || !email || !whatsapp) {
      return {
        success: false,
        error: "All fields are required",
      }
    }

    // Check if user exists for this submission
    const userCheck = await sql`
      SELECT id FROM users WHERE submission_id = ${submissionId}
    `

    const userExists = userCheck && userCheck.rows && userCheck.rows.length > 0

    if (userExists) {
      // Update existing user
      await sql`
        UPDATE users 
        SET 
          name = ${name}, 
          email = ${email}, 
          whatsapp = ${whatsapp},
          current_step = 2,
          updated_at = CURRENT_TIMESTAMP
        WHERE submission_id = ${submissionId}
      `
    } else {
      // Create new user
      await sql`
        INSERT INTO users (submission_id, name, email, whatsapp, current_step)
        VALUES (${submissionId}, ${name}, ${email}, ${whatsapp}, 2)
      `
    }

    // Update submission status
    await sql`
      UPDATE submissions 
      SET status = 'onboarding' 
      WHERE id = ${submissionId}
    `

    revalidatePath(`/onboarding/${submissionId}`)
    revalidatePath(`/admin`)

    return {
      success: true,
      redirectUrl: `/onboarding/${submissionId}/step/2?token=${token}`,
    }
  } catch (error) {
    console.error("Error submitting onboarding step 1:", error)
    return {
      success: false,
      error: "Failed to submit. Please try again.",
    }
  }
}

export async function updateOnboardingStep(submissionId: string, token: string, step: number, formData: FormData) {
  try {
    // Validate the token first
    const isValid = await validateOnboardingToken(submissionId, token)

    if (!isValid) {
      return {
        success: false,
        error: "Invalid token",
      }
    }

    // Check if user exists for this submission
    const userCheck = await sql`
      SELECT id FROM users WHERE submission_id = ${submissionId}
    `

    const userExists = userCheck && userCheck.rows && userCheck.rows.length > 0

    if (step === 1) {
      // For step 1, we collect basic information and agreement details
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const name = `${firstName} ${lastName}`
      const email = formData.get("email") as string
      const whatsapp = formData.get("whatsapp") as string
      const agreementConsent = formData.get("agreementConsent") as string
      const attachmentConsent = formData.get("attachmentConsent") as string
      const signature = formData.get("signature") as string
      const attachmentSignature = formData.get("attachmentSignature") as string

      if (!firstName || !lastName || !email || !whatsapp) {
        return {
          success: false,
          error: "All fields are required",
        }
      }

      // Create or update the onboarding_data table to store agreement details
      await sql`
        CREATE TABLE IF NOT EXISTS onboarding_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          submission_id UUID NOT NULL REFERENCES submissions(id),
          step INTEGER NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Store the agreement data
      const agreementData = {
        firstName,
        lastName,
        name,
        email,
        whatsapp,
        agreementConsent,
        attachmentConsent,
        signature,
        attachmentSignature,
        step: 1,
        submittedAt: new Date().toISOString(),
      }

      // Check if data for this step already exists
      const existingData = await sql`
        SELECT id FROM onboarding_data 
        WHERE submission_id = ${submissionId} AND step = ${step}
      `

      if (existingData && existingData.rows && existingData.rows.length > 0) {
        // Update existing data
        await sql`
          UPDATE onboarding_data 
          SET data = ${JSON.stringify(agreementData)}
          WHERE submission_id = ${submissionId} AND step = ${step}
        `
      } else {
        // Insert new data
        await sql`
          INSERT INTO onboarding_data (submission_id, step, data)
          VALUES (${submissionId}, ${step}, ${JSON.stringify(agreementData)})
        `
      }

      if (userExists) {
        // Update existing user
        await sql`
          UPDATE users 
          SET 
            name = ${name}, 
            email = ${email}, 
            whatsapp = ${whatsapp},
            current_step = 2,
            updated_at = CURRENT_TIMESTAMP
          WHERE submission_id = ${submissionId}
        `
      } else {
        // Create new user
        await sql`
          INSERT INTO users (submission_id, name, email, whatsapp, current_step)
          VALUES (${submissionId}, ${name}, ${email}, ${whatsapp}, 2)
        `
      }

      // Update submission status
      await sql`
        UPDATE submissions 
        SET status = 'onboarding' 
        WHERE id = ${submissionId}
      `
    } else {
      // For other steps, just update the current step
      const nextStep = step + 1

      await sql`
        UPDATE users 
        SET 
          current_step = ${nextStep},
          updated_at = CURRENT_TIMESTAMP
        WHERE submission_id = ${submissionId}
      `

      // If this is the last step, mark as completed
      if (step === 5) {
        await sql`
          UPDATE submissions 
          SET status = 'completed' 
          WHERE id = ${submissionId}
        `
      }
    }

    // Revalidate paths after all database operations
    revalidatePath(`/onboarding/${submissionId}`)
    revalidatePath(`/admin`)

    return {
      success: true,
      nextStep: step < 5 ? step + 1 : null,
    }
  } catch (error) {
    console.error(`Error updating onboarding step ${step}:`, error)
    return {
      success: false,
      error: "Failed to update. Please try again.",
    }
  }
}

export async function updateUserStep(submissionId: string, token: string, step: number) {
  try {
    // Validate the token first
    const isValid = await validateOnboardingToken(submissionId, token)

    if (!isValid) {
      return {
        success: false,
        error: "Invalid token",
      }
    }

    const nextStep = step + 1

    await sql`
      UPDATE users 
      SET 
        current_step = ${nextStep},
        updated_at = CURRENT_TIMESTAMP
      WHERE submission_id = ${submissionId}
    `

    // If this is the last step, mark as completed
    if (step === 5) {
      await sql`
        UPDATE submissions 
        SET status = 'completed' 
        WHERE id = ${submissionId}
      `
    }

    revalidatePath(`/onboarding/${submissionId}`)
    revalidatePath(`/admin`)

    return {
      success: true,
    }
  } catch (error) {
    console.error(`Error updating user step ${step}:`, error)
    return {
      success: false,
      error: "Failed to update. Please try again.",
    }
  }
}
