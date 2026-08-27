"use client"
import { CATEGORIES_TYPES } from "@/app/data/category-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

async function SubmitFeedback(prevState: { success: boolean, error: string }, formData: FormData) {
    const loadingToast = toast.loading("Submitting your feedback...")

    try {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                title: formData.get("title"),
                description: formData.get("description"),
                category: formData.get("category")
            })
        });
        if (!response.ok) {
            throw new Error("Failed to create post")
        }

        toast.dismiss(loadingToast);
        toast.success("Your feedback has been submitted succefully");

        return {
            success: true,
            error: "",
        }
    } catch (error) {
        console.error("Something went wrong. Please try again.", error)
        toast.dismiss(loadingToast);
        toast.error("Something went wrong.");
        return {
            success: false,
            error: "Failed to submit feedback",
        }
    }
}

export default function NewFeedbackPage() {
    const router = useRouter();
    const [state, action, isPending] = useActionState(SubmitFeedback, {
        success: false,
        error: ""
    });

    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                router.push("/feedback");
                router.refresh();
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [state.success, router])

    return (
        <div className="max-w-2xl mx-auto space-y-6 px-4 sm:px-0">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" >
                    <Link href="/feedback">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-xl sm:text-3xl font-bold">Share Your Feedback</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>New Feedback</CardTitle>
                    <CardDescription>Share your idea with the community. Be specific about what you would like to see</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="What would you like to see ?" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select name="category" id="category" className="w-full px-3 py-2 border rounded-md bg-background" defaultValue={CATEGORIES_TYPES[0]}>
                                {CATEGORIES_TYPES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe your idea in detail..." required />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                                {isPending ? "Submitting" : "Submit Feedback"}
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                <Link href="/feedback">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}