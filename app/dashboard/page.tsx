"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { trades, difficulties } from "@/lib/trades";
import { Wrench, Thermometer, Zap, Award, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = { Wrench, Thermometer, Zap };

export default function DashboardPage() {
  const { user, isSignedIn, isLoaded } = useUser();

  const allProgress = useQuery(
    api.progress.getAll,
    user ? { clerkUserId: user.id } : "skip"
  );

  const allCertificates = useQuery(
    api.certificates.getAll,
    user ? { clerkUserId: user.id } : "skip"
  );

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
          Sign In to See Your Progress
        </h2>
        <p className="text-trade-muted max-w-md">
          Sign in to track your progress across all trade exams.
        </p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  const loading = allProgress === undefined || allCertificates === undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-trade-dark mb-2">My Progress</h1>
      <p className="text-trade-muted mb-8">
        Track your progress across all trade certifications.
      </p>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {trades.map((trade) => {
            const Icon = iconMap[trade.icon] || Wrench;
            const totalSections = trade.chapters.length * difficulties.length;
            const passedSections = allProgress
              ? allProgress.filter(
                  (p) => p.trade === trade.id && p.passed
                ).length
              : 0;
            const progressPercent =
              totalSections > 0
                ? Math.round((passedSections / totalSections) * 100)
                : 0;
            const hasCertificate = allCertificates
              ? allCertificates.some((c) => c.trade === trade.id)
              : false;
            const hasStarted = passedSections > 0;

            return (
              <Link
                key={trade.id}
                href={`/${trade.slug}/study`}
                className="block"
              >
                <div className="bg-trade-card rounded-xl p-6 card-shadow card-hover border border-trade-border h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${trade.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${trade.color}`} />
                    </div>
                    {hasCertificate && (
                      <Award className="w-6 h-6 text-trade-warning" />
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-trade-dark mb-1">
                    {trade.name}
                  </h3>

                  <p className="text-sm text-trade-muted mb-4">
                    {passedSections}/{totalSections} sections passed
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div
                      className={`rounded-full h-2 transition-all duration-500 ${
                        hasCertificate ? "bg-trade-success" : "bg-trade-blue"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-trade-muted">
                      {progressPercent}% complete
                    </span>
                    <span className="text-xs font-medium text-trade-blue">
                      {hasStarted ? "Continue" : "Start"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
