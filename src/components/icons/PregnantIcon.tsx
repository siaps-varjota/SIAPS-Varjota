import { cn } from "@/lib/utils";

interface PregnantIconProps {
  className?: string;
}

export function PregnantIcon({ className }: PregnantIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" />
      {/* Hair/ponytail */}
      <path d="M14.5 3.5c0.8-0.5 1.2-1 1.5-1.5c-0.3 1-0.2 1.8 0.3 2.5c-0.8 0-1.4-0.3-1.8-1z" />
      {/* Body with pregnant belly */}
      <path d="M10 7h4c0.5 0 1 0.5 1 1v2c0 0 2 1.5 2 4c0 2-1 3-2 3.5v0.5c0 0.5-0.5 1-1 1h-4c-0.5 0-1-0.5-1-1v-0.5c-1-0.5-2-1.5-2-3.5c0-2.5 2-4 2-4v-2c0-0.5 0.5-1 1-1z" />
      {/* Arm holding belly */}
      <path d="M8.5 11c-0.5 0.5-1 1.5-1 2.5c0 0.5 0.2 1 0.5 1.5c0.5-1 1.5-2 2.5-2.5c-0.5-0.5-1.2-1-2-1.5z" />
      {/* Legs */}
      <path d="M10.5 19v3c0 0.5 0.5 1 1 1h1c0.5 0 1-0.5 1-1v-3" />
    </svg>
  );
}
