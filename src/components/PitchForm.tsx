import React from 'react';
import { StartupPitchInput } from '../types';
import { STARTUP_PRESETS } from '../data/presets';
import { Sparkles, ArrowRight, Building, Target, Layers, Cpu, DollarSign, BarChart2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface PitchFormProps {
  pitchData: StartupPitchInput;
  setPitchData: React.Dispatch<React.SetStateAction<StartupPitchInput>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const PitchForm: React.FC<PitchFormProps> = ({
  pitchData,
  setPitchData,
  onSubmit,
  isLoading,
}) => {
  const handlePresetSelect = (presetId: string) => {
    const found = STARTUP_PRESETS.find((p) => p.id === presetId);
    if (found) {
      sound.playHeartbeat();
      setPitchData({ ...found.data });
    }
  };

  const handleChange = (field: keyof StartupPitchInput, value: string | number) => {
    setPitchData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-md p-6 md:p-8 shadow-2xl">
      {/* Preset Selector Banner */}
      <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-300">
              Instant Pitch Archetypes
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            Click to auto-fill authentic pitch scenarios
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {STARTUP_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset.id)}
              className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-amber-500/60 hover:bg-neutral-850 hover:text-white transition-all cursor-pointer"
            >
              <span>{preset.label}</span>
              <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-amber-300/90 font-mono">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Startup Basic Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-amber-400" />
              Startup Name *
            </label>
            <input
              type="text"
              required
              value={pitchData.startup_name}
              onChange={(e) => handleChange('startup_name', e.target.value)}
              placeholder="e.g. LekhaAI, HyperDrop"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              Tagline *
            </label>
            <input
              type="text"
              required
              value={pitchData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="One powerful line describing what you do"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* The Problem & Target Customers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-rose-400" />
              The Problem *
            </label>
            <textarea
              required
              rows={3}
              value={pitchData.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
              placeholder="What urgent pain point are you solving?"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              Target Customers *
            </label>
            <textarea
              required
              rows={3}
              value={pitchData.target_customers}
              onChange={(e) => handleChange('target_customers', e.target.value)}
              placeholder="Who are the ideal buyers / users in India?"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* The Solution & USP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Solution *
            </label>
            <textarea
              required
              rows={3}
              value={pitchData.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              placeholder="How does your product solve the problem?"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              USP (Unique Selling Proposition) *
            </label>
            <textarea
              required
              rows={3}
              value={pitchData.usp}
              onChange={(e) => handleChange('usp', e.target.value)}
              placeholder="Why can't Big Tech or incumbents clone this overnight?"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Business Model & Traction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              Business Model & Pricing *
            </label>
            <textarea
              required
              rows={3}
              value={pitchData.business_model}
              onChange={(e) => handleChange('business_model', e.target.value)}
              placeholder="How do you make money? Pricing tiers, margins, commissions."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
              Traction & Metrics
            </label>
            <textarea
              rows={3}
              value={pitchData.traction}
              onChange={(e) => handleChange('traction', e.target.value)}
              placeholder="Revenue, active users, pilots, LOIs, unit margins. (Leave empty if pre-revenue; Namita will test you!)"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Tech Stack & Ask Amount / Equity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              Tech Stack *
            </label>
            <input
              type="text"
              required
              value={pitchData.tech_stack}
              onChange={(e) => handleChange('tech_stack', e.target.value)}
              placeholder="e.g. FastAPI, TrOCR, Mistral, PGVector"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              Funding Requested (Ask) *
            </label>
            <input
              type="text"
              required
              value={pitchData.ask_amount}
              onChange={(e) => handleChange('ask_amount', e.target.value)}
              placeholder="e.g. ₹50 Lakhs, ₹1.2 Crore"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5 text-amber-400" />
              Equity Offered (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                required
                value={pitchData.equity_percent}
                onChange={(e) => handleChange('equity_percent', e.target.value)}
                placeholder="e.g. 5, 10, 15"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute right-4 top-2.5 text-neutral-500 font-mono text-sm">%</span>
            </div>
          </div>
        </div>

        {/* Submit Pitch Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl ${
              isLoading
                ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black hover:from-amber-400 hover:to-yellow-400 shadow-amber-500/20 hover:shadow-amber-500/40 cursor-pointer active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <span>Simulating Shark Panel Deliberation...</span>
              </>
            ) : (
              <>
                <span className="font-serif">Step Into the Shark Arena</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
