import { STARS, GATES, GODS_YANG, GODS_YIN, LUOSHU_SHUN, LUOSHU_NI, MA_XING, ZHI_GONG } from './constants'
import type { DiPan } from './dipan'
import type { YinYang } from './types'

/**
 * 九门飞布循环序（飞盘含中门，按本位宫 1..9 排列）。
 * 休门(1)→死门(2)→伤门(3)→杜门(4)→中门(5)→开门(6)→惊门(7)→生门(8)→景门(9)。
 */
const GATE_CYCLE_9 = ['休门', '死门', '伤门', '杜门', '中门', '开门', '惊门', '生门', '景门'] as const
/** 八门循环序（不用中门时，门不入中五宫）。 */
const GATE_CYCLE_8 = ['休门', '死门', '伤门', '杜门', '开门', '惊门', '生门', '景门'] as const

/**
 * 九星飞布（顺飞）。
 * 依据：值符星随「时干」落宫；其余星按本位宫序（蓬→芮→冲→辅→禽→心→柱→任→英）
 * 依次落洛书顺飞的下一个宫。用户确认：星门都顺飞（无论阴阳遁）。
 */
export function feiStars(zhiFuStar: string, shiGanGong: number): Record<number, string> {
  const zhiFu = STARS.find((s) => s.name === zhiFuStar)
  if (!zhiFu) throw new Error(`未知值符星：${zhiFuStar}`)
  const p = zhiFu.gong // 值符星本位宫（1-9，即星序位置）
  const idx = LUOSHU_SHUN.indexOf(shiGanGong as (typeof LUOSHU_SHUN)[number])

  const result: Record<number, string> = {}
  for (const s of STARS) {
    const offset = (s.gong - p + 9) % 9 // 相对值符星的星序步长
    const gong = LUOSHU_SHUN[(idx + offset) % 9]
    result[gong] = s.name
  }
  return result
}

/**
 * 天盘干（星不离干、干随星迁）。
 * 依据：每宫天盘干 = 落该宫之星「本位宫」的地盘干。
 */
export function feiTianGan(starByGong: Record<number, string>, dipan: DiPan): Record<number, string> {
  const result: Record<number, string> = {}
  for (const key of Object.keys(starByGong)) {
    const gong = Number(key)
    const star = STARS.find((s) => s.name === starByGong[gong])!
    result[gong] = dipan.ganByGong[star.gong]
  }
  return result
}

/**
 * 八门 / 九门飞布（全部顺飞）。
 * 依据：值使门落「值使宫」（值使随时宫，见 zhifu.zhiShiGong）；其余门按
 * 循环序依次落洛书顺飞的下一个宫。
 *   - 飞盘用中门（useZhongMen）：九门占满九宫（含中五宫）。
 *   - 不用中门：八门顺飞，跳过中五宫（门不入中宫）。
 */
export function feiGates(zhiShiGate: string, zhiShiGong: number, useZhongMen: boolean): Record<number, string> {
  const cycle: readonly string[] = useZhongMen ? GATE_CYCLE_9 : GATE_CYCLE_8
  const gateIdx = cycle.indexOf(zhiShiGate)
  if (gateIdx < 0) throw new Error(`未知值使门：${zhiShiGate}`)

  const result: Record<number, string> = {}
  if (useZhongMen) {
    const idx = LUOSHU_SHUN.indexOf(zhiShiGong as (typeof LUOSHU_SHUN)[number])
    for (let k = 0; k < 9; k++) {
      result[LUOSHU_SHUN[(idx + k) % 9]] = cycle[(gateIdx + k) % 9]
    }
  } else {
    const order = [1, 2, 3, 4, 6, 7, 8, 9] as const
    const idx = Math.max(0, order.indexOf(zhiShiGong as (typeof order)[number]))
    for (let k = 0; k < 8; k++) {
      result[order[(idx + k) % 8]] = cycle[(gateIdx + k) % 8]
    }
  }
  return result
}

/**
 * 九神飞布（值符神随值符星，阳顺阴逆）。
 * 依据：值符神落「值符星宫」（即时干落宫）；其余神按序阳顺阴逆飞布。
 * 太常使用（九神制）；不使用时取八神（去太常），占 9 宫中的 8 宫。
 */
export function feiGods(yinYang: YinYang, zhiFuGong: number, useTaiChang: boolean): Record<number, string> {
  const full = yinYang === 'yang' ? GODS_YANG : GODS_YIN
  const gods = useTaiChang ? [...full] : full.filter((g) => g !== '太常')
  const order = yinYang === 'yang' ? LUOSHU_SHUN : LUOSHU_NI
  const idx = order.indexOf(zhiFuGong as (typeof order)[number])

  const result: Record<number, string> = {}
  for (let k = 0; k < gods.length; k++) {
    result[order[(idx + k) % 9]] = gods[k]
  }
  return result
}

/** 马星宫号：以时支三合局定马星地支（时马），再取其本位宫。 */
export function maXingGong(zhi: string): number {
  const ma = MA_XING[zhi]
  if (!ma) return -1
  return ZHI_GONG[ma]
}

/** 十干去甲（暗干飞布用），甲遁于六仪已在调用处换算。 */
const GAN_JIU = ['乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const

/**
 * 暗干 · 值使门起（参考热卜默认「值使门起」）。
 * 依据：值使门落宫暗干起「时干」（甲遁旬首六仪），其余宫按洛书顺飞，
 * 暗干依十干去甲顺序顺布。
 */
export function feiAnGanZhiShiMen(zhiShiGateGong: number, shiGan: string): Record<number, string> {
  const ganIdx = GAN_JIU.indexOf(shiGan as (typeof GAN_JIU)[number])
  const idx = LUOSHU_SHUN.indexOf(zhiShiGateGong as (typeof LUOSHU_SHUN)[number])
  const result: Record<number, string> = {}
  for (let k = 0; k < 9; k++) {
    result[LUOSHU_SHUN[(idx + k) % 9]] = GAN_JIU[(ganIdx + k) % 9]
  }
  return result
}

/**
 * 暗干 · 门地盘起（参考热卜「门地盘起」）。
 * 依据：每宫暗干 = 该宫八门本位宫的地盘干（门不离地）。
 */
export function feiAnGanMenDiPan(gateByGong: Record<number, string>, dipan: DiPan): Record<number, string> {
  const result: Record<number, string> = {}
  for (const key of Object.keys(gateByGong)) {
    const gong = Number(key)
    const gate = GATES.find((g) => g.name === gateByGong[gong])
    if (gate) result[gong] = dipan.ganByGong[gate.gong]
  }
  return result
}
