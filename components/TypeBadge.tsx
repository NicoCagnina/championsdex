import { TYPE_COLORS, TYPE_TEXT } from '@/lib/typeEffectiveness'

interface Props {
  type: string
  size?: 'xs' | 'sm' | 'md'
}

export function TypeBadge({ type, size = 'sm' }: Props) {
  const bg = TYPE_COLORS[type] ?? '#888'
  const color = TYPE_TEXT[type] ?? '#fff'
  const cls =
    size === 'xs' ? 'text-[8px] px-1.5 py-px' :
    size === 'sm' ? 'text-[9px] px-2 py-0.5' :
    'text-[10px] px-2.5 py-1'

  return (
    <span
      className={`inline-block rounded-full font-bold uppercase tracking-widest font-mono ${cls}`}
      style={{ backgroundColor: bg, color }}
    >
      {type}
    </span>
  )
}
