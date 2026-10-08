import React, { useState } from 'react';
import { PitchEvaluationResult, StartupPitchInput } from '../types';
import { X, Mic, Send, ShieldAlert, ArrowRight, DollarSign, PieChart } from 'lucide-react';
import { sound } from '../utils/audio';

interface RebuttalModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitch: StartupPitchInput;
  evaluation: PitchEvaluationResult;
  onRebuttalSubmit: (defense: string, revisedAsk?: string, revisedEquity?: number | string) => Promise<void>;
  isSubmitting: boolean;
}

export const RebuttalModal: React.FC<RebuttalModalProps> = ({
  isOpen,
  onClose,
  pitch,
  evaluation,
  onRebuttalSubmit,
  isSubmitting,
}) => {
  const [defenseText, setDefenseText] = useState('');
  const [revisedAsk, setRevisedAsk] = useState(pitch.ask_amount);
  const [revisedEquity, setRevisedEquity] = useState(pitch.equity_percent);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defenseText.trim()) return;
    sound.playGavel();
    await onRebuttalSubmit(defenseText, revisedAsk, revisedEquity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-neutral-900 p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Mic className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-100">
              Founder Live Defense & Counter-Offer
            </h2>
            <p className="text-xs text-neutral-400">
              Address the Sharks' critical red flags and adjust your deal terms in real-time
            </p>
          </div>
        </div>

        {/* Overview of current Shark concerns */}
        <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-2.5">
          <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Target Concerns To Overcome</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5">
              <span className="font-semibold text-cyan-400">Aman:</span>
              <p className="text-neutral-300 mt-0.5 line-clamp-2">{evaluation.investors.aman.concern}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5">
              <span className="font-semibold text-amber-400">Namita:</span>
              <p className="text-neutral-300 mt-0.5 line-clamp-2">{evaluation.investors.namita.concern}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5">
              <span className="font-semibold text-purple-400">Peyush:</span>
              <p className="text-neutral-300 mt-0.5 line-clamp-2">{evaluation.investors.peyush.concern}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5">
              Your Founder Rebuttal & Technical/Financial Defense *
            </label>
            <textarea
              required
              rows={4}
              value={defenseText}
              onChange={(e) => setDefenseText(e.target.value)}
              placeholder="e.g. 'Aman, we aren't a simple wrapper—we built a custom TrOCR fine-tune running locally on $250/mo leased GPUs. Namita, our gross margin is 82% and payback is under 21 days...'"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                Revised Ask Amount (Optional)
              </label>
              <input
                type="text"
                value={revisedAsk}
                onChange={(e) => setRevisedAsk(e.target.value)}
                placeholder={pitch.ask_amount}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <PieChart className="h-3.5 w-3.5 text-amber-400" />
                Revised Equity (%) (Optional)
              </label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={revisedEquity}
                onChange={(e) => setRevisedEquity(e.target.value)}
                placeholder={String(pitch.equity_percent)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-neutral-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !defenseText.trim()}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isSubmitting || !defenseText.trim()
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Deliberating...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Live Defense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
