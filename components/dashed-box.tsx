import type React from "react";

interface DashedBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function DashedBox({ children, className = "" }: DashedBoxProps) {
  return (
    <div className={`relative inline-block ${className}`}>
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
      {/* Content */}
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}
