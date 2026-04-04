import Link from "next/link";
import { Wrench, Thermometer, Zap, Truck, Building2, GraduationCap, PenLine } from "lucide-react";
import type { Trade } from "@/lib/trades";

const iconMap: Record<string, React.ElementType> = { Wrench, Thermometer, Zap, Truck, Building2: Building2, GraduationCap: GraduationCap, PenLine: PenLine };

export function TradeCard({ trade }: { trade: Trade }) {
  const Icon = iconMap[trade.icon] || Wrench;

  return (
    <Link href={`/${trade.slug}`} className="block">
      <div className="bg-trade-card rounded-xl p-6 card-shadow card-hover border border-trade-border h-full">
        <div
          className={`w-12 h-12 ${trade.bgColor} rounded-xl flex items-center justify-center mb-4`}
        >
          <Icon className={`w-6 h-6 ${trade.color}`} />
        </div>
        <h3 className="font-bold text-lg text-trade-dark mb-1">
          {trade.name}
        </h3>
        <p className="text-trade-muted text-sm mb-3">{trade.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-trade-blue">$10</span>
          <span className="text-xs text-trade-muted">
            {trade.chapters.length} chapters
          </span>
        </div>
      </div>
    </Link>
  );
}
