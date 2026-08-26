"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ToastFromParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "not-admin") {
      toast.error("You're not signed in with an admin account");
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

  return null;
}