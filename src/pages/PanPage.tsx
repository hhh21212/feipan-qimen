import { useMemo, useState } from 'react'
import { paiPan } from '../core/qimen'
import type { Palace } from '../core/qimen/types'
import { toTrueSolarTime } from '../core/qimen/truesolar'
import { makeRecord } from '../types/record'
import { saveRecord } from '../core/storage/db'
import { useSettings } from '../core/storage/settings'
import { PanGrid } from '../components/PanGrid'
import { PanList } from '../components/PanList'
import { PanSimple } from '../components/PanSimple'
import { PanMeta } from '../components/PanMeta'
import { PalaceSheet } from '../components/PalaceSheet'

type View = 'grid' | 'list' | 'simple'

const VIEWS: { key: View; label: string }[] = [
  { key: 'grid', label: '宫格' },
  { key: 'list', label: '列表' },
  { key: 'simple', label: '简明' },
]

function toInputValue(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function PanPage() {
  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<View>('grid')
  const [selected, setSelected] = useState<Palace | null>(null)
  const [nianMing, setNianMing] = useState('')
  const [subject, setSubject] = useState('')
  const [saved, setSaved] = useState(false)
  const { options, time } = useSettings()

  // 起局时间：可选换算为真太阳时（仅影响输入时间，不改变排盘算法）。
  const effectiveDate = useMemo(() => {
    if (!time.trueSolarTime) return date
    return toTrueSolarTime(date, time.longitude)
  }, [date, time])

  const pan = useMemo(() => {
    const birth = nianMing.trim() ? Number(nianMing.trim()) : undefined
    return paiPan(effectiveDate, options, birth && !Number.isNaN(birth) ? birth : undefined)
  }, [effectiveDate, nianMing, options])

  const { dun } = pan

  async function handleSave() {
    const birth = nianMing.trim() ? Number(nianMing.trim()) : undefined
    const rec = makeRecord(pan, {
      birth: birth && !Number.isNaN(birth) ? birth : undefined,
      nianMing: pan.nianMing,
      subject: subject.trim(),
    })
    await saveRecord(rec)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 px-3 pb-24 pt-4">
      {/* 标题 */}
      <header className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gold/50">✦</span>
          <h1 className="float-slow font-kai text-2xl tracking-[0.25em] text-gold-glow">飞盘奇门</h1>
        </div>
        <span className="text-xs text-dim">
          {dun.jieQi} · {dun.yuan}
        </span>
      </header>

      {/* 顶部：时间 + 年命 */}
      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[11px] text-dim">起局时间</span>
          <input
            type="datetime-local"
            value={toInputValue(date)}
            onChange={(e) => e.target.value && setDate(new Date(e.target.value))}
            className="rounded-lg border border-line/70 bg-ink-800/70 px-2 py-1.5 text-sm text-moon outline-none focus:border-gold/60"
          />
        </label>
        <label className="flex w-24 flex-col gap-1">
          <span className="text-[11px] text-dim">年命(年)</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="如 1985"
            value={nianMing}
            onChange={(e) => setNianMing(e.target.value)}
            className="rounded-lg border border-line/70 bg-ink-800/70 px-2 py-1.5 text-sm text-moon outline-none focus:border-gold/60"
          />
        </label>
      </div>

      {time.trueSolarTime && (
        <div className="rounded-lg border border-mist/20 bg-mist/5 px-3 py-1.5 text-xs text-mist">
          已按真太阳时起局（东经 {time.longitude}°）：{' '}
          {effectiveDate.getFullYear()}-
          {String(effectiveDate.getMonth() + 1).padStart(2, '0')}-
          {String(effectiveDate.getDate()).padStart(2, '0')}{' '}
          {String(effectiveDate.getHours()).padStart(2, '0')}:
          {String(effectiveDate.getMinutes()).padStart(2, '0')}
        </div>
      )}

      {/* 所测 + 保存 */}
      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-[11px] text-dim">所测之事（可选）</span>
          <input
            type="text"
            placeholder="如 问事业、问婚姻"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-lg border border-line/70 bg-ink-800/70 px-2 py-1.5 text-sm text-moon outline-none focus:border-gold/60"
          />
        </label>
        <button
          onClick={handleSave}
          className={`rounded-lg px-4 py-2 text-sm transition-colors ${
            saved ? 'bg-jade/25 text-jade' : 'bg-gold/20 text-gold-soft'
          }`}
        >
          {saved ? '✓ 已保存' : '保存'}
        </button>
      </div>

      {/* 盘头标注：四柱/纳音/节气/旬首/旬空/马星/超神/年命等 */}
      <PanMeta pan={pan} />

      {/* 视图切换 */}
      <div className="flex rounded-lg border border-line/70 bg-ink-800/70 p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${
              view === v.key ? 'bg-gold/20 text-gold-soft' : 'text-dim'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* 视图主体 */}
      {view === 'grid' && <PanGrid palaces={pan.palaces} onSelect={setSelected} />}
      {view === 'list' && <PanList palaces={pan.palaces} onSelect={setSelected} />}
      {view === 'simple' && <PanSimple pan={pan} />}

      <PalaceSheet palace={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
