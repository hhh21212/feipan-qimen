import type { JiGongMode } from './constants'

export type YinYang = 'yang' | 'yin'
export type Yuan = '上元' | '中元' | '下元'

/** 排盘配置（对应设置页可切换项，默认值即用户确认的规则） */
export interface PaipanOptions {
  panType: 'feipan'
  /** 定局法：置闰 / 拆补 / 茅山（默认置闰） */
  dingJu: 'zhirun' | 'chaibu' | 'maoshan'
  /** 置闰阈值天数（默认满 8 天） */
  zhirunDays: number
  /** 中五宫寄宫方式（默认寄坤二） */
  jiGong: JiGongMode
  /** 是否显示寄宫干标注（中五宫干寄到目标宫，热卜默认不显示） */
  showJiGong: boolean
  /** 九星顺逆（默认顺飞） */
  xingFei: 'shun' | 'ni'
  /** 八门顺逆（默认全部顺飞） */
  menFei: 'shun' | 'ni'
  /** 飞盘中门（默认使用，中五宫为八门有效落点） */
  useZhongMen: boolean
  /** 飞盘太常（默认使用，九神含太常） */
  useTaiChang: boolean
  /** 六壬神将（默认不显示） */
  showLiuRen: boolean
  /** 暗干起法（参考热卜：值使门起 / 门地盘起 / 不排） */
  anGan: 'zhishimen' | 'mendipan' | 'none'
  /** 起建方式（默认直使起建） */
  qiJian: 'zhishi'
}

export const DEFAULT_OPTIONS: PaipanOptions = {
  panType: 'feipan',
  dingJu: 'zhirun',
  zhirunDays: 8,
  jiGong: 'kun2',
  showJiGong: false,
  xingFei: 'shun',
  menFei: 'shun',
  useZhongMen: true,
  useTaiChang: true,
  showLiuRen: false,
  anGan: 'none',
  qiJian: 'zhishi',
}

export interface FourPillars {
  year: string
  month: string
  day: string
  time: string
  naYin: { year: string; month: string; day: string; time: string }
}

export interface DunInfo {
  yinYang: YinYang
  juShu: number
  jieQi: string
  yuan: Yuan
  /** 超神/接气天数：符头早于交节为正（超神），晚于为负（接气） */
  chaoShen: number
}

export interface Palace {
  /** 洛书宫号 1-9 */
  gong: number
  name: string
  star: string
  gate: string
  /** 天盘九神（值符随天盘值符星＝时干落宫） */
  god: string
  /** 地盘九神（值符加地盘值符＝旬首落宫） */
  diGod: string
  tianGan: string
  diGan: string
  /** 暗干（飞干），可关闭 */
  anGan: string
  /** 寄宫干（中五宫的干寄到目标宫，落在目标宫上显示） */
  jiGan: string[]
  /** 天盘干标记（刑/墓，标在天盘干旁） */
  tianGanTags: string[]
  /** 地盘干标记（空/墓，标在地盘干旁） */
  diGanTags: string[]
  /** 门标记（迫，标在门旁；空串表示无） */
  gateTag: string
  /** 旺衰字（旺相胎没死囚废休，右下角） */
  wangShuai: string
  isNianMing: boolean
  isKongWang: boolean
  isMaXing: boolean
  isZhiFu: boolean
  isZhiShi: boolean
}

export interface QimenPan {
  options: PaipanOptions
  solar: { text: string }
  lunar: { text: string }
  fourPillars: FourPillars
  dun: DunInfo
  zhiFuStar: string
  zhiShiGate: string
  /** 值使门落宫（宫号 1-9） */
  zhiShiGong: number
  /** 八专日 */
  baZhuan: boolean
  /** 五不遇时 */
  wuBuYuShi: boolean
  /** 三诈落宫（真诈/重诈/休诈） */
  zhaGe: { gong: number; name: string }[]
  /** 时柱旬首（如「甲戌」） */
  xunShou: string
  /** 时柱旬空（如「申酉」） */
  xunKong: string
  /** 马星地支 */
  maXing: string
  /** 年命天干 */
  nianMing: string
  /** 按宫号 1-9 排序，index 0 = 坎一宫 */
  palaces: Palace[]
}
