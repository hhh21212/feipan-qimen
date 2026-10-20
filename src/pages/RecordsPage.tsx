import { useCallback, useEffect, useState } from 'react'
import type { QimenRecord } from '../types/record'
import type { Palace } from '../core/qimen/types'
import { listRecords, deleteRecord, saveRecord } from '../core/storage/db'
import { PanGrid } from '../components/PanGrid'
import { PanSimple } from '../components/PanSimple'
import { PanMeta } from '../components/PanMeta'
import { PalaceSheet } from '../components/PalaceSheet'

function fmtTime(ts: number) {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function RecordDetail({ rec, onBack }: { rec: QimenRecord; onBack: () => void }) {
  const [selected, setSelected] = useState<Palace | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <button onClick={onBack} className="self-start text-sm text-dim">
        ‹ 返回记录
      </button>
      {rec.input.subject && <div className="text-sm text-mist">所测：{rec.input.subject}</div>}
      <PanMeta pan={rec.pan} />
      <PanGrid palaces={rec.pan.palaces} onSelect={setSelected} />
      <PanSimple pan={rec.pan} />
      <PalaceSheet palace={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export function RecordsPage() {
  const [records, setRecords] = useState<QimenRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<QimenRecord | null>(null)

  const refresh = useCallback(async () => {
    setRecords(await listRecords())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function onDelete(id: string) {
    await deleteRecord(id)
    await refresh()
  }

  async function onStar(rec: QimenRecord) {
    await saveRecord({ ...rec, starred: !rec.starred })
    await refresh()
  }

  if (detail) {
    return (
      <div className="mx-auto max-w-md px-3 pb-24 pt-4">
        <RecordDetail rec={detail} onBack={() => setDetail(null)} />
      </div>
    )
  }

  if (loading) return <div className="px-3 pb-24 pt-16 text-center text-dim">加载中…</div>

  if (!records.length) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 px-3 pb-24 pt-16 text-center">
        <div className="text-4xl opacity-40">☰</div>
        <h2 className="text-lg text-moon">暂无记录</h2>
        <p className="text-sm text-dim">在「排盘」页点「保存」后，记录会出现在这里。</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-1.5 px-3 pb-24 pt-4">
      <h2 className="mb-1 text-sm text-dim">共 {records.length} 条记录</h2>
      {records.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-3 rounded-lg border border-line/70 glass-panel px-3 py-2.5"
        >
          <button onClick={() => setDetail(r)} className="min-w-0 flex-1 text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-moon">
                {r.pan.dun.yinYang === 'yang' ? '阳' : '阴'}遁 {r.pan.dun.juShu} 局
              </span>
              <span className="text-xs text-gold">
                {r.pan.zhiFuStar}·{r.pan.zhiShiGate}
              </span>
              {r.input.subject && <span className="truncate text-xs text-mist">{r.input.subject}</span>}
            </div>
            <div className="mt-0.5 text-[11px] text-dim">
              {fmtTime(r.createdAt)} · {r.pan.fourPillars.day}日 {r.pan.fourPillars.time}时
              {r.input.nianMing && <span> · 命{r.input.nianMing}</span>}
            </div>
          </button>
          <button
            onClick={() => onStar(r)}
            className={`text-lg leading-none ${r.starred ? 'text-gold' : 'text-dim/40'}`}
            aria-label="收藏"
          >
            {r.starred ? '★' : '☆'}
          </button>
          <button onClick={() => onDelete(r.id)} className="text-lg leading-none text-dim/50" aria-label="删除">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
