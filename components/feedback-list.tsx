"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MessageSquare, ThumbsUp, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns"
import { STATUS_GROUPS } from "@/app/data/status-data";
import { Badge } from "./ui/badge";
import { getCategoryDesign } from "@/app/data/category-data";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

interface FeedbackListProps {
    initialPosts: any[]; // ideally replace `any` with your actual Post type
    userId?: string | null;
}

export default function FeedbackList({
    initialPosts,
    userId,
}: FeedbackListProps) {
    const [posts, setPosts] = useState(initialPosts);

    const handleVote = async (postId: number) => {
        if (!userId) {
            toast.error("connecter pour voter");
            return;
        }

        //show loading toast

        const loadingToast = toast.loading("submitting vote");
        try {
            const res = await fetch("api/votes", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    postId,
                })
            })
            if (!res.ok) {
                throw new Error("vote failed")
            }
            const data = await res.json();

            //Dismiss loading toat and show success 
            toast.dismiss(loadingToast);
            toast.success(data.voted ? "Vote added" : "Vote removed");

            //update local state
            setPosts(
                posts.map((post) => {
                    if (post.id === postId) {
                        const voteCount = post.votes.length;
                        return {
                            ...post,
                            votes: data.voted ? [...post.votes, { userId }] : post.votes.filter((v: any) => v.userId !== userId),
                            _count: {
                                votes: data.voted ? voteCount + 1 : voteCount - 1
                            }
                        }
                    }
                    return post;
                })
            )

        } catch (error) {
            console.error("Failed to submit vote.", error)
            //Dismiss loading toat and show success 
            toast.dismiss(loadingToast);
            toast.error("Failed to submit vote. Please try again");
            return {
                success: false,
                error: "Failed to submit feedback",
            }

        }
    }
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow border">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 miw-w-0">
                                <CardTitle className="text-lg">{post.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1.5 mt-1">
                                    <User className="h-3 w-3" />
                                    {post.author.name}
                                    <span>|</span>
                                    <span className="whitespace-nowrap">{formatDistanceToNow(new Date(post.createdAt), {
                                        addSuffix: true
                                    })}</span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-1.5">
                                {/* Status Badge */}
                                {(() => {
                                    console.log("DATABASE STATUS:", post.status)

                                    const statusGroup =
                                        STATUS_GROUPS[
                                        post.status as keyof typeof STATUS_GROUPS
                                        ]

                                    if (!statusGroup) {
                                        console.log("STATUS NOT FOUND:", post.status)
                                        return null
                                    }

                                    const StatusIcon = statusGroup.icon

                                    return (
                                        <Badge
                                            variant="outline"
                                            className={`shrink-0 flex items-center gap-1 ${statusGroup.color} ${statusGroup.textColor}`}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {statusGroup.title}
                                        </Badge>
                                    )
                                })()}
                                {/* Category Badge */}
                                {(() => {
                                    const design = getCategoryDesign(post.category)
                                    const Icon = design.icon

                                    return (
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${design.border} ${design.text} flex items-center`}
                                        >
                                            <Icon className="h-3 w-3" />
                                            {post.category}
                                        </Badge>
                                    )
                                })()}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-3">{post.description}</p>
                        <div className="flex items-center justify-between">
                            <Button variant="outline" size="sm" onClick={() => handleVote(post.id)} className="gap-2">
                                <ThumbsUp className={`h-4 w-4 ${post.votes.some((v: any) => v.userId === userId)} ? "fill-current" : ""`} />
                                {post.votes.length} Votes
                            </Button>
                            <div className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                                <MessageSquare className="h-4 w-4" />
                                Comment
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}