import Link from "next/link"
import { Sparkle, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo (Links to Home) */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkle className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">Feedback Fusion</span>
        </Link>

        {/* Center: Navigation Links + Creator Credit */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <Link href="/roadmap" className="hover:text-foreground transition-colors">
              Roadmap
            </Link>
            <Link href="/feedback" className="hover:text-foreground transition-colors">
              Feedback
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>by Moemen Hedhly</span>
          </div>
        </div>

        {/* Right: Copyright */}
        <div className="text-sm text-muted-foreground">
          &copy; {currentYear} Feedback Fusion. All rights reserved.
        </div>
      </div>
    </footer>
  )
}