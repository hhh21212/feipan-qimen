export type TabKey = 'pan' | 'records' | 'settings'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'pan', label: '排盘', icon: '☯' },
  { key: 'records', label: '记录', icon: '☰' },
  { key: 'settings', label: '设置', icon: '⚙' },
]

export function BottomTabs({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-ink-950/90 pb-safe backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on = active === t.key
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                on ? 'tab-glow text-gold' : 'text-dim'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span>{t.label}</span>
              <span
                className={`h-1 w-1 rounded-full transition-all ${
                  on ? 'tab-dot bg-gold' : 'bg-transparent'
                }`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
