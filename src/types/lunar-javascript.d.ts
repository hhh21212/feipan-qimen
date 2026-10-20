// lunar-javascript 无官方类型声明，这里声明本项目用到的 API 子集。
declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar
    static fromDate(date: Date): Solar
    getLunar(): Lunar
    toYmdHms(): string
    getYear(): number
    getMonth(): number
    getDay(): number
    getHour(): number
    getMinute(): number
    getSecond(): number
  }

  export class Lunar {
    getEightChar(): EightChar
    getSolar(): Solar
    /** 上一节气（含节与中气，共 24 个），用于判断当前所处节气 */
    getPrevJieQi(): JieQi
    getNextJieQi(): JieQi
    getJieQiTable(): Record<string, JieQi>
    toString(): string
    getYear(): number
    getMonth(): number
    getDay(): number
    getYearInChinese(): string
    getMonthInChinese(): string
    getDayInChinese(): string
  }

  export class EightChar {
    getYear(): string
    getYearGan(): string
    getYearZhi(): string
    getMonth(): string
    getMonthGan(): string
    getMonthZhi(): string
    getDay(): string
    getDayGan(): string
    getDayZhi(): string
    getTime(): string
    getTimeGan(): string
    getTimeZhi(): string
    /** 时柱旬首，如「甲子」「甲戌」，用于定值符值使 */
    getTimeXun(): string
    getDayXun(): string
    getTimeXunKong(): string
    getDayXunKong(): string
    getYearNaYin(): string
    getMonthNaYin(): string
    getDayNaYin(): string
    getTimeNaYin(): string
  }

  export class JieQi {
    getName(): string
    getSolar(): Solar
  }
}
