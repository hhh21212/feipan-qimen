import { XUN_TO_YI, STARS, GATES, ZHI, LUOSHU_SHUN, LUOSHU_NI } from './constants'
import type { DiPan } from './dipan'
import type { YinYang } from './types'

export interface ZhiFuResult {
  star: string
  gate: string
  /** 旬首六仪落宫（值符值使本位宫） */
  xunGong: number
}

/**
 * 定值符、值使：旬首落宫，该宫本位星为值符、本位门为值使。
 * 依据：时柱旬首（甲子/甲戌/…）遁于六仪（戊己庚辛壬癸），
 * 六仪在地盘落宫 → 该宫星为值符、门为值使（飞盘九门含中门，中五宫本位门为中门）。
 */
export function findZhiFuZhiShi(xunShou: string, dipan: DiPan): ZhiFuResult {
  const yi = XUN_TO_YI[xunShou]
  const xunGong = dipan.gongByGan[yi]

  const star = STARS.find((s) => s.gong === xunGong)?.name ?? ''
  const gate = GATES.find((g) => g.gong === xunGong)?.name ?? ''

  return { star, gate, xunGong }
}

/**
 * 值使门落宫（值使随时宫）：从旬首宫起，阳遁顺数、阴遁逆数到用事时辰，每时辰移一宫（中五占位）。
 * 依据：飞盘「值使随时宫」阳顺阴逆（八门落宫用），与八门飞布「顺飞」是两个独立规则。
 * @param xunGong 旬首落宫
 * @param xunShou 时柱旬首（如「甲戌」）
 * @param timeZhi 时支（如「巳」）
 * @param yinYang 阴阳遁（决定顺/逆）
 */
export function zhiShiGong(xunGong: number, xunShou: string, timeZhi: string, yinYang: YinYang): number {
  const xunZhi = xunShou[1] // 旬首地支，如「甲戌」→「戌」
  const steps = (ZHI.indexOf(timeZhi as (typeof ZHI)[number]) - ZHI.indexOf(xunZhi as (typeof ZHI)[number]) + 12) % 12
  const order = yinYang === 'yang' ? LUOSHU_SHUN : LUOSHU_NI
  const startIdx = order.indexOf(xunGong as (typeof order)[number])
  return order[(startIdx + steps) % 9]
}
