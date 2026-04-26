import { Skeleton } from "@/components/ui/skeleton";

export function AuthSkeleton() {
  return (
    <div className="space-y-6">
      {/* Icon skeleton */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <Skeleton className="relative w-16 h-16 rounded-2xl" />
        </div>
      </div>

      {/* Heading and description skeleton */}
      <div className="space-y-2 text-center">
        <Skeleton className="h-8 mx-auto w-3/4 rounded" />
        <Skeleton className="h-4 mx-auto w-full rounded" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-4">
        {/* OTP input skeleton (6 boxes) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-12 rounded" />
            ))}
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-10 rounded" />
          <Skeleton className="h-10 w-32 rounded" />
        </div>
      </div>
    </div>
  );
}

export function AuthFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Input fields skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-16 rounded" />
        <Skeleton className="h-16 rounded" />
      </div>

      {/* Remember me and forgot password skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>

      {/* Submit button skeleton */}
      <Skeleton className="h-10 rounded" />
    </div>
  );
}

export function ResetPasswordSkeleton() {
  return (
    <div className="space-y-4">
      {/* Input fields skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-16 rounded" />
        <Skeleton className="h-16 rounded" />
        <Skeleton className="h-16 rounded" />
      </div>

      {/* Submit button skeleton */}
      <Skeleton className="h-10 rounded" />
    </div>
  );
}
