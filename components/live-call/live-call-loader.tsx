"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LiveCallLoader = dynamic(() => import("./live-call"), {
  ssr: false,
  loading: () => <Skeleton className="h-10 w-44 rounded-full" />,
});
