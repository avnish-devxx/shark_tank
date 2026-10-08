import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PitchEvaluationResult, StartupPitchInput } from './types';
import { STARTUP_PRESETS } from './data/presets';
import { PitchForm } from './components/PitchForm';
import { InvestorCard } from './components/InvestorCard';
import { CrossDebateCard } from './components/CrossDebateCard';
import { MetricsBar } from './components/MetricsBar';
import { RebuttalModal } from './components/RebuttalModal';
import { TermSheetModal } from './components/TermSheetModal';
import { sound } from './utils/audio';
import {
  Volume2,
  VolumeX,
  Swords,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Award,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function App() {
  const [pitchData, setPitchData] = useState<StartupPitchInput>({
    ...STARTUP_PRESETS[0].data,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string }[]>([]);
  const [isNegotiating, setIsNegotiating] = useState(false);

  const handleCounterOffer = async (investorId: string) => {
    if (!replyText.trim()) return;
    setIsNegotiating(true);
    try {
      const res = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchData,
          investorId,
          userMessage: replyText,
        }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: 'You', text: replyText },
        { sender: investorId, text: data.reply },
      ]);
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsNegotiating(false);
    }
  };

  const [isSubmittingRebuttal, setIsSubmittingRebuttal] = useState(false);
  const [evaluation, setEvaluation] = useState<PitchEvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'stage' | 'arena' | 'moats'>('stage');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isRebuttalOpen, setIsRebuttalOpen] = useState(false);
  const [isTermSheetOpen, setIsTermSheetOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    sound.setSoundEnabled(!nextState);
  };

  // --- Real-Time Valuation Calculator State ---
  const askAmount = parseFloat(pitchData?.ask_amount || '0');
  const askEquity = parseFloat(String(pitchData?.equity_percent || '0'));
  const calculatedValuation = askEquity > 0 ? ((askAmount / askEquity) * 100).toFixed(2) : '0';

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ec4899'],
    });
  };

  const handleEvaluatePitch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    sound.playGavel();

    const intervalId = setInterval(() => {
      sound.playHeartbeat();
    }, 1200);

    try {
      const res = await fetch('/api/evaluate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pitchData),
      });

      clearInterval(intervalId);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Evaluation failed with status ${res.status}`);
      }

      const result: PitchEvaluationResult = await res.json();
      setEvaluation(result);
      setActiveTab('arena');

      if (result.metrics.deal_status === 'Deal Offered') {
        sound.playDealChime();
        fireConfetti();
      } else if (result.metrics.deal_status === 'Rejected') {
        sound.playBuzzer();
      } else {
        sound.playGavel();
      }
    } catch (err: any) {
      clearInterval(intervalId);
      console.error(err);
      setErrorMessage(err.message || 'Failed to simulate pitch evaluation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRebuttalSubmit = async (defense: string, revisedAsk?: string, revisedEquity?: number | string) => {
    if (!evaluation) return;
    setIsSubmittingRebuttal(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/rebuttal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitch: pitchData,
          previous_result: evaluation,
          founder_defense: defense,
          revised_ask: revisedAsk,
          revised_equity: revisedEquity,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to evaluate live defense.');
      }

      const updatedResult: PitchEvaluationResult = await res.json();
      setEvaluation(updatedResult);
      setIsRebuttalOpen(false);

      if (updatedResult.metrics.deal_status === 'Deal Offered') {
        sound.playDealChime();
        fireConfetti();
      } else if (updatedResult.metrics.deal_status === 'Rejected') {
        sound.playBuzzer();
      } else {
        sound.playGavel();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to submit counter-defense.');
    } finally {
      setIsSubmittingRebuttal(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setActiveTab('stage');
    sound.stopSpeaking();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Broadcast Television Top Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 p-0.5 border border-amber-500/40">
                <span className="text-2xl animate-pulse">🦈</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  SHARK ARENA
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30 uppercase font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AI Panel Live
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block font-mono">
                Aman (Tech) • Namita (Unit Economics) • Peyush (Product & Vision)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {evaluation && (
              <div className="hidden md:flex rounded-xl border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur-md shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('arena')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                    activeTab === 'arena'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Live Deliberation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('stage')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                    activeTab === 'stage'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Edit Pitch
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('moats')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                    activeTab === 'moats'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Moat Breakdown
                </button>
              </div>
            )}

            <button
              onClick={toggleSound}
              type="button"
              className={`rounded-xl border p-2.5 transition-all duration-300 ${
                isSoundMuted
                  ? 'border-neutral-800 bg-neutral-900 text-neutral-500'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 shadow-md shadow-amber-500/10'
              }`}
              title={isSoundMuted ? 'Sound muted' : 'Arena sounds enabled'}
            >
              {isSoundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {evaluation && (
              <button
                onClick={handleReset}
                type="button"
                className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-bold text-neutral-300 hover:border-neutral-700 hover:text-white transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Pitch</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Pitch Arena Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 z-10">
        {errorMessage && (
          <div className="rounded-2xl border border-rose-500/50 bg-rose-950/40 backdrop-blur-md p-4 text-xs text-rose-200 flex items-center justify-between shadow-lg shadow-rose-950/50">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-400" />
              {errorMessage}
            </span>
            <button
              onClick={() => setErrorMessage(null)}
              className="font-bold underline ml-4 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Stage View */}
        {activeTab === 'stage' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" /> AI Powered Investor Pitch Arena
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white">
                Enter The Shark Tank
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Pitch your startup to three distinct Indian investor personas. They will scrutinize your tech moat, unit economics, and product-market fit.
              </p>
            </div>

            {/* Creative Real-Time Valuation Card */}
            <div className="relative group rounded-3xl border border-amber-500/30 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-900/90 p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-amber-500/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                      Live Valuation Matrix
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Calculated from Ask: <strong className="text-white">₹{pitchData?.ask_amount || '0'} Lakhs</strong> for <strong className="text-amber-300">{pitchData?.equity_percent || '0'}% Equity</strong>
                  </p>
                </div>

                <div className="bg-neutral-950/80 border border-amber-500/20 px-5 py-2.5 rounded-2xl text-right shadow-inner">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Implied Post-Money Valuation</span>
                  <span className="font-mono text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                    ₹{calculatedValuation} Lakhs
                  </span>
                </div>
              </div>
            </div>

            <PitchForm
              pitchData={pitchData}
              setPitchData={setPitchData}
              onSubmit={handleEvaluatePitch}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Tab 2: Arena Deliberation Room */}
        {activeTab === 'arena' && evaluation && (
          <div className="space-y-8 relative">
            {/* Dynamic Stamp Overlay (Deal Offered vs Rejected) */}
            {evaluation.metrics.deal_status === 'Deal Offered' && (
              <div className="pointer-events-none absolute top-12 right-6 z-30 transform rotate-12 opacity-90 animate-bounce">
                <div className="border-4 border-emerald-400 text-emerald-400 font-black text-2xl px-6 py-2 rounded-2xl uppercase tracking-widest bg-black/60 backdrop-blur-md shadow-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                  DEAL OFFERED
                </div>
              </div>
            )}
            {evaluation.metrics.deal_status === 'Rejected' && (
              <div className="pointer-events-none absolute top-12 right-6 z-30 transform -rotate-12 opacity-90">
                <div className="border-4 border-rose-500 text-rose-500 font-black text-2xl px-6 py-2 rounded-2xl uppercase tracking-widest bg-black/60 backdrop-blur-md shadow-2xl flex items-center gap-2">
                  <XCircle className="h-7 w-7 text-rose-500" />
                  I'M OUT
                </div>
              </div>
            )}

            {/* Startup Banner Title */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-xl shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Live Pitch Session
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Session #{Math.floor(Math.random() * 800) + 100}
                  </span>
                </div>
                <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-white mt-1">
                  {pitchData.startup_name}
                </h1>
                <p className="text-sm text-neutral-300 italic mt-0.5">{pitchData.tagline}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRebuttalOpen(true)}
                  type="button"
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Swords className="h-4 w-4" />
                  <span>Founder Rebuttal</span>
                </button>

                <button
                  onClick={() => setActiveTab('stage')}
                  type="button"
                  className="rounded-2xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  Edit Pitch
                </button>
              </div>
            </div>

            <MetricsBar
              metrics={evaluation.metrics}
              onOpenTermSheet={() => setIsTermSheetOpen(true)}
              onOpenRebuttal={() => setIsRebuttalOpen(true)}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-400" />
                  <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    The Investor Pods
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  3 Personas deliberating
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InvestorCard
                  id="aman"
                  data={evaluation.investors.aman}
                  isDebateSpeaker={evaluation.cross_debate.speaker.toLowerCase().includes('aman')}
                  isDebateTarget={evaluation.cross_debate.target.toLowerCase().includes('aman')}
                />
                <InvestorCard
                  id="namita"
                  data={evaluation.investors.namita}
                  isDebateSpeaker={evaluation.cross_debate.speaker.toLowerCase().includes('namita')}
                  isDebateTarget={evaluation.cross_debate.target.toLowerCase().includes('namita')}
                />
                <InvestorCard
                  id="peyush"
                  data={evaluation.investors.peyush}
                  isDebateSpeaker={evaluation.cross_debate.speaker.toLowerCase().includes('peyush')}
                  isDebateTarget={evaluation.cross_debate.target.toLowerCase().includes('peyush')}
                />
              </div>
            </div>

            <CrossDebateCard debate={evaluation.cross_debate} />

            {/* Creative Live Negotiation Box */}
            <div className="rounded-3xl border border-amber-500/30 bg-neutral-900/80 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <h3 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Live Counter Offer & Negotiation
                  </h3>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[10px] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active Discussion
                </span>
              </div>
              
              <div className="mb-4 space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {chatHistory.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center">
                    <p className="text-xs text-neutral-400 italic">No counter offers sent yet. Type a counter offer below to negotiate live with the sharks.</p>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`text-xs p-3 rounded-2xl transition-all ${msg.sender === 'You' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 ml-8 shadow-md' : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700 mr-8 shadow-md'}`}>
                      <span className="font-bold text-amber-400 block mb-0.5">{msg.sender}</span>
                      {msg.text}
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. I can offer 8% equity for ₹50 Lakhs..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-neutral-950 text-xs text-white px-4 py-3 rounded-2xl border border-neutral-800 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  onClick={() => handleCounterOffer('Shark')}
                  disabled={isNegotiating}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold px-5 py-3 rounded-2xl disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {isNegotiating ? 'Thinking...' : 'Send Counter'}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="font-serif text-base font-bold text-white">
                  Want to defend your valuation or explain your moat?
                </h3>
                <p className="text-xs text-neutral-400">
                  Step back into the circle. Founders can offer concessions, clarify unit economics, and test if Namita or Aman will change their stance.
                </p>
              </div>

              <button
                onClick={() => setIsRebuttalOpen(true)}
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <span>Take The Mic</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Moat Breakdown */}
        {activeTab === 'moats' && evaluation && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Startup Defensibility Matrix
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Comparative audit across Technical IP, Financial Resilience, and Product Friction
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('arena')}
                  type="button"
                  className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
                >
                  ← Back to Deliberation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-cyan-400 font-serif font-bold text-base">
                    <Cpu className="h-5 w-5" />
                    <span>Aman's Tech Moat Audit</span>
                  </div>
                  <div className="text-xs text-neutral-300 space-y-2.5">
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Tech Stack Tested</span>
                      <strong className="text-white font-mono">{pitchData.tech_stack}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Verified Strength</span>
                      <p className="text-emerald-300">{evaluation.investors.aman.strength}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Red Flag</span>
                      <p className="text-rose-300">{evaluation.investors.aman.concern}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                    <TrendingUp className="h-5 w-5" />
                    <span>Namita's Financial Ledger</span>
                  </div>
                  <div className="text-xs text-neutral-300 space-y-2.5">
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Indicative Valuation</span>
                      <strong className="text-amber-300 font-mono">{evaluation.metrics.current_valuation}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Business Model Viability</span>
                      <p className="text-emerald-300">{evaluation.investors.namita.strength}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Burn Risk</span>
                      <p className="text-rose-300">{evaluation.investors.namita.concern}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-purple-400 font-serif font-bold text-base">
                    <Sparkles className="h-5 w-5" />
                    <span>Peyush's Product Fit Lens</span>
                  </div>
                  <div className="text-xs text-neutral-300 space-y-2.5">
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Customer Pain & USP</span>
                      <strong className="text-white">{pitchData.usp}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Product & Brand Moat</span>
                      <p className="text-emerald-300">{evaluation.investors.peyush.strength}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-mono uppercase text-[10px] block">Friction Point</span>
                      <p className="text-rose-300">{evaluation.investors.peyush.concern}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <RebuttalModal
        isOpen={isRebuttalOpen}
        onClose={() => setIsRebuttalOpen(false)}
        pitch={pitchData}
        evaluation={evaluation!}
        onRebuttalSubmit={handleRebuttalSubmit}
        isSubmitting={isSubmittingRebuttal}
      />

      {evaluation && (
        <TermSheetModal
          isOpen={isTermSheetOpen}
          onClose={() => setIsTermSheetOpen(false)}
          pitch={pitchData}
          evaluation={evaluation}
        />
      )}

      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-600 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Shark Arena • Multi-Agent AI Investor Panel Simulator</span>
          <span>Simulated for Tech Moats, Unit Economics & Founder Pitching</span>
        </div>
      </footer>
    </div>
  );
}  