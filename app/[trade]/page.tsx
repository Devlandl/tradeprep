"use client";

import { useParams } from "next/navigation";
import { getTrade } from "@/lib/trades";
import { PurchaseGate } from "@/components/purchase-gate";
import { Wrench, Thermometer, Zap, BookOpen, Clock, Award } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const iconMap: Record<string, React.ElementType> = { Wrench, Thermometer, Zap };

export default function TradePage() {
  const params = useParams();
  const trade = getTrade(params.trade as string);

  if (!trade) return notFound();

  const Icon = iconMap[trade.icon] || Wrench;

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-14 h-14 ${trade.bgColor} rounded-xl flex items-center justify-center`}
          >
            <Icon className={`w-7 h-7 ${trade.color}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-trade-dark">
              {trade.name} Exam Prep
            </h1>
            <p className="text-trade-muted">{trade.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border">
            <BookOpen className="w-6 h-6 text-trade-blue mb-2" />
            <p className="text-2xl font-bold text-trade-dark">
              {trade.chapters.length}
            </p>
            <p className="text-sm text-trade-muted">Chapters</p>
          </div>
          <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border">
            <Clock className="w-6 h-6 text-trade-blue mb-2" />
            <p className="text-2xl font-bold text-trade-dark">Study Mode</p>
            <p className="text-sm text-trade-muted">
              Instant feedback on every question
            </p>
          </div>
          <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border">
            <Award className="w-6 h-6 text-trade-warning mb-2" />
            <p className="text-2xl font-bold text-trade-dark">Final Exam</p>
            <p className="text-sm text-trade-muted">
              50 questions, 60-minute timer
            </p>
          </div>
        </div>

        {/* Chapters Preview */}
        <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border mb-8">
          <h2 className="font-bold text-lg text-trade-dark mb-4">
            What You Will Learn
          </h2>
          <ul className="space-y-3">
            {trade.chapters.map((ch, i) => (
              <li key={ch.id} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-trade-blue/10 text-trade-blue rounded-full flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-trade-dark">{ch.name}</p>
                  <p className="text-sm text-trade-muted">{ch.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`/${trade.slug}/study`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-trade-blue text-white rounded-lg font-semibold hover:bg-trade-blue-light transition-colors"
          >
            Start Studying
          </Link>
        </div>
      </div>
    </PurchaseGate>
  );
}
