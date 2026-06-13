import React from "react";
import Badge from "./Badge";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`space-y-3 ${align === "center" ? "text-center" : ""}`}>
      <Badge>{eyebrow}</Badge>
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">{title}</h2>
      {description ? <p className="max-w-lg text-sm text-neutral-700">{description}</p> : null}
    </div>
  );
}
