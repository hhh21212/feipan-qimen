export type ThemeKey = 'xianqi' | 'mojin' | 'zhusha' | 'qingci' | 'xuanzhi'

export interface ThemeMeta {
  id: ThemeKey
  label: string
  /** 选择器预览用的代表色（与 index.css 中各主题调色板保持同步） */
  swatches: string[]
}

export const THEMES: ThemeMeta[] = [
  { id: 'xianqi', label: '仙气飘飘', swatches: ['#0a1420', '#c9a96a', '#a89bd4', '#7fb0a8'] },
  { id: 'mojin', label: '玄墨金章', swatches: ['#060606', '#c7a252', '#9a8fa8', '#8aa89b'] },
  { id: 'zhusha', label: '朱砂赤金', swatches: ['#1c0b0e', '#e0a94e', '#d98a6b', '#8fb8a0'] },
  { id: 'qingci', label: '青瓷翡翠', swatches: ['#0a1f1c', '#c9b06a', '#8fb5c9', '#6fd0bd'] },
  { id: 'xuanzhi', label: '宣纸素笺', swatches: ['#f6f0e0', '#a97e32', '#3f7a68', '#8a6a8f'] },
]

export const DEFAULT_THEME: ThemeKey = 'xianqi'

/** 各主题对应的移动端状态栏颜色（<meta name="theme-color">） */
export const THEME_COLORS: Record<ThemeKey, string> = {
  xianqi: '#0d1b2a',
  mojin: '#0c0b09',
  zhusha: '#260f13',
  qingci: '#0e2824',
  xuanzhi: '#f2ecd9',
}
