import { useRef, useState } from 'react'
import { useSettings } from '../core/storage/settings'
import { exportRecords, importRecords, clearRecords } from '../core/storage/db'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { THEMES } from '../theme'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line/70 glass-panel p-3">
      <h3 className="mb-2 text-xs tracking-widest text-gold">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="min-w-0">
        <div className="text-sm text-moon">{label}</div>
        {hint && <div className="text-[11px] text-dim">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-line/70 bg-ink-700 px-2 py-1.5 text-sm text-moon outline-none focus:border-gold/60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-gold/50' : 'bg-ink-600'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-moon transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export function SettingsPage() {
  const { options, update, time, updateTime, theme, setTheme } = useSettings()
  const { canInstall, isIOS, isStandalone, install } = usePWAInstall()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  async function onExport() {
    const json = await exportRecords()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `飞盘奇门记录-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text()
      const n = await importRecords(text)
      setMsg(`已导入 ${n} 条记录`)
    } catch {
      setMsg('导入失败：文件格式不正确')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  async function onClear() {
    if (window.confirm('确定清空全部记录？此操作不可恢复。')) {
      await clearRecords()
      setMsg('已清空全部记录')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 px-3 pb-24 pt-4">
      <h2 className="text-sm text-dim">排盘设置（默认即与热卜对齐的飞盘规则）</h2>

      <Section title="主题">
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => {
            const on = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col gap-1.5 rounded-lg border p-2 text-left transition-colors ${
                  on ? 'border-gold/70 bg-gold/10' : 'border-line/70 hover:border-line'
                }`}
              >
                <span className="flex h-6 overflow-hidden rounded-md">
                  {t.swatches.map((c) => (
                    <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="flex items-center justify-between">
                  <span className={`text-sm ${on ? 'text-gold-soft' : 'text-moon'}`}>{t.label}</span>
                  {on && <span className="text-xs text-gold">✓</span>}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="定局与寄宫">
        <Row label="定局法" hint="置闰法（满 8 天）">
          <span className="text-sm text-gold">置闰</span>
        </Row>
        <Row label="置闰天数">
          <input
            type="number"
            min={1}
            max={15}
            value={options.zhirunDays}
            onChange={(e) => update({ zhirunDays: Number(e.target.value) || 8 })}
            className="w-16 rounded-lg border border-line/70 bg-ink-700 px-2 py-1.5 text-center text-sm text-moon outline-none focus:border-gold/60"
          />
        </Row>
        <Row label="寄宫方式">
          <Select
            value={options.jiGong}
            onChange={(v) => update({ jiGong: v as typeof options.jiGong })}
            options={[
              { value: 'kun2', label: '寄坤二' },
              { value: 'gen8', label: '寄艮八' },
              { value: 'yangGenYinKun', label: '阳寄艮·阴寄坤' },
              { value: 'yangKunYinGen', label: '阳寄坤·阴寄艮' },
            ]}
          />
        </Row>
        <Row label="显示寄宫干" hint="中五宫干寄到目标宫的标注，热卜默认不显示">
          <Toggle on={options.showJiGong} onChange={(v) => update({ showJiGong: v })} />
        </Row>
      </Section>

      <Section title="飞盘要素">
        <Row label="飞盘太常" hint="九神含太常（九神制）">
          <Toggle on={options.useTaiChang} onChange={(v) => update({ useTaiChang: v })} />
        </Row>
        <Row label="暗干起法" hint="参考热卜，默认不显示">
          <Select
            value={options.anGan}
            onChange={(v) => update({ anGan: v as typeof options.anGan })}
            options={[
              { value: 'none', label: '不显示' },
              { value: 'zhishimen', label: '值使门起' },
              { value: 'mendipan', label: '门地盘起' },
            ]}
          />
        </Row>
        <Row label="真太阳时" hint="把北京时间换算为真太阳时（天文学公式）">
          <Toggle on={time.trueSolarTime} onChange={(v) => updateTime({ trueSolarTime: v })} />
        </Row>
        {time.trueSolarTime && (
          <Row label="起局经度" hint="东经为正，默认 120°（北京时间）">
            <input
              type="number"
              step="0.01"
              value={time.longitude}
              onChange={(e) => updateTime({ longitude: Number(e.target.value) || 120 })}
              className="w-20 rounded-lg border border-line/70 bg-ink-700 px-2 py-1.5 text-center text-sm text-moon outline-none focus:border-gold/60"
            />
          </Row>
        )}
      </Section>

      <Section title="数据">
        <Row label="导出记录">
          <button onClick={onExport} className="rounded-lg bg-gold/20 px-3 py-1.5 text-sm text-gold-soft">
            导出 JSON
          </button>
        </Row>
        <Row label="导入记录">
          <button onClick={() => fileRef.current?.click()} className="rounded-lg bg-gold/20 px-3 py-1.5 text-sm text-gold-soft">
            选择文件
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])}
          />
        </Row>
        <Row label="清空记录">
          <button onClick={onClear} className="rounded-lg border border-red-400/40 px-3 py-1.5 text-sm text-red-300">
            清空
          </button>
        </Row>
        {msg && <div className="mt-1 rounded-lg bg-jade/15 px-3 py-2 text-xs text-jade">{msg}</div>}
      </Section>

      <Section title="安装到主屏幕">
        {isStandalone ? (
          <p className="text-sm text-jade">✓ 已以应用方式打开，可离线使用。</p>
        ) : isIOS ? (
          <p className="text-sm leading-6 text-dim">
            在 Safari 中打开本站，点底部「分享」按钮，选择
            <span className="text-gold-soft">「添加到主屏幕」</span>，即可像 App 一样使用并离线访问。
          </p>
        ) : canInstall ? (
          <button
            onClick={install}
            className="rounded-lg bg-gold/20 px-3 py-2 text-sm text-gold-soft"
          >
            安装「飞盘奇门」
          </button>
        ) : (
          <p className="text-sm text-dim">
            用 Chrome / Edge 打开，可通过浏览器菜单「安装应用」添加到主屏幕。
          </p>
        )}
      </Section>

      <p className="px-1 text-center text-[11px] leading-5 text-dim">
        神兽纹样源自开源项目「中国传统纹样图鉴·Wényàng」（CC BY-NC 4.0）
      </p>
    </div>
  )
}
