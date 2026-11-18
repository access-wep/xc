// Web Audio API Synthesizer for subtle crystal harmonic chime sounds
// 100% offline, zero audio file dependencies, respects browser autoplay policies

class AudioChimeService {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  // Play a gentle celestial chime chord upon completing a habit
  playHabitComplete(volume = 0.3) {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime

      // Solfeggio / Harmonic frequencies for rewarding feeling (528Hz and 660Hz)
      const freqs = [528, 660]

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.04)

        // Smooth attack and decay
        gain.gain.setValueAtTime(0, now + idx * 0.04)
        gain.gain.linearRampToValueAtTime(volume * 0.4, now + idx * 0.04 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.5)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.04)
        osc.stop(now + idx * 0.04 + 0.55)
      })
    } catch {
      // Audio playback fails gracefully if muted or not permitted
    }
  }

  // Play a triumphant chord upon completing all daily habits (100% milestone)
  playMilestoneCelebration(volume = 0.35) {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const chord = [528, 660, 792, 1056]

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.08)

        gain.gain.setValueAtTime(0, now + idx * 0.08)
        gain.gain.linearRampToValueAtTime(volume * 0.35, now + idx * 0.08 + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.08)
        osc.stop(now + idx * 0.08 + 0.85)
      })
    } catch {}
  }
}

export const audioChime = new AudioChimeService()
