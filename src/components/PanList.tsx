import type { Palace } from '../core/qimen/types'

function markers(p: Palace): string {
  const m: string[] = []
  if (p.isZhiFu) m.push('值符')
  if (p.isZhiShi) m.push('值使')
  if (p.isKongWang) m.push('空亡')
  if (p.isMaXing) m.push('马星')
  if (p.isNianMing) m.push('年命')
  return m.join('·')
}

export function PanList({ palaces, onSelect }: { palaces: Palace[]; onSelect: (p: Palace) => void }) {
  const ordered = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => palaces.find((p) => p.gong === g)!)
  return (
    <div className="flex flex-col gap-1.5">
      {ordered.map((p) => (
        <button
          key={p.gong}
          onClick={() => onSelect(p)}
          className="flex items-center gap-3 rounded-lg border border-line/70 glass-panel px-3 py-2 text-left transition-colors active:bg-ink-700"
        >
          <span className="w-9 shrink-0 text-sm text-dim">{p.name}</span>
          <span className="w-10 shrink-0 text-gold">{p.star}</span>
          <span className="w-10 shrink-0 text-moon">
            {p.gate || '—'}
            {p.gateTag && <span className="text-[10px] font-semibold text-gold-bright"> {p.gateTag}</span>}
          </span>
          <span className="w-16 shrink-0 text-mist">
            {p.god}
            {p.diGod && <span className="text-dim/80">·{p.diGod}</span>}
          </span>
          <span className="shrink-0 text-gold-soft">
            {p.tianGan}
            {p.tianGanTags.length > 0 && (
              <span className="ml-0.5 text-[10px] font-semibold text-gold-bright">{p.tianGanTags.join('·')}</span>
            )}
            <span className="ml-1 text-xs text-dim">
              {p.diGan}
              {p.diGanTags.length > 0 && (
                <span className="ml-0.5 text-[10px] font-semibold text-gold-bright">{p.diGanTags.join('·')}</span>
              )}
            </span>
            {p.jiGan.length > 0 && <span className="ml-1 text-[10px] text-dim/70">寄{p.jiGan.join('')}</span>}
          </span>
          <span className="ml-auto truncate text-[11px] text-dim">{markers(p)}</span>
          {p.wangShuai && <span className="shrink-0 text-[11px] text-dim/80">{p.wangShuai}</span>}
        </button>
      ))}
    </div>
  )
}
