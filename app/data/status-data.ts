export const STATUS_ORDER = [
  "UNDER_REVIEW",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
];
import { Eye, ListCheck, Clock, CheckCircle } from "lucide-react";

export const STATUS_GROUPS = {
  UNDER_REVIEW: {
    title: "Under Review",
    description: "New suggestions being evaluated",
    icon: Eye,
    color: "border-gray-400 dark:border-gray-500",
    bgColor: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    countColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  },
  PLANNED: {
    title: "Planned",
    description: "Features we're planning to work on",
    icon: ListCheck,
    color: "border-blue-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    countColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  },
  IN_PROGRESS: {
    title: "In Progress",
    description: "Currently being developed",
    icon: Clock,
    color: "border-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
    countColor: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  },
  COMPLETED: {
    title: "Completed",
    description: "Recently shipped features",
    icon: CheckCircle,
    color: "border-green-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
    textColor: "text-green-700 dark:text-green-300",
    countColor: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  },
};