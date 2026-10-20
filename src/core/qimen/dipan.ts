import { QI_YI, LUOSHU_SHUN, LUOSHU_NI, jiGongTarget } from './constants'
import type { YinYang, PaipanOptions } from './types'

export interface DiPan {
  /** 宫号 → 本宫地盘干 */
  ganByGong: Record<number, string>
  /** 宫号 → 寄来的干（中五宫干寄到目标宫） */
  jiGanByGong: Record<number, string[]>
  /** 干 → 本位宫号（中五宫干归中五，值符值使需单独处理寄宫） */
  gongByGan: Record<string, number>
  /** 中五寄宫目标宫号 */
  jiGongTarget: number
}

/**
 * 地盘三奇六仪。
 * 依据：戊己庚辛壬癸丁丙乙 固定顺序；甲子戊起「局数」宫，
 * 阳遁顺布、阴遁逆布（洛书序）；中五宫干按寄宫方式寄到目标宫。
 */
export function buildDiPan(yinYang: YinYang, juShu: number, options: PaipanOptions): DiPan {
  const order = yinYang === 'yang' ? LUOSHU_SHUN : LUOSHU_NI
  const ganByGong: Record<number, string> = {}

  const startIdx = order.indexOf(juShu as (typeof order)[number])
  for (let i = 0; i < 9; i++) {
    const gong = order[(startIdx + i) % 9]
    ganByGong[gong] = QI_YI[i]
  }

  // 寄宫：中五宫的干寄到目标宫
  const target = jiGongTarget(options.jiGong, yinYang)
  const zhongGan = ganByGong[5]
  const jiGanByGong: Record<number, string[]> = {}
  jiGanByGong[target] = [zhongGan]

  // 干 → 本位宫号
  const gongByGan: Record<string, number> = {}
  for (const gongStr of Object.keys(ganByGong)) {
    const gong = Number(gongStr)
    gongByGan[ganByGong[gong]] = gong
  }

  return { ganByGong, jiGanByGong, gongByGan, jiGongTarget: target }
}
