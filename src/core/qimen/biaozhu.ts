import type { EightChar } from 'lunar-javascript'
import { GAN, ZHI_GONG } from './constants'
import type { FourPillars } from './types'

/**
 * 四柱 + 纳音（直接取自 lunar-javascript 的 EightChar，无流派分歧）。
 */
export function buildFourPillars(bz: EightChar): FourPillars {
  return {
    year: bz.getYear(),
    month: bz.getMonth(),
    day: bz.getDay(),
    time: bz.getTime(),
    naYin: {
      year: bz.getYearNaYin(),
      month: bz.getMonthNaYin(),
      day: bz.getDayNaYin(),
      time: bz.getTimeNaYin(),
    },
  }
}

/**
 * 时柱旬首（值符值使依据）与旬空。
 * 依据：时柱干支 → 旬首（甲子/甲戌/甲申/甲午/甲辰/甲寅），旬空为旬首后两位地支。
 */
export function buildXun(bz: EightChar): { xunShou: string; xunKong: string } {
  return { xunShou: bz.getTimeXun(), xunKong: bz.getTimeXunKong() }
}

/**
 * 空亡落宫：旬空两地支 → 本位宫（如「申酉」→ 坤2、兑7）。
 */
export function kongWangGongs(xunKong: string): number[] {
  const gongs: number[] = []
  for (const ch of xunKong) {
    const g = ZHI_GONG[ch]
    if (g !== undefined && !gongs.includes(g)) gongs.push(g)
  }
  return gongs
}

/**
 * 年命天干：出生年 → 年干（按 1984 甲子年起算的干支纪年）。
 * 年命为奇门取用神的常用维度，默认取出生年天干。
 */
export function nianMingGan(birthYear: number): string {
  return GAN[((birthYear - 4) % 10 + 10) % 10]
}
