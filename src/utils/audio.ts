// Procedural Web Audio API sound generator for Shark Arena studio sound effects
// Does not depend on external sound files; 100% reliable in any browser environment.

class SoundFx {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled() {
    return this.soundEnabled;
  }

  // Dramatic arena entrance / gavel strike
  public playGavel() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.42);

    // Second thud reverb
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(90, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.3);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.36);
    }, 90);
  }

  // Shark "Out" buzzer (harsh, direct)
  public playBuzzer() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(120, ctx.currentTime);
    osc2.frequency.setValueAtTime(124, ctx.currentTime);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.52);
    osc2.stop(ctx.currentTime + 0.52);
  }

  // Deal Offered chime (luxurious, uplifting, golden)
  public playDealChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.82);
      }, idx * 90);
    });
  }

  // Suspense heartbeat when evaluating
  public playHeartbeat() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Speak investor verdict via SpeechSynthesis
  public speakVerdict(investorName: string, text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Customize voice rate & pitch per persona
    if (investorName.toLowerCase().includes('aman')) {
      utterance.pitch = 1.05;
      utterance.rate = 1.08; // crisp, fast-paced tech founder
    } else if (investorName.toLowerCase().includes('namita')) {
      utterance.pitch = 1.15;
      utterance.rate = 0.98; // measured, authoritative, clear
    } else if (investorName.toLowerCase().includes('peyush')) {
      utterance.pitch = 0.92;
      utterance.rate = 0.95; // calm, visionary, grounded
    }

    // Attempt to pick English (India) or general English voice
    const indianVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundFx();
