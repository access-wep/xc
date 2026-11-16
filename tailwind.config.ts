import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // FEKRTO CREATIVE UNIVERSE Palette
        fekrto: {
          midnight: '#020617',
          navy: '#050b18',
          deep: '#0a1128',
          emerald: '#10b981',
          emeraldGlow: '#00f5a0',
          mint: '#34d399',
          electric: '#00d2ff',
          cyan: '#38bdf8',
          purple: '#8b5cf6',
          purpleGlow: '#a855f7',
          gold: '#f59e0b',
          goldGlow: '#fbbf24',
        },
        // Semantic colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        // Cosmic space & neon spatial colors
        cosmic: {
          950: '#020617',
          900: '#030712',
          850: '#050b1d',
          800: '#0a1026',
          700: '#11183c',
        },
        neon: {
          cyan: '#22d3ee',
          cyanGlow: '#06b6d4',
          indigo: '#818cf8',
          indigoGlow: '#6366f1',
          purple: '#c084fc',
          purpleGlow: '#a855f7',
          emerald: '#34d399',
          emeraldGlow: '#10b981',
          amber: '#fbbf24',
          amberGlow: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'Cairo', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'spatial-sm': '0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'spatial-md': '0 8px 30px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'spatial-lg': '0 20px 40px -6px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'neon-indigo': '0 0 25px -3px rgba(99, 102, 241, 0.4), 0 0 10px -2px rgba(99, 102, 241, 0.3)',
        'neon-cyan': '0 0 25px -3px rgba(34, 211, 238, 0.4), 0 0 10px -2px rgba(34, 211, 238, 0.3)',
        'neon-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.4), 0 0 10px -2px rgba(16, 185, 129, 0.3)',
        'neon-amber': '0 0 25px -3px rgba(245, 158, 11, 0.4), 0 0 10px -2px rgba(245, 158, 11, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'spin-orbit': 'spinOrbit 20s linear infinite',
        'spin-orbit-reverse': 'spinOrbitReverse 25s linear infinite',
        'nebula-pulse': 'nebulaPulse 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        spinOrbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        spinOrbitReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        nebulaPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;
