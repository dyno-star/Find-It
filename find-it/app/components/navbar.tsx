"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Post", href: "/post" },
    { name: "Search", href: "/search" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-auto min-h-16 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Find It
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "text-foreground hover:scale-105 hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent"
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}