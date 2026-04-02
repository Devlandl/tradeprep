import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-trade-border py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-trade-muted" />
          <span className="text-sm text-trade-muted">TradePrep</span>
        </div>
        <p className="text-xs text-trade-muted">
          Powered by{" "}
          <a
            href="https://tvrapp.app"
            className="hover:text-trade-blue transition-colors"
          >
            TVR App Store
          </a>
        </p>
      </div>
    </footer>
  );
}
