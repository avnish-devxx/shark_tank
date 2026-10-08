import React from 'react';
import { CrossDebate } from '../types';
import { MessageSquareCode, Swords, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface CrossDebateCardProps {
  debate: CrossDebate;
}

export const CrossDebateCard: React.FC<CrossDebateCardProps> = ({ debate }) => {
  const handlePlayDebate = () => {
    const text = `${debate.speaker} clashes with ${debate.target}: ${debate.message}`;
    sound.speakVerdict(debate.speaker, text);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-neutral-950 via-amber-950/20 to-neutral-950 p-6 shadow-2xl backdrop-blur-md">
      {/* Decorative arena spotlight beam */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
            <Swords className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-bold tracking-wider text-amber-300 uppercase">
                Shark Cross-Debate Ring
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40 animate-pulse">
                LIVE CLASH
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Disagreement between investor theses in the room
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="rounded-lg bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 text-amber-200 font-semibold">
              {debate.speaker}
            </span>
            <span className="text-neutral-500 text-[11px]">⚔️ counters</span>
            <span className="rounded-lg bg-rose-950/80 border border-rose-500/40 px-2.5 py-1 text-rose-200 font-semibold">
              {debate.target}
            </span>
          </div>

          <button
            onClick={handlePlayDebate}
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:border-amber-500 hover:text-amber-200 transition-colors"
            title="Read out cross debate"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Listen</span>
          </button>
        </div>
      </div>

      <div className="relative rounded-xl border border-neutral-800 bg-neutral-950/80 p-5">
        <div className="flex items-start gap-3">
          <MessageSquareCode className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm md:text-base font-serif italic text-neutral-100 leading-relaxed">
              "{debate.message}"
            </p>
            <div className="text-[11px] font-mono text-neutral-400">
              — Direct cross-examination by <span className="text-amber-300 font-semibold">{debate.speaker}</span> targeting <span className="text-rose-300 font-semibold">{debate.target}</span>'s thesis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
