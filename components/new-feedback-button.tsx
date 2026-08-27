"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowRight } from "lucide-react";

export default function NewFeedbackButton({
    size,
    className,
    label = "New Feedback",
    icon = "plus",
}: {
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    label?: string;
    icon?: "plus" | "arrow";
}) {
    const { data: session } = useSession();
    const router = useRouter();

    const handleClick = () => {
        if (!session) {
            router.push("/?signin=required");
        } else {
            router.push("/feedback/new");
        }
    };

    const Icon = icon === "arrow" ? ArrowRight : PlusIcon;

    return (
        <Button
            size={size}
            onClick={handleClick}
            className={`h-10 rounded-xl bg-white text-base font-medium text-blue-600 hover:bg-gray-100 flex items-center justify-center px-4 ${className ?? ""}`}
        >
            <span className="flex items-center justify-center gap-2">
                {label}
                <Icon className="h-5 w-5" />
            </span>
        </Button>
    );
}