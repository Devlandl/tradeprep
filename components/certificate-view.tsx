"use client";

import { Award, Printer } from "lucide-react";

interface CertificateViewProps {
  userName: string;
  tradeName: string;
  score: number;
  passedAt: number;
}

export function CertificateView({
  userName,
  tradeName,
  score,
  passedAt,
}: CertificateViewProps) {
  const date = new Date(passedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Print Button */}
      <div className="text-center mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Certificate
        </button>
      </div>

      {/* Certificate */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-10 border-4 border-trade-blue card-shadow print:border-2 print:shadow-none">
        <div className="text-center">
          <Award className="w-16 h-16 text-trade-warning mx-auto mb-4" />

          <p className="text-sm text-trade-muted uppercase tracking-widest mb-2">
            Certificate of Completion
          </p>

          <h1 className="text-3xl font-bold text-trade-dark mb-1">
            {userName}
          </h1>

          <div className="w-24 h-0.5 bg-trade-blue mx-auto my-4" />

          <p className="text-trade-muted mb-1">has successfully completed</p>
          <h2 className="text-2xl font-bold text-trade-blue mb-4">
            {tradeName} Exam Prep
          </h2>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-sm text-trade-muted">Score</p>
              <p className="text-xl font-bold text-trade-success">{score}%</p>
            </div>
            <div>
              <p className="text-sm text-trade-muted">Date</p>
              <p className="text-sm font-medium text-trade-dark">{date}</p>
            </div>
          </div>

          <div className="w-full h-px bg-trade-border my-6" />

          <p className="text-xs text-trade-muted">
            Prepared with TradePrep - TVR App Store
          </p>
        </div>
      </div>
    </div>
  );
}
