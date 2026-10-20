/**
 * 真太阳时换算。
 * 依据：真太阳时 = 平太阳时 + 均时差（equation of time）。
 *   平太阳时 = 北京时间 + 4 分钟 × (当地经度 − 120°)  （经度每差 1° 差 4 分钟）。
 *   均时差采用 NOAA 天文近似公式（非流派分歧，属天文学标准近似）。
 * 仅用于「把输入的钟表时间换算成真太阳时」，不参与排盘算法本身。
 */

/** 均时差（分钟）。B = 2π(N−81)/364，N 为当年第几天。 */
function equationOfTimeMinutes(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0)
  const n = Math.floor((date.getTime() - start) / 86_400_000)
  const b = (2 * Math.PI * (n - 81)) / 364
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b)
}

/** 真太阳时相对北京时间的偏移（分钟），东经为正。 */
export function trueSolarOffsetMinutes(date: Date, longitude: number): number {
  return 4 * (longitude - 120) + equationOfTimeMinutes(date)
}

/** 把钟表时间（北京时间）换算为真太阳时，返回新 Date。 */
export function toTrueSolarTime(date: Date, longitude: number): Date {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + Math.round(trueSolarOffsetMinutes(date, longitude)))
  return d
}
