"use client";

import { useParams, notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTrade } from "@/lib/trades";
import { PurchaseGate } from "@/components/purchase-gate";
import { CertificateView } from "@/components/certificate-view";
import { Loader2, Award } from "lucide-react";
import Link from "next/link";

export default function CertificatePage() {
  const params = useParams();
  const tradeSlug = params.trade as string;
  const trade = getTrade(tradeSlug);
  const { user } = useUser();

  const certificate = useQuery(
    api.certificates.getByTrade,
    user && trade
      ? { clerkUserId: user.id, trade: trade.id }
      : "skip"
  );

  if (!trade) return notFound();

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Loading */}
        {certificate === undefined && user && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
          </div>
        )}

        {/* No certificate */}
        {certificate === null && (
          <div className="text-center py-16">
            <Award className="w-12 h-12 text-trade-muted mx-auto mb-4" />
            <h2 className="text-xl font-bold text-trade-dark mb-2">
              No Certificate Yet
            </h2>
            <p className="text-trade-muted mb-6">
              Pass the {trade.name} final exam to earn your certificate.
            </p>
            <Link
              href={`/${trade.slug}/exam`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
            >
              Take the Exam
            </Link>
          </div>
        )}

        {/* Show certificate */}
        {certificate && (
          <CertificateView
            userName={certificate.userName}
            tradeName={trade.name}
            score={certificate.score}
            passedAt={certificate.passedAt}
          />
        )}
      </div>
    </PurchaseGate>
  );
}
