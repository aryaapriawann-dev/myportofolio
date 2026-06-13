import React from "react";

interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return <span className="font-label text-[11px] font-semibold uppercase tracking-widest text-red-600">{children}</span>;
}
