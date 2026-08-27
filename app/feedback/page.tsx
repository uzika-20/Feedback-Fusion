import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import GradientHeader from "@/components/gradient-header";
import { Button } from "@base-ui/react";
import Link from "next/link";
import { Car, Map, Plus, PlusIcon } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryDesign } from "../data/category-data";
import { Badge } from "@/components/ui/badge";
import FeedbackList from "@/components/feedback-list";
import NewFeedbackButton from "@/components/new-feedback-button";

export default async function FeedbackPage() {
    const session = await auth();

    console.log("=== FeedbackPage start ===");

    console.log("Before findMany", new Date().toISOString());
    const posts = await prisma.post.findMany({
        include: {
            author: true,
            votes: true
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    console.log("After findMany", new Date().toISOString(), "posts count:", posts.length);

    console.log("Before groupBy", new Date().toISOString());
    const categories = await prisma.post.groupBy({
        by: ["category"],
        _count: true,
    });
    console.log("After groupBy", new Date().toISOString(), "categories:", categories);

    console.log("=== FeedbackPage end ===");

    return (
        <>
            <div className="space-y-6">
                <GradientHeader title="Community Feedback" subTitle="Explore, Vote, and contribute to the features that matters most. Your votes shapes our product's future.">
                    <div className="flex gap-3 justify-center pt-4">
                        <NewFeedbackButton
                            
                            label="New Feedback"
                            icon="plus"
                        />
                        <Button className="rounded-lg bg-white text-black hover:bg-gray-100 px-5 py-2 text-sm font-medium">
                            <Link href="/roadmap" className="flex items-center gap-2">
                                View Roadmap
                                <Map className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </GradientHeader>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6 ">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                                <CardDescription>Browse Feedback By Category</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    {categories.map((cat) => {
                                        const design = getCategoryDesign(cat.category);
                                        const Icon = design.icon;
                                        return (
                                            <div key={cat.category} className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transiton-colors cursot-pointer ">
                                                <div className="flex items-center gap-3 ">
                                                    <div className={`p-2 rounded-lg ${design.light} ${design.border} border`}>
                                                        <Icon className={`h-4 w-4 ${design.text}`}></Icon>
                                                    </div>
                                                    <span className="font-meduim text-sm">{cat.category}</span>
                                                </div>
                                                <Badge variant="secondary" className={`${design.light} ${design.text}`}>{cat._count}</Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <FeedbackList initialPosts={posts} userId={session?.user?.id} />
                    </div>
                </div>
            </div></>
    );
}