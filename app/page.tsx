import {
  GraduationCap,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
import { trades } from "@/lib/trades";
import { TradeCard } from "@/components/trade-card";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-trade-blue text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Pass Your Trade Certification Exam
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Affordable exam prep for Plumbing, HVAC, and Electrical
            certifications. Study at your own pace and pass with confidence.
          </p>
          <a
            href="#courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-trade-blue rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Browse Courses <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-trade-bg">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-trade-dark text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border text-center">
              <CheckCircle className="w-10 h-10 text-trade-success mx-auto mb-4" />
              <h3 className="font-bold text-trade-dark mb-2">
                Master Every Topic
              </h3>
              <p className="text-trade-muted text-sm">
                Study chapter by chapter with instant feedback. Progress through
                beginner, intermediate, and advanced levels.
              </p>
            </div>
            <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border text-center">
              <Clock className="w-10 h-10 text-trade-blue mx-auto mb-4" />
              <h3 className="font-bold text-trade-dark mb-2">
                Timed Practice Exam
              </h3>
              <p className="text-trade-muted text-sm">
                Take a realistic 50-question exam with a 60-minute timer. Just
                like the real thing - no second chances.
              </p>
            </div>
            <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border text-center">
              <Award className="w-10 h-10 text-trade-warning mx-auto mb-4" />
              <h3 className="font-bold text-trade-dark mb-2">
                Earn Your Certificate
              </h3>
              <p className="text-trade-muted text-sm">
                Pass the final exam and receive a printable certificate of
                completion. Show employers you are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-trade-dark text-center mb-10">
            Choose Your Trade
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {trades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
