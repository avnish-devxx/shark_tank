import React from 'react';
import { PitchEvaluationResult, StartupPitchInput } from '../types';
import { X, Check, Copy, Download, Award, ShieldCheck, IndianRupee } from 'lucide-react';

interface TermSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitch: StartupPitchInput;
  evaluation: PitchEvaluationResult;
}

export const TermSheetModal: React.FC<TermSheetModalProps> = ({
  isOpen,
  onClose,
  pitch,
  evaluation,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const activeInvestors = [
    evaluation.investors.aman.status !== 'Out' ? evaluation.investors.aman : null,
    evaluation.investors.namita.status !== 'Out' ? evaluation.investors.namita : null,
    evaluation.investors.peyush.status !== 'Out' ? evaluation.investors.peyush : null,
  ].filter(Boolean);

  const termSheetText = `================================================
SHARK ARENA — OFFICIAL TERM SHEET (INDICATIVE)
================================================
Startup Name: ${pitch.startup_name}
Sector: ${pitch.tagline}
Deal Status: ${evaluation.metrics.deal_status.toUpperCase()}

1. CAPITAL & VALUATION:
- Capital Commitment: ${evaluation.metrics.funding_requested}
- Equity Allocation: ${evaluation.metrics.equity_offered_percent}% (Ordinary / Preference Shares)
- Indicative Valuation: ${evaluation.metrics.current_valuation}

2. PARTICIPATING SYNDICATE INVESTORS:
${activeInvestors.map((inv) => `- ${inv?.name} (${inv?.role}) — Status: ${inv?.status} [Interest: ${inv?.interest_score}/100]`).join('\n')}

3. KEY COVENANTS & MOATS:
- Tech Architecture Moat: ${evaluation.investors.aman.strength}
- Financial & Unit Economics: ${evaluation.investors.namita.strength}
- Product & Brand Roadmap: ${evaluation.investors.peyush.strength}

4. GOVERNANCE & OBSERVER:
- One Board Observer seat reserved for the participating Syndicate.
- Quarterly audit on Gross Margin, Server/Inference Costs, and CAC Payback.

Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Issued by: Shark Arena Multi-Agent Investment Panel
================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(termSheetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([termSheetText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pitch.startup_name.toLowerCase().replace(/\s+/g, '_')}_shark_arena_term_sheet.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/50 bg-neutral-900 p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Official Seal */}
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-5 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold tracking-wide text-neutral-100">
                Official Shark Arena Term Sheet
              </h2>
              <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                {evaluation.metrics.deal_status}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Indicative syndication terms approved by the multi-agent investor panel
            </p>
          </div>
        </div>

        {/* Paper Contract View */}
        <div className="rounded-xl border border-amber-500/30 bg-neutral-950 p-5 font-mono text-xs leading-relaxed text-neutral-300 max-h-96 overflow-y-auto space-y-4">
          <div className="border-b border-neutral-800 pb-3 flex justify-between items-center text-neutral-400">
            <span>STARTUP: <strong className="text-white">{pitch.startup_name}</strong></span>
            <span>DATE: {new Date().toLocaleDateString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-900/60 p-3 rounded-lg border border-neutral-800">
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Capital Offered:</span>
              <div className="text-emerald-400 font-bold text-base">{evaluation.metrics.funding_requested}</div>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Equity Stake:</span>
              <div className="text-amber-400 font-bold text-base">{evaluation.metrics.equity_offered_percent}%</div>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Indicative Valuation:</span>
              <div className="text-cyan-400 font-bold text-base">{evaluation.metrics.current_valuation}</div>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] uppercase">Overall Sentiment:</span>
              <div className="text-purple-400 font-bold text-base">{evaluation.metrics.overall_sentiment_score}/100</div>
            </div>
          </div>

          <div>
            <div className="text-amber-400 font-bold mb-1.5 uppercase text-[11px]">Syndicate Signatures:</div>
            <div className="space-y-1.5">
              {activeInvestors.map((inv) => (
                <div key={inv?.name} className="flex items-center justify-between bg-neutral-900/40 px-3 py-1.5 rounded border border-neutral-800">
                  <span className="text-neutral-200">✍️ {inv?.name} ({inv?.role})</span>
                  <span className="text-emerald-400 text-[10px] font-bold">VERIFIED ({inv?.status})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-neutral-500 leading-normal border-t border-neutral-800/80 pt-3">
            * NOTICE: This term sheet is an indicative investment simulator produced by the multi-agent AI investor panel. Valuation is an investor-style indicative estimate and does not represent a legally binding offer or factual market audit.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Ready for Founders & Advisory</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-bold text-neutral-200 hover:border-amber-500 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              type="button"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-md hover:from-amber-400 hover:to-yellow-400 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
