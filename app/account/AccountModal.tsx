"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AccountModalProps {
    isOpen: boolean
    onClose: () => void
}

type Tab = "profile" | "security"

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
    const { data: session, update } = useSession()
    const [tab, setTab] = useState<Tab>("profile")

    const [name, setName] = useState(session?.user?.name ?? "")
    const [email, setEmail] = useState(session?.user?.email ?? "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // Sync state when session data loads or changes
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name ?? "")
            setEmail(session.user.email ?? "")
        }
    }, [session])

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Échec de la mise à jour")
                return
            }

            // Inside handleProfileSave in AccountModal.tsx
            toast.success("Profil mis à jour")
            await update({
                name,
                email,
            })
        } catch {
            toast.error("Une erreur s'est produite")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Échec de la mise à jour")
                return
            }

            toast.success("Mot de passe mis à jour")
            setCurrentPassword("")
            setNewPassword("")
        } catch {
            toast.error("Une erreur s'est produite")
        } finally {
            setLoading(false)
        }
    }

    if (!session) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                <div className="flex min-h-[420px]">
                    {/* Sidebar */}
                    <div className="w-48 border-r bg-muted/30 p-4 space-y-1">
                        <div className="mb-4">
                            <h2 className="font-semibold text-sm">Account</h2>
                            <p className="text-xs text-muted-foreground">Manage your account info.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTab("profile")}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left ${tab === "profile" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("security")}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left ${tab === "security" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                                }`}
                        >
                            <Lock className="h-4 w-4" />
                            Security
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        {tab === "profile" ? (
                            <div className="space-y-6">
                                <h3 className="font-semibold">Profile details</h3>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={session.user?.image ?? undefined} />
                                        <AvatarFallback>
                                            {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{session.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                    </div>
                                </div>
                                <form onSubmit={handleProfileSave} className="space-y-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground">Name</label>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground">Email</label>
                                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Saving..." : "Update profile"}
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="font-semibold">Security</h3>
                                <form onSubmit={handlePasswordSave} className="space-y-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground">Current password</label>
                                        <Input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground">New password</label>
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Saving..." : "Update password"}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}