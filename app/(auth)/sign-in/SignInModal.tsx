"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Import router
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
}

export function SignInModal({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCredentialsSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent auto-reloading so we can navigate smoothly
      callbackUrl: "/",
    })

    setLoading(false)

    if (res?.ok) {
      onClose()
      router.push("/") // Redirect to home page
      router.refresh() // Refresh session status in UI
    } else {
      alert("Invalid email or password")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your account to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Google Sign In — Handles redirect via callbackUrl */}
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          <div className="relative flex items-center justify-center my-2">
            <span className="bg-background px-2 text-xs text-muted-foreground uppercase">
              Or continue with email
            </span>
            <div className="absolute inset-0 flex items-center -z-10">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-primary underline font-medium hover:text-primary/80"
            >
              Sign Up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}