import { auth } from "@/auth"
import AdminFeedbackTable from "@/components/admin-feedback-table";
import GradientHeader from "@/components/gradient-header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function AdminPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }
    const posts = await prisma.post.findMany({
        include: {
            author: true,
            votes: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return (
        <div className="container mx-auto px-4 sm:px-6 space-y-6">
            <GradientHeader title="Admin Dashboard" subTitle="Manage feedbacks and update their status" />
            <AdminFeedbackTable posts={posts} />
        </div>
    )
}