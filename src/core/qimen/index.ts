import { Solar } from 'lunar-javascript'
import { GONG_NAME, XUN_TO_YI, MA_XING } from './constants'
import type { Palace, PaipanOptions, QimenPan } from './types'
import { DEFAULT_OPTIONS } from './types'
import { dingJu } from './dingju'
import { buildDiPan } from './dipan'
import { findZhiFuZhiShi, zhiShiGong } from './zhifu'
import { feiStars, feiTianGan, feiGates, feiGods, maXingGong, feiAnGanZhiShiMen, feiAnGanMenDiPan } from './feixing'
import { buildFourPillars, buildXun, kongWangGongs, nianMingGan } from './biaozhu'
import { isBaZhuanRi, isWuBuYuShi, findZhaGe, marksByGong, wangShuaiByGong } from './geju'

/**
 * 飞盘奇门排盘入口。
 * 依据（已与用户确认）：飞盘（九星/八门洛书顺飞）；置闰法（满 8 天）；
 * 寄坤二宫（可切换）；星门都顺飞；飞盘中门使用（中五占位）；飞盘太常使用（九神阳顺阴逆）。
 *
 * @param date 起局公历时间
 * @param options 排盘配置（可缺省，缺省取默认）
 * @param birthYear 出生年（用于年命天干落宫，可缺省）
 */
export function paiPan(date: Date, options?: Partial<PaipanOptions>, birthYear?: number): QimenPan {
  const opts: PaipanOptions = { ...DEFAULT_OPTIONS, ...options }

  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()
  const bz = lunar.getEightChar()

  // 1) 定局：节气 → 阴阳遁 + 局数 + 三元
  const dun = dingJu(solar, opts)

  // 2) 地盘三奇六仪（含寄宫）
  const dipan = buildDiPan(dun.yinYang, dun.juShu, opts)

  // 3) 四柱 / 旬首 / 旬空
  const fourPillars = buildFourPillars(bz)
  const { xunShou, xunKong } = buildXun(bz)

  // 4) 值符、值使：旬首六仪落宫 → 本位星 / 门
  const { star: zhiFuStar, gate: zhiShiGate, xunGong } = findZhiFuZhiShi(xunShou, dipan)

  // 5) 值使门落宫（值使随时宫，阳顺阴逆，中五占位）
  const timeZhi = bz.getTimeZhi()
  const zhiShiGateGong = zhiShiGong(xunGong, xunShou, timeZhi, dun.yinYang)

  // 6) 时干落宫（值符星随时干；甲遁于旬首六仪）
  const timeGan = bz.getTimeGan()
  const shiGanGong = timeGan === '甲' ? dipan.gongByGan[XUN_TO_YI[xunShou]] : dipan.gongByGan[timeGan]

  // 7) 九星顺飞 → 天盘干
  const starByGong = feiStars(zhiFuStar, shiGanGong)
  const tianGanByGong = feiTianGan(starByGong, dipan)

  // 8) 八门 / 九门顺飞（值使门起；飞盘用中门则九门占满九宫）
  const gateByGong = feiGates(zhiShiGate, zhiShiGateGong, opts.useZhongMen)

  // 9) 天盘九神飞布（值符神随值符星＝时干落宫，阳顺阴逆）
  const godByGong = feiGods(dun.yinYang, shiGanGong, opts.useTaiChang)

  // 9.6) 地盘九神飞布（值符加地盘值符＝旬首落宫，阳顺阴逆）
  const diGodByGong = feiGods(dun.yinYang, xunGong, opts.useTaiChang)

  // 9.5) 暗干（飞干）：值使门起 / 门地盘起 / 不排
  const shiGanForAnGan = timeGan === '甲' ? XUN_TO_YI[xunShou] : timeGan
  let anGanByGong: Record<number, string> = {}
  if (opts.anGan === 'zhishimen') {
    anGanByGong = feiAnGanZhiShiMen(zhiShiGateGong, shiGanForAnGan)
  } else if (opts.anGan === 'mendipan') {
    anGanByGong = feiAnGanMenDiPan(gateByGong, dipan)
  }

  // 9.7) 标记（刑迫墓/仪空，挂在具体干/门）/ 三诈 / 八专 / 五不遇时
  const marksByGongMap = marksByGong(gateByGong, tianGanByGong, dipan.ganByGong)
  const zhaGe = findZhaGe(gateByGong, tianGanByGong, godByGong)
  const baZhuan = isBaZhuanRi(fourPillars.day)
  const wuBuYuShi = isWuBuYuShi(fourPillars.day[0], fourPillars.time[0])

  // 9.8) 旺衰（按月建地支纳卦布八态）
  const wangShuaiByGongMap = wangShuaiByGong(bz.getMonthZhi())

  // 10) 标注：空亡 / 马星 / 年命
  const kongGongs = kongWangGongs(xunKong)
  const maZhi = MA_XING[timeZhi] ?? ''
  const maGong = maXingGong(timeZhi)
  const nmGan = birthYear !== undefined ? nianMingGan(birthYear) : ''
  const nmGong = nmGan ? (dipan.gongByGan[nmGan] ?? -1) : -1

  // 11) 组装九宫
  const palaces: Palace[] = []
  for (let gong = 1; gong <= 9; gong++) {
    palaces.push({
      gong,
      name: GONG_NAME[gong],
      star: starByGong[gong] ?? '',
      gate: gateByGong[gong] ?? '',
      god: godByGong[gong] ?? '',
      diGod: diGodByGong[gong] ?? '',
      tianGan: tianGanByGong[gong] ?? '',
      diGan: dipan.ganByGong[gong] ?? '',
      anGan: anGanByGong[gong] ?? '',
      jiGan: opts.showJiGong ? (dipan.jiGanByGong[gong] ?? []) : [],
      tianGanTags: marksByGongMap[gong]?.tianGanTags ?? [],
      diGanTags: marksByGongMap[gong]?.diGanTags ?? [],
      gateTag: marksByGongMap[gong]?.gateTag ?? '',
      wangShuai: wangShuaiByGongMap[gong] ?? '',
      isNianMing: gong === nmGong,
      isKongWang: kongGongs.includes(gong),
      isMaXing: gong === maGong,
      isZhiFu: gong === shiGanGong,
      isZhiShi: gong === zhiShiGateGong,
    })
  }

  return {
    options: opts,
    solar: { text: `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}` },
    lunar: { text: lunar.toString() },
    fourPillars,
    dun,
    zhiFuStar,
    zhiShiGate,
    zhiShiGong: zhiShiGateGong,
    baZhuan,
    wuBuYuShi,
    zhaGe,
    xunShou,
    xunKong,
    maXing: maZhi,
    nianMing: nmGan,
    palaces,
  }
}
