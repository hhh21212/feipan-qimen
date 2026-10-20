import type { QimenPan } from '../core/qimen/types'

export type ReviewState = 'verified' | 'unverified' | 'partial' | null

export interface QimenRecord {
  id: string
  /** 起局时间（时间戳 ms） */
  createdAt: number
  /** 保存时间（时间戳 ms） */
  savedAt: number
  input: {
    /** 出生年（可选） */
    birth?: number
    /** 年命天干 */
    nianMing: string
    /** 所测之事（可选） */
    subject: string
    /** 性别（可选） */
    gender?: string
  }
  /** 排盘快照 */
  pan: QimenPan
  notes: { text: string; ts: number }[]
  tags: string[]
  starred: boolean
  review: ReviewState
  reviewNote?: string
}

export function makeRecord(pan: QimenPan, input: QimenRecord['input']): QimenRecord {
  return {
    id: genId(),
    createdAt: Date.now(),
    savedAt: Date.now(),
    input,
    pan,
    notes: [],
    tags: [],
    starred: false,
    review: null,
  }
}

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
