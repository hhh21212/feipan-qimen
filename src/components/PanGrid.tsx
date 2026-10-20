import type { Palace } from '../core/qimen/types'

/** 洛书九宫格布局（上排巽4·离9·坤2，中排震3·中5·兑7，下排艮8·坎1·乾6） */
const GRID_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6]

function Markers({ p }: { p: Palace }) {
  const tags: { label: string; cls: string }[] = []
  if (p.isZhiFu) tags.push({ label: '符', cls: 'bg-gold/20 text-gold-soft' })
  if (p.isZhiShi) tags.push({ label: '使', cls: 'bg-jade/20 text-jade' })
  if (p.isKongWang) tags.push({ label: '空亡', cls: 'border border-dashed border-dim/60 text-dim' })
  if (p.isMaXing) tags.push({ label: '马', cls: 'bg-mist/20 text-mist twinkle' })
  if (p.isNianMing) tags.push({ label: '命', cls: 'bg-moon/15 text-moon' })
  if (!tags.length) return null
  return (
    <div className="mt-1 flex flex-wrap justify-center gap-0.5">
      {tags.map((t) => (
        <span key={t.label} className={`rounded px-1 text-[10px] leading-4 ${t.cls}`}>
          {t.label}
        </span>
      ))}
    </div>
  )
}

function Cell({ p, onSelect }: { p: Palace; onSelect: (p: Palace) => void }) {
  const isZhong = p.gong === 5
  return (
    <button
      onClick={() => onSelect(p)}
      className={`glass-cell relative flex flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-transform active:scale-95 ${
        isZhong ? 'border-gold/40' : 'border-line/70'
      } ${p.isZhiFu ? 'breathe-zf' : ''} ${p.isZhiShi ? 'breathe-zs' : ''} ${
        p.isKongWang ? 'kong-wang border-dim/50' : ''
      }`}
    >
      <span className="text-[10px] leading-4 text-dim">{p.name}</span>
      <span className="text-sm leading-5 text-gold">{p.star || '—'}</span>
      <span className="text-sm leading-5 text-moon">
        {p.gate || '　'}
        {p.gateTag && <span className="ml-0.5 text-[10px] font-semibold text-gold-bright">{p.gateTag}</span>}
      </span>
      <span className="text-xs leading-4 text-mist">
        {p.god || '—'}
        {p.diGod && <span className="text-dim/80">·{p.diGod}</span>}
      </span>
      <span className="mt-0.5 flex items-baseline gap-1">
        <span className="text-lg leading-6 text-gold-soft">
          {p.tianGan}
          {p.tianGanTags.length > 0 && (
            <span className="ml-0.5 text-[10px] font-semibold text-gold-bright">{p.tianGanTags.join('·')}</span>
          )}
        </span>
        <span className="text-xs leading-5 text-dim">
          {p.diGan}
          {p.diGanTags.length > 0 && (
            <span className="ml-0.5 text-[10px] font-semibold text-gold-bright">{p.diGanTags.join('·')}</span>
          )}
        </span>
      </span>
      {p.jiGan.length > 0 && (
        <span className="text-[10px] leading-3 text-dim/70">寄{p.jiGan.join('')}</span>
      )}
      <Markers p={p} />
      {p.wangShuai && (
        <span className="absolute bottom-0.5 right-1 text-[10px] leading-3 text-dim/80">{p.wangShuai}</span>
      )}
    </button>
  )
}

export function PanGrid({ palaces, onSelect }: { palaces: Palace[]; onSelect: (p: Palace) => void }) {
  const byGong = new Map(palaces.map((p) => [p.gong, p]))
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {GRID_ORDER.map((gong) => (
        <Cell key={gong} p={byGong.get(gong)!} onSelect={onSelect} />
      ))}
    </div>
  )
}
