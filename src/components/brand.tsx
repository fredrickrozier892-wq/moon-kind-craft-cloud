import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="4" rx="1" fill="currentColor" opacity="0.95" />
      <rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="3" y="16" width="18" height="4" rx="1" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function Wordmark({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Mark className={light ? "text-sidebar-primary" : "text-primary"} />
      <span
        className={cn(
          "font-display text-[17px] font-semibold tracking-tight",
          light ? "text-sidebar-foreground" : "text-foreground",
        )}
      >
        Пласт
      </span>
    </span>
  );
}
