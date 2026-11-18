import React from 'react'
import {
  Sun,
  Moon,
  Droplets,
  BookOpen,
  Dumbbell,
  Sparkles,
  PenTool,
  Heart,
  Apple,
  Footprints,
  Languages,
  CalendarCheck,
  Compass,
  Feather,
  Timer,
  CheckSquare,
  Award,
  Flame,
  Target,
  Clock,
  Layers,
  Zap,
} from 'lucide-react'

interface HabitIconProps {
  name: string | null | undefined
  className?: string
  color?: string
}

export const HABIT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun,
  Moon,
  Droplets,
  BookOpen,
  Dumbbell,
  Sparkles,
  PenTool,
  Heart,
  Apple,
  Footprints,
  Languages,
  CalendarCheck,
  Compass,
  Feather,
  Timer,
  CheckSquare,
  Award,
  Flame,
  Target,
  Clock,
  Layers,
  Zap,
}

export function HabitIconRenderer({ name, className = 'w-4 h-4', color }: HabitIconProps) {
  const IconComponent = (name && HABIT_ICON_MAP[name]) || Sparkles
  return <IconComponent className={className} />
}
