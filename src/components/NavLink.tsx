"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps
  extends Omit<LinkProps, "className">,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName: _pendingClassName, href, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link ref={ref} href={href} className={cn(className, isActive && activeClassName)} {...props}>
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
