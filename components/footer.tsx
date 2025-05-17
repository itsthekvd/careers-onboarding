import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mobile-container py-8 md:py-12">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">Maitreya Labs</span>
            <span className="bg-black text-white px-2 py-1 text-xs font-bold rounded">Careers</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Helping students accelerate their career growth through personalized guidance and industry connections.
          </p>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Maitreya Labs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
