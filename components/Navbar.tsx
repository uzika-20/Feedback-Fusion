"use client"

import { useState } from "react"
import { Map, MessageSquare, Settings, Sparkle } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import ThemeToggle from "./theme-toggle"
import { Button } from "@/components/ui/button"

import { SignInModal } from "@/app/(auth)/sign-in/SignInModal"
import { SignUpModal } from "@/app/(auth)/sign-up/SignUpModal"
import { AccountModal } from "@/app/account/AccountModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <>
      <nav className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkle className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">Feedback Fusion</span>
              </div>
            </Link>
            <Link
              href="/roadmap"
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              <Map className="h-4 w-4" />
              Roadmap
            </Link>
            <Link
              href="/feedback"
              className="text-sm hover:text-primary flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {status === "loading" ? (
              <span className="text-sm text-muted-foreground">Loading...</span>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image ?? undefined} />
                    <AvatarFallback>
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={session.user?.image ?? undefined} />
                          <AvatarFallback>
                            {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{session.user?.name}</span>
                          <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setAccountOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Only rendering the Sign In button here */
              <Button className="text-sm" onClick={() => setSignInOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSwitchToSignUp={() => {
          setSignInOpen(false)
          setSignUpOpen(true)
        }}
      />

      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSwitchToSignIn={() => {
          setSignUpOpen(false)
          setSignInOpen(true)
        }}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </>
  )
}