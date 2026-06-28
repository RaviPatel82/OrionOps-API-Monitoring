import React from "react";

export default function SkeletonRow() {
  return (
    <div className="grid grid-cols-[28px_64px_1fr_100px_64px_72px_120px] items-center px-6 py-4 border-b border-border/50 gap-x-3">
      <div className="h-3 w-3 rounded-full bg-border animate-pulse" />
      <div className="h-5 w-12 rounded bg-border animate-pulse" />
      <div className="h-4 w-3/4 rounded bg-border animate-pulse" />
      <div className="h-3 w-16 rounded bg-border animate-pulse" />
      <div className="h-5 w-10 rounded bg-border animate-pulse" />
      <div className="h-3 w-12 rounded bg-border animate-pulse" />
      <div className="h-3 w-20 rounded bg-border animate-pulse ml-auto" />
    </div>
  );
}
