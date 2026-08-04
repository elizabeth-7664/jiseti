import React from 'react';
import clsx from 'clsx';

export function Skeleton({ className, ...props }) {
  return (
    <div className={clsx("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)} {...props} />
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
