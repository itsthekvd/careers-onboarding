"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function ClientRedirect({ to }: { to: string }) {
  const router = useRouter()

  useEffect(() => {
    router.push(to)
  }, [router, to])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  )
}
