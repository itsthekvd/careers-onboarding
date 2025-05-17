"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function ensureTables() {
  try {
    // Check if submissions table exists
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('submissions', 'users')
    `

    // Safely check if tables exist by properly accessing the result
    const existingTables = result?.rows || []
    const tablesExist = existingTables.length === 2

    console.log("Database check result:", result)
    console.log("Existing tables:", existingTables)
    console.log("Tables exist:", tablesExist)

    if (!tablesExist) {
      console.log("Creating database tables...")

      // Create submissions table
      await sql`
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          profile_url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          onboarding_token TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          submission_id UUID NOT NULL REFERENCES submissions(id),
          name TEXT,
          email TEXT,
          whatsapp TEXT,
          current_step INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create index for faster lookups
      await sql`
        CREATE INDEX IF NOT EXISTS idx_users_submission_id ON users(submission_id)
      `

      console.log("Database tables created successfully")
    } else {
      console.log("Database tables already exist")
    }

    return true
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
    // Continue execution even if there's an error checking tables
    // We'll try to create them anyway

    try {
      console.log("Attempting to create tables after error...")

      // Create submissions table
      await sql`
        CREATE TABLE IF NOT EXISTS submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          profile_url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          onboarding_token TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          submission_id UUID NOT NULL REFERENCES submissions(id),
          name TEXT,
          email TEXT,
          whatsapp TEXT,
          current_step INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `

      console.log("Database tables created successfully after error recovery")
      return true
    } catch (secondError) {
      console.error("Failed to create tables after error:", secondError)
      return false
    }
  }
}
