import { Solar } from 'lunar-javascript'
import type { Lunar } from 'lunar-javascript'
import { JIE_QI_JU, FU_TOU_YUAN, GAN, ZHI } from './constants'
import type { DunInfo, PaipanOptions, Yuan } from './types'

/**
 * 定局：节气（超神/接气校正）+ 三元 → 阴阳遁 + 局数。
 * 依据：节气决定阴阳遁与三元局数（24 节气局数表）；三元由符头（甲己日）日支决定；
 * 节气按置闰法的「超神/接气」校正（见 dingJieQi），而非单纯取上一交节。
 */
export function dingJu(solar: Solar, options: PaipanOptions): DunInfo {
  const lunar = solar.getLunar()
  const { jieQi, chaoShen } = dingJieQi(lunar)
  const info = JIE_QI_JU[jieQi]
  if (!info) throw new Error(`未知节气：${jieQi}`)

  const yuan = dingYuan(lunar, options)
  const ju = info.ju[yuan === '上元' ? 0 : yuan === '中元' ? 1 : 2]

  return { yinYang: info.yinYang, juShu: ju, jieQi, yuan, chaoShen }
}

/**
 * 定节气（超神/接气）：以当日符头 + 三元推出「上元符头」日期 F_上，
 * 再取 F_上 之后的下一节气：
 *   - 下一节气交节日距 F_上 ≤ 10 天 → 超神：节气取下一节气，超神天数 = 该差（正）。
 *   - 否则 → 接气：节气取上一节气，接气天数 = -(F_上 − 上一节气交节日)（负）。
 * 依据：置闰法「符头先至为超神、节气先至为接气」；上元符头最早可超前交节约 9 天，
 * 故以 10 天为界区分超神/接气。置闰边界（超神满 zhirunDays 天重复三元）仍待热卜实例落定。
 */
export function dingJieQi(lunar: Lunar): { jieQi: string; chaoShen: number } {
  const bz = lunar.getEightChar()
  const dayGan = bz.getDayGan()
  const dayZhi = bz.getDayZhi()

  const fuTouZhi = findFuTouZhi(dayGan, dayZhi)
  const yuan = FU_TOU_YUAN[fuTouZhi]
  const back = fuTouBack(dayGan)
  const offset = yuan === '上元' ? 0 : yuan === '中元' ? 5 : 10

  const solar = lunar.getSolar()
  const today = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay())
  const shangYuan = new Date(today.getTime() - (back + offset) * 86400000)
  const dayNum = (d: Date) => Math.round(d.getTime() / 86400000)

  const shangYuanSolar = Solar.fromDate(shangYuan)
  const next = shangYuanSolar.getLunar().getNextJieQi()
  const nextSolar = next.getSolar()
  const nextDay = new Date(nextSolar.getYear(), nextSolar.getMonth() - 1, nextSolar.getDay())
  const diff = dayNum(nextDay) - dayNum(shangYuan)

  if (diff <= 10) return { jieQi: next.getName(), chaoShen: diff }

  const prev = shangYuanSolar.getLunar().getPrevJieQi()
  const prevSolar = prev.getSolar()
  const prevDay = new Date(prevSolar.getYear(), prevSolar.getMonth() - 1, prevSolar.getDay())
  return { jieQi: prev.getName(), chaoShen: -(dayNum(shangYuan) - dayNum(prevDay)) }
}

/**
 * 三元判定：以甲、己日为符头，按符头日支定元。
 * 子午卯酉 → 上元；寅申巳亥 → 中元；辰戌丑未 → 下元。
 */
export function dingYuan(lunar: Lunar, options: PaipanOptions): Yuan {
  const bz = lunar.getEightChar()
  const dayGan = bz.getDayGan()
  const dayZhi = bz.getDayZhi()

  const fuTouZhi = findFuTouZhi(dayGan, dayZhi)
  const baseYuan = FU_TOU_YUAN[fuTouZhi]

  // 置闰法（热卜口径「置闰天数：满 8 天」）：
  //   超神满 zhirunDays 天（上元符头早于芒种/大雪交节 ≥ 8 天）时置闰，
  //   该节气上中下三元重复一遍（闰奇），导致夏至/冬至交节后的一段窗口仍沿用芒种/大雪的局。
  // TODO(置闰)：局数的「节气」校正尚未接线（需热卜置闰实例对盘后落定）。
  //   已就绪：chaoShenAt(交节) 给出某交节的超神天数；chaoShenDays 给出当日超神。
  //   三元判定（符头日支→上/中/下）本身不受置闰影响，此处直接返回。
  void options

  return baseYuan
}

/** 回溯到最近甲(0)/己(5)日的天数。 */
export function fuTouBack(dayGan: string): number {
  const ganIdx = GAN.indexOf(dayGan as (typeof GAN)[number])
  if (ganIdx <= 4) return ganIdx // 乙丙丁戊 → 回到甲
  if (ganIdx === 5) return 0 // 己 → 符头本身
  return ganIdx - 5 // 庚辛壬癸 → 回到己
}

/**
 * 某交节时刻的「超神」天数：上元符头（甲己日 + 子午卯酉支）早于交节的天数。
 * 算法：交节日回溯到最近甲己日（back 天），其支对应三元（上/中/下），
 * 上元符头 = 符头再回溯 0/5/10 天，故超神 = back + 元偏移。
 * 依据：置闰法「超神满 zhirunDays 天」（热卜写「满 8 天」）即在芒种/大雪之后、二至之前置闰。
 */
export function chaoShenAt(jieQiSolar: Solar): number {
  const bz = jieQiSolar.getLunar().getEightChar()
  const dayZhi = bz.getDayZhi()
  const back = fuTouBack(bz.getDayGan())
  const zhiIdx = ZHI.indexOf(dayZhi as (typeof ZHI)[number])
  const fuTouZhi = ZHI[(zhiIdx - back + 12) % 12]
  const yuan = FU_TOU_YUAN[fuTouZhi]
  const offset = yuan === '上元' ? 0 : yuan === '中元' ? 5 : 10
  return back + offset
}

/** 找到日干支所属的符头（甲己日），返回符头日支。 */
export function findFuTouZhi(dayGan: string, dayZhi: string): string {
  const zhiIdx = ZHI.indexOf(dayZhi as (typeof ZHI)[number])
  const back = fuTouBack(dayGan)
  return ZHI[(zhiIdx - back + 12) % 12]
}
