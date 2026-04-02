"use client";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  return (
    <nav className="border-b border-trade-border bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-trade-blue" />
          <span className="font-bold text-trade-blue">TradePrep</span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoaded && isSignedIn && (
            <Link
              href="/dashboard"
              className="text-sm text-trade-muted hover:text-trade-blue transition-colors"
            >
              My Progress
            </Link>
          )}
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-trade-blue text-white rounded-lg text-sm font-medium hover:bg-trade-blue-light transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
          {isLoaded && isSignedIn && <UserButton />}
        </div>
      </div>
    </nav>
  );
}
