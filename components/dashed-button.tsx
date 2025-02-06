import Link from "next/link";
import type React from "react";

interface DashedButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function DashedButton({
  href,
  children,
  className = "",
}: DashedButtonProps) {
  return (
    <Link href={href} className={`relative inline-block ${className}`}>
      {/* Top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundImage:
            "repeating-linear-gradient(to right, white, white 20px, transparent 20px, transparent 40px)",
        }}
      />
      {/* Bottom border */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundImage:
            "repeating-linear-gradient(to right, white, white 20px, transparent 20px, transparent 40px)",
        }}
      />
      {/* Left border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "2px",
          backgroundImage:
            "repeating-linear-gradient(to bottom, white, white 20px, transparent 20px, transparent 40px)",
        }}
      />
      {/* Right border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "2px",
          backgroundImage:
            "repeating-linear-gradient(to bottom, white, white 20px, transparent 20px, transparent 40px)",
        }}
      />
      <div className="px-6 py-3 relative">{children}</div>
    </Link>
  );
}
