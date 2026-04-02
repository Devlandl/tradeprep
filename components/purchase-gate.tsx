"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Lock, ExternalLink, Loader2 } from "lucide-react";

export function PurchaseGate({
  storeSlug,
  storeUrl,
  tradeName,
  children,
}: {
  storeSlug: string;
  storeUrl: string;
  tradeName: string;
  children: React.ReactNode;
}) {
  const { user, isSignedIn, isLoaded } = useUser();
  const [purchased, setPurchased] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function check() {
      try {
        const res = await fetch(
          `/api/check-purchase?userId=${user!.id}&slug=${storeSlug}`
        );
        const data = await res.json();
        setPurchased(data.purchased);
      } catch {
        setPurchased(false);
      }
    }

    check();
  }, [isLoaded, isSignedIn, user, storeSlug]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
        <Lock className="w-12 h-12 text-trade-muted" />
        <h2 className="font-bold text-xl text-trade-dark">
          Sign In to Study
        </h2>
        <p className="text-trade-muted max-w-md">
          Sign in to access your {tradeName} exam prep course.
        </p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  if (purchased === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
      </div>
    );
  }

  if (!purchased) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
        <Lock className="w-12 h-12 text-trade-warning" />
        <h2 className="font-bold text-xl text-trade-dark">
          Unlock {tradeName} Exam Prep
        </h2>
        <p className="text-trade-muted max-w-md">
          Get full access to all chapters, practice exams, and your certificate
          for just $10.
        </p>
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
        >
          Get This Course - $10 <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
