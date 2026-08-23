"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "react-hot-toast"
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

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

export function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Validation Error States
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Le nom est obligatoire."
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "L'adresse email est obligatoire."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Veuillez entrer une adresse email valide."
    }

    // Password validation
    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire."
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Run input validation restrictions
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.")
      return
    }

    setLoading(true)

    try {
      // 1. Register User
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Échec de l'inscription")
        setLoading(false)
        return
      }

      toast.success("Registration avec succès")

      // 2. Automatically Sign In after successful registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      setLoading(false)

      if (signInRes?.ok) {
        onClose()
        router.push("/")
        router.refresh()
      } else {
        toast.error("Erreur lors de la connexion automatique")
      }
    } catch {
      setLoading(false)
      toast.error("Une erreur s'est produite")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create an Account</DialogTitle>
          <DialogDescription className="text-center">
            Get started by creating a new account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle className="w-5 h-5" />
            Sign up with Google
          </Button>

          <div className="relative flex items-center justify-center my-2">
            <span className="bg-background px-2 text-xs text-muted-foreground uppercase">
              Or create account with
            </span>
            <div className="absolute inset-0 flex items-center -z-10">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-3" noValidate>
            {/* Full Name Input */}
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: undefined })
                }}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: undefined })
                }}
                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-primary underline font-medium hover:text-primary/80"
            >
              Sign In
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}