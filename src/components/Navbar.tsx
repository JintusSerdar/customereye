// Minimal navigation bar for CustomerEye
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-background shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="w-36">
              <Link href="/">
                <Image
                  src="/logos/MainText.svg"
                  alt="CustomerEye Main Logo"
                  width={200}
                  height={200}
                  className="w-full h-full"
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/reports"
                className="border-transparent text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
