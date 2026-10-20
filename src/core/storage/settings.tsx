import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_OPTIONS, type PaipanOptions } from '../qimen/types'
import { DEFAULT_THEME, THEME_COLORS, type ThemeKey } from '../../theme'

const KEY = 'feipan-settings'
const THEME_KEY = 'feipan-theme'
const THEME_IDS: ThemeKey[] = ['xianqi', 'mojin', 'zhusha', 'qingci', 'xuanzhi']

function load(): PaipanOptions {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT_OPTIONS, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_OPTIONS }
}

/** 时间相关设置（不属于排盘算法配置，只影响起局输入时间的预处理）。 */
export interface TimeSettings {
  /** 是否把输入的北京时间换算为真太阳时 */
  trueSolarTime: boolean
  /** 起局地点经度（东经为正，默认 120 = 北京时间经线） */
  longitude: number
}

export const DEFAULT_TIME: TimeSettings = { trueSolarTime: false, longitude: 120 }

function loadTime(): TimeSettings {
  try {
    const raw = localStorage.getItem('feipan-time')
    if (raw) return { ...DEFAULT_TIME, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_TIME }
}

function loadTheme(): ThemeKey {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw && (THEME_IDS as string[]).includes(raw)) return raw as ThemeKey
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME
}

interface SettingsCtx {
  options: PaipanOptions
  update: (patch: Partial<PaipanOptions>) => void
  time: TimeSettings
  updateTime: (patch: Partial<TimeSettings>) => void
  theme: ThemeKey
  setTheme: (t: ThemeKey) => void
}

const Ctx = createContext<SettingsCtx>({
  options: DEFAULT_OPTIONS,
  update: () => {},
  time: DEFAULT_TIME,
  updateTime: () => {},
  theme: DEFAULT_THEME,
  setTheme: () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<PaipanOptions>(load)
  const [time, setTime] = useState<TimeSettings>(loadTime)
  const [theme, setThemeState] = useState<ThemeKey>(loadTheme)

  const update = (patch: Partial<PaipanOptions>) => {
    setOptions((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const updateTime = (patch: Partial<TimeSettings>) => {
    setTime((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem('feipan-time', JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const setTheme = (t: ThemeKey) => {
    setThemeState(t)
    try {
      localStorage.setItem(THEME_KEY, t)
    } catch {
      /* ignore */
    }
  }

  // 应用主题：给 <html> 加 data-theme，并同步移动端状态栏颜色。
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  return (
    <Ctx.Provider value={{ options, update, time, updateTime, theme, setTheme }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSettings(): SettingsCtx {
  return useContext(Ctx)
}
