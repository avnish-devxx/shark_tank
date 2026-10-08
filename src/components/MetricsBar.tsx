import React from 'react';
import { PitchMetrics, DealStatus } from '../types';
import { IndianRupee, PieChart, ShieldAlert, CheckCircle, Handshake, FileText, MessageCircle } from 'lucide-react';

interface MetricsBarProps {
  metrics: PitchMetrics;
  onOpenTermSheet?: () => void;
  onOpenRebuttal?: () => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  metrics,
  onOpenTermSheet,
  onOpenRebuttal,
}) => {
  const getDealBadge = (status: DealStatus) => {
    switch (status) {
      case 'Deal Offered':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-emerald-500/20',
          dot: 'bg-emerald-400',
          title: 'DEAL OFFERED',
          description: 'Strong investor conviction justified an investment offer!',
          icon: Handshake,
        };
      case 'Negotiating':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-amber-500/20',
          dot: 'bg-amber-400',
          title: 'TERMS NEGOTIATING',
          description: 'High interest detected, but valuation terms require founder defense.',
          icon: MessageCircle,
        };
      case 'Rejected':
      default:
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-rose-500/20',
          dot: 'bg-rose-400',
          title: 'PITCH REJECTED',
          description: 'Majority sharks stepped out or fundamentals did not support ask.',
          icon: ShieldAlert,
        };
    }
  };

  const dealMeta = getDealBadge(metrics.deal_status);
  const DealIcon = dealMeta.icon;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-md p-6 shadow-2xl space-y-6">
      {/* Top Banner: Deal Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border ${dealMeta.bg}`}
          >
            <DealIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">
                Arena Verdict
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase border ${dealMeta.bg}`}>
                <span className={`h-2 w-2 rounded-full ${dealMeta.dot} animate-pulse`} />
                {dealMeta.title}
              </span>
            </div>
            <p className="text-sm text-neutral-300 font-sans mt-0.5">{dealMeta.description}</p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {metrics.deal_status !== 'Rejected' && onOpenTermSheet && (
            <button
              onClick={onOpenTermSheet}
              type="button"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>Review Term Sheet</span>
            </button>
          )}

          {onOpenRebuttal && (
            <button
              onClick={onOpenRebuttal}
              type="button"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-200 transition-all hover:border-amber-500/50 cursor-pointer"
            >
              <Handshake className="h-4 w-4 text-amber-400" />
              <span>Counter-Offer / Defend</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Core Financial & Valuation Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Overall Sentiment Score */}
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Overall Sentiment
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`font-mono text-3xl font-extrabold ${
                metrics.overall_sentiment_score >= 70
                  ? 'text-emerald-400'
                  : metrics.overall_sentiment_score >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {metrics.overall_sentiment_score}
            </span>
            <span className="font-mono text-xs text-neutral-500">/100</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
            <CheckCircle className="h-3 w-3 text-neutral-500" />
            <span>Avg of 3 Sharks</span>
          </div>
        </div>

        {/* Metric 2: Indicative Valuation (Shark Panel) */}
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90">
            Indicative Valuation
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <IndianRupee className="h-5 w-5 text-amber-400 shrink-0 self-center" />
            <span className="font-mono text-2xl font-black text-amber-200">
              {metrics.current_valuation.replace('₹', '')}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-amber-300/80 font-mono">
            *Investor estimate based on pitch
          </div>
        </div>

        {/* Metric 3: Funding Requested */}
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Ask (Funding Requested)
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-bold text-neutral-100">
              {metrics.funding_requested}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 font-mono">
            Founder Ask Amount
          </div>
        </div>

        {/* Metric 4: Equity Offered */}
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Equity Offered
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <PieChart className="h-5 w-5 text-neutral-400 shrink-0 self-center mr-0.5" />
            <span className="font-mono text-2xl font-bold text-neutral-100">
              {metrics.equity_offered_percent}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-400 font-mono">
            Founder Dilution
          </div>
        </div>
      </div>
    </div>
  );
};
