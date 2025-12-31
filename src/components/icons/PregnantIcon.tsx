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
      <circle cx="12" cy="3.5" r="2.2" />
      {/* Ponytail */}
      <path d="M14 2.5c0.8 0 1.5-0.3 2-0.8c0.2 0.8 0 1.5-0.5 2c-0.4-0.5-1-0.8-1.5-1.2z" />
      {/* Body with pregnant belly - side profile */}
      <path d="M10.5 6.5c-0.8 0-1.5 0.7-1.5 1.5v3c0 0.5-0.5 1-0.5 1.5c0 1.5 0.8 2.5 1.5 3v2.5h1.5v-2c1.5 0 3-1 3.5-2.5c0.5-1.5 0.3-3-0.5-4v-2c0-0.8-0.7-1.5-1.5-1.5h-2.5z" />
      {/* Pregnant belly bump */}
      <ellipse cx="14" cy="12" rx="2.5" ry="3" />
      {/* Arm holding belly */}
      <path d="M10 10c-0.5 0.3-1 0.8-1.2 1.5c-0.2 0.7 0 1.3 0.2 1.8c0.3-0.3 0.8-0.5 1.2-0.6c0.5-0.1 1-0.1 1.3 0c-0.2-0.5-0.5-1-0.8-1.5c-0.3-0.4-0.5-0.8-0.7-1.2z" />
      {/* Hand on belly */}
      <ellipse cx="12.5" cy="13" rx="1" ry="0.6" />
      {/* Legs */}
      <rect x="10" y="18" width="1.2" height="4" rx="0.5" />
      <rect x="12.5" y="18" width="1.2" height="4" rx="0.5" />
    </svg>
  );
}
