import React, { useState } from 'react';
import { InvestorEvaluation, InvestorStatus } from '../types';
import { Volume2, VolumeX, CheckCircle2, AlertTriangle, Cpu, TrendingUp, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface InvestorCardProps {
  id: 'aman' | 'namita' | 'peyush';
  data: InvestorEvaluation;
  isDebateSpeaker?: boolean;
  isDebateTarget?: boolean;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({
  id,
  data,
  isDebateSpeaker,
  isDebateTarget,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const personaMeta = {
    aman: {
      title: 'Aman',
      tagline: 'Tech & Scalability Specialist',
      archetype: 'The Tech Architect',
      icon: Cpu,
      themeColor: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      accentText: 'text-cyan-400',
      avatarBg: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
      avatarInitials: 'AG',
      quoteBadge: 'Tech Moat & Code Audit',
    },
    namita: {
      title: 'Namita',
      tagline: 'Unit Economics & Financial Risk Specialist',
      archetype: 'The Balance Sheet Shark',
      icon: TrendingUp,
      themeColor: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      accentText: 'text-amber-400',
      avatarBg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
      avatarInitials: 'NT',
      quoteBadge: 'Margins & CAC Payback',
    },
    peyush: {
      title: 'Peyush',
      tagline: 'Product & Vision Specialist',
      archetype: 'The Product Visionary',
      icon: Sparkles,
      themeColor: 'from-purple-500/20 via-violet-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      accentText: 'text-purple-400',
      avatarBg: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
      avatarInitials: 'PB',
      quoteBadge: 'Frictionless CX & Moat',
    },
  }[id];

  const getStatusBadge = (status: InvestorStatus) => {
    switch (status) {
      case 'Impressed':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20',
          dot: 'bg-emerald-400',
          label: 'IMPRESSED',
        };
      case 'Active':
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-blue-500/20',
          dot: 'bg-blue-400',
          label: 'ACTIVE IN DEAL',
        };
      case 'Skeptical':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20',
          dot: 'bg-amber-400',
          label: 'SKEPTICAL',
        };
      case 'Out':
      default:
        return {
          bg: 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-rose-500/30',
          dot: 'bg-rose-400',
          label: "I'M OUT",
        };
    }
  };

  const statusBadge = getStatusBadge(data.status);
  const IconComponent = personaMeta.icon;

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      sound.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = `${data.name} speaking: ${data.feedback}. Main concern: ${data.concern}`;
      sound.speakVerdict(data.name, text);
      // Auto reset after rough duration
      const wordCount = text.split(' ').length;
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, (wordCount / 2.5) * 1000);
    }
  };

  const isOut = data.status === 'Out';

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border bg-neutral-900/90 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:translate-y-[-2px] ${
        isOut
          ? 'border-rose-950/70 bg-gradient-to-b from-rose-950/20 via-neutral-950/80 to-neutral-950 opacity-90'
          : `${personaMeta.borderColor} bg-gradient-to-b ${personaMeta.themeColor}`
      } ${isDebateSpeaker ? 'ring-2 ring-amber-400/80 shadow-amber-500/20' : ''} ${
        isDebateTarget ? 'ring-2 ring-rose-400/80 shadow-rose-500/20' : ''
      }`}
    >
      {/* Header highlight tags if in live debate */}
      {isDebateSpeaker && (
        <div className="absolute -top-3 left-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-0.5 text-[11px] font-bold tracking-wider text-black shadow-md uppercase">
          ⚔️ Debate Speaker
        </div>
      )}
      {isDebateTarget && (
        <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-rose-600 to-red-600 px-3 py-0.5 text-[11px] font-bold tracking-wider text-white shadow-md uppercase">
          🎯 Under Cross-Fire
        </div>
      )}

      <div>
        {/* Investor Profile Top Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-bold text-xl shadow-inner ${personaMeta.avatarBg}`}
            >
              <span>{personaMeta.avatarInitials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold tracking-wide text-neutral-100">
                  {data.name}
                </h3>
                <IconComponent className={`h-4 w-4 ${personaMeta.accentText}`} />
              </div>
              <p className="text-xs text-neutral-400 font-medium">{data.role}</p>
              <span className="text-[10px] tracking-wider uppercase font-mono text-neutral-500">
                {personaMeta.quoteBadge}
              </span>
            </div>
          </div>

          {/* Voice Speech synthesis button */}
          <button
            onClick={handleAudioToggle}
            type="button"
            title={`Listen to ${data.name}'s verdict`}
            className={`rounded-xl border p-2.5 transition-colors ${
              isPlayingAudio
                ? 'border-amber-400 bg-amber-500/20 text-amber-300 animate-pulse'
                : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Score & Status Bar */}
        <div className="my-5 rounded-xl border border-neutral-800/80 bg-neutral-950/70 p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Interest Score
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-extrabold tracking-tight text-white">
                  {data.interest_score}
                </span>
                <span className="font-mono text-xs text-neutral-500">/100</span>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold tracking-wider shadow-sm uppercase ${statusBadge.bg}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusBadge.dot} ${data.status !== 'Out' ? 'animate-ping' : ''}`} />
              <span>{statusBadge.label}</span>
            </div>
          </div>

          {/* Score Visual Progress Bar */}
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                data.interest_score >= 76
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : data.interest_score >= 56
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                  : data.interest_score >= 31
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-600 to-red-500'
              }`}
              style={{ width: `${Math.max(4, Math.min(100, data.interest_score))}%` }}
            />
          </div>
        </div>

        {/* Feedback Quote Block */}
        <div className="mb-4 rounded-xl border border-neutral-800/60 bg-neutral-950/50 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Verdict
          </div>
          <p className="text-sm leading-relaxed text-neutral-200 italic font-sans">
            "{data.feedback}"
          </p>
        </div>

        {/* Strengths and Concerns */}
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Key Strength</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">{data.strength}</p>
          </div>

          <div
            className={`rounded-xl border p-3 ${
              isOut
                ? 'border-rose-900/60 bg-rose-950/30'
                : 'border-amber-900/40 bg-amber-950/20'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold mb-1 ${
                isOut ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Critical Concern</span>
            </div>
            <p
              className={`text-xs leading-relaxed font-sans ${
                isOut ? 'text-rose-100/90' : 'text-amber-100/90'
              }`}
            >
              {data.concern}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-neutral-800/80 pt-3 text-[11px] text-neutral-500 flex justify-between items-center font-mono">
        <span>PERSPECTIVE: {personaMeta.archetype}</span>
        <span className={statusBadge.bg.split(' ')[1]}>{data.status}</span>
      </div>
    </div>
  );
};
