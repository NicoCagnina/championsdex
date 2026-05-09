interface Props {
  label: string
  value: number
  max?: number
  accent?: string
}

const STAT_COLORS: Record<string, string> = {
  HP:  '#4ade80',
  ATK: '#f87171',
  DEF: '#60a5fa',
  SpA: '#c084fc',
  SpD: '#34d399',
  VEL: '#fbbf24',
}

export function StatBar({ label, value, max = 255, accent }: Props) {
  const pct = Math.round(Math.min(100, (value / max) * 100))
  const color = accent ?? STAT_COLORS[label] ?? 'var(--accent)'

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="font-mono w-8 shrink-0 text-right" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      <span className="font-mono w-7 shrink-0 text-right" style={{ color: 'var(--text)' }}>
        {value}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
