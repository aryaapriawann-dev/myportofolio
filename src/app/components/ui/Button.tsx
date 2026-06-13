import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
}

export default function Button({ variant = "primary", className = "", children, href, ...props }: ButtonProps) {
  const base = "btn-modern inline-flex items-center justify-center rounded-lg font-medium transition duration-200 outline-none focus:ring-2 focus:ring-red-500/20";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-red-brand hover:bg-red-700 text-white px-5 py-2.5 text-sm border border-red-700/10",
    secondary: "border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-neutral-800 px-5 py-2.5 text-sm",
    ghost: "px-4 py-2.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-zinc-100/60",
  };

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
