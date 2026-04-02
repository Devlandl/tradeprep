import { GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center">
        <GraduationCap className="w-16 h-16 text-trade-blue mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-trade-dark mb-4">
          TradePrep
        </h1>
        <p className="text-lg text-trade-muted max-w-2xl mx-auto">
          Affordable exam prep for Plumbing, HVAC, and Electrical
          certifications. Study at your own pace and pass with confidence.
        </p>
      </div>
    </div>
  );
}
