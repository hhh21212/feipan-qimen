import { describe, it, expect } from 'vitest'
import { Solar } from 'lunar-javascript'
import { paiPan } from '../index'
import { findFuTouZhi, dingJieQi } from '../dingju'
import { zhiShiGong } from '../zhifu'
import { kongWangGongs, nianMingGan } from '../biaozhu'
import { jiGongTarget } from '../constants'

/** 按宫号取宫 */
function byGong(pan: ReturnType<typeof paiPan>, gong: number) {
  return pan.palaces.find((p) => p.gong === gong)!
}

describe('飞盘奇门排盘 · 夏至上元阴遁九局全例（2024-06-15 10:00）', () => {
  // 2024-06-15 10:00 = 甲辰年 庚午月 庚戌日 辛巳时
  // 上元符头「己酉」（06-14）早于夏至（06-21）7 天 → 超神，夏至上元 = 阴遁九局
  const pan = paiPan(new Date(2024, 5, 15, 10, 0, 0))

  it('定局：夏至上元阴遁九局，超神 7 天', () => {
    expect(pan.dun).toMatchObject({ yinYang: 'yin', juShu: 9, jieQi: '夏至', yuan: '上元', chaoShen: 7 })
  })

  it('四柱：甲辰 庚午 庚戌 辛巳', () => {
    expect(pan.fourPillars.year).toBe('甲辰')
    expect(pan.fourPillars.month).toBe('庚午')
    expect(pan.fourPillars.day).toBe('庚戌')
    expect(pan.fourPillars.time).toBe('辛巳')
  })

  it('值符值使 / 旬首 / 旬空 / 马星（时马亥）', () => {
    expect(pan.zhiFuStar).toBe('天任')
    expect(pan.zhiShiGate).toBe('生门')
    expect(pan.xunShou).toBe('甲戌')
    expect(pan.xunKong).toBe('申酉')
    expect(pan.maXing).toBe('亥')
  })

  it('地盘（阴遁九局逆布，中五壬；寄宫干默认不显示）', () => {
    expect(byGong(pan, 1).diGan).toBe('乙')
    expect(byGong(pan, 2).diGan).toBe('丙')
    expect(byGong(pan, 2).jiGan).toEqual([])
    expect(byGong(pan, 3).diGan).toBe('丁')
    expect(byGong(pan, 4).diGan).toBe('癸')
    expect(byGong(pan, 5).diGan).toBe('壬')
    expect(byGong(pan, 6).diGan).toBe('辛')
    expect(byGong(pan, 7).diGan).toBe('庚')
    expect(byGong(pan, 8).diGan).toBe('己')
    expect(byGong(pan, 9).diGan).toBe('戊')
  })

  it('九星顺飞（天任值符落乾六，余星顺飞）', () => {
    expect(byGong(pan, 1).star).toBe('天冲')
    expect(byGong(pan, 2).star).toBe('天辅')
    expect(byGong(pan, 3).star).toBe('天禽')
    expect(byGong(pan, 4).star).toBe('天心')
    expect(byGong(pan, 5).star).toBe('天柱')
    expect(byGong(pan, 6).star).toBe('天任')
    expect(byGong(pan, 7).star).toBe('天英')
    expect(byGong(pan, 8).star).toBe('天蓬')
    expect(byGong(pan, 9).star).toBe('天芮')
    expect(byGong(pan, 6).isZhiFu).toBe(true)
  })

  it('天盘干（星不离干、干随星迁）', () => {
    expect(byGong(pan, 1).tianGan).toBe('丁')
    expect(byGong(pan, 2).tianGan).toBe('癸')
    expect(byGong(pan, 3).tianGan).toBe('壬')
    expect(byGong(pan, 4).tianGan).toBe('辛')
    expect(byGong(pan, 5).tianGan).toBe('庚')
    expect(byGong(pan, 6).tianGan).toBe('己')
    expect(byGong(pan, 7).tianGan).toBe('戊')
    expect(byGong(pan, 8).tianGan).toBe('乙')
    expect(byGong(pan, 9).tianGan).toBe('丙')
  })

  it('九门顺飞（值使生门阴遁逆数落坎一，中门入兑七，九门占满九宫）', () => {
    expect(byGong(pan, 1).gate).toBe('生门')
    expect(byGong(pan, 2).gate).toBe('景门')
    expect(byGong(pan, 3).gate).toBe('休门')
    expect(byGong(pan, 4).gate).toBe('死门')
    expect(byGong(pan, 5).gate).toBe('伤门')
    expect(byGong(pan, 6).gate).toBe('杜门')
    expect(byGong(pan, 7).gate).toBe('中门')
    expect(byGong(pan, 8).gate).toBe('开门')
    expect(byGong(pan, 9).gate).toBe('惊门')
    expect(byGong(pan, 1).isZhiShi).toBe(true)
  })

  it('九神（值符神落乾六，阴逆）', () => {
    expect(byGong(pan, 6).god).toBe('值符')
    expect(byGong(pan, 5).god).toBe('螣蛇')
    expect(byGong(pan, 4).god).toBe('太阴')
    expect(byGong(pan, 3).god).toBe('六合')
    expect(byGong(pan, 2).god).toBe('白虎')
    expect(byGong(pan, 1).god).toBe('太常')
    expect(byGong(pan, 9).god).toBe('玄武')
    expect(byGong(pan, 8).god).toBe('九地')
    expect(byGong(pan, 7).god).toBe('九天')
  })

  it('地盘九神（值符加地盘值符＝旬首落艮八，阴逆）', () => {
    expect(byGong(pan, 8).diGod).toBe('值符')
    expect(byGong(pan, 7).diGod).toBe('螣蛇')
    expect(byGong(pan, 6).diGod).toBe('太阴')
    expect(byGong(pan, 5).diGod).toBe('六合')
    expect(byGong(pan, 4).diGod).toBe('白虎')
    expect(byGong(pan, 3).diGod).toBe('太常')
    expect(byGong(pan, 2).diGod).toBe('玄武')
    expect(byGong(pan, 1).diGod).toBe('九地')
    expect(byGong(pan, 9).diGod).toBe('九天')
  })

  it('标注：空亡申酉（坤二、兑七）、马星亥（乾六）', () => {
    expect(byGong(pan, 2).isKongWang).toBe(true)
    expect(byGong(pan, 7).isKongWang).toBe(true)
    expect(byGong(pan, 6).isMaXing).toBe(true)
  })

  it('暗干默认不显示（热卜默认）', () => {
    expect(byGong(pan, 5).anGan).toBe('')
  })

  it('暗干（值使门起）：值使生门落坎一起时干辛，顺布十干去甲', () => {
    const p = paiPan(new Date(2024, 5, 15, 10, 0, 0), { anGan: 'zhishimen' })
    expect(byGong(p, 1).anGan).toBe('辛')
    expect(byGong(p, 2).anGan).toBe('壬')
    expect(byGong(p, 3).anGan).toBe('癸')
    expect(byGong(p, 4).anGan).toBe('乙')
    expect(byGong(p, 5).anGan).toBe('丙')
    expect(byGong(p, 6).anGan).toBe('丁')
    expect(byGong(p, 7).anGan).toBe('戊')
    expect(byGong(p, 8).anGan).toBe('己')
    expect(byGong(p, 9).anGan).toBe('庚')
  })

  it('寄宫干（showJiGong 默认关闭，开启后坤二显示中五干）', () => {
    const off = paiPan(new Date(2024, 5, 15, 10, 0, 0))
    const on = paiPan(new Date(2024, 5, 15, 10, 0, 0), { showJiGong: true })
    expect(byGong(off, 2).jiGan).toEqual([])
    expect(byGong(on, 2).jiGan).toEqual(['壬'])
  })
})

describe('超神定局 · 寒露上元阴遁六局（2026-10-06，对齐热卜）', () => {
  // 2026-10-06 癸丑日 → 上元符头「己酉」（10-02）早于寒露（10-08）6 天 → 超神
  const pan = paiPan(new Date(2026, 9, 6, 14, 0, 0)) // 未时，对齐热卜排盘

  it('定局：寒露上元阴遁六局，超神 6 天', () => {
    expect(pan.dun).toMatchObject({ yinYang: 'yin', juShu: 6, jieQi: '寒露', yuan: '上元', chaoShen: 6 })
  })

  it('值符值使：天蓬 / 休门，旬首甲寅', () => {
    expect(pan.zhiFuStar).toBe('天蓬')
    expect(pan.zhiShiGate).toBe('休门')
    expect(pan.xunShou).toBe('甲寅')
  })

  it('九门（含中门）对齐热卜：离中门、兑伤门、艮杜门、乾死门、中休门(值使)', () => {
    expect(byGong(pan, 9).gate).toBe('中门')
    expect(byGong(pan, 7).gate).toBe('伤门')
    expect(byGong(pan, 8).gate).toBe('杜门')
    expect(byGong(pan, 6).gate).toBe('死门')
    expect(byGong(pan, 5).gate).toBe('休门')
    expect(byGong(pan, 5).isZhiShi).toBe(true)
  })

  it('八神两排（天盘神·地盘神）对齐热卜：巽螣蛇·玄武、坤六合·九天', () => {
    expect(byGong(pan, 4).god).toBe('螣蛇')
    expect(byGong(pan, 4).diGod).toBe('玄武')
    expect(byGong(pan, 2).god).toBe('六合')
    expect(byGong(pan, 2).diGod).toBe('九天')
  })

  it('格局提示：八专（癸丑）、五不遇时（癸日己未时）、值使休门落中五、三诈震三真诈', () => {
    expect(pan.baZhuan).toBe(true)
    expect(pan.wuBuYuShi).toBe(true)
    expect(pan.zhiShiGong).toBe(5)
    expect(pan.zhaGe).toEqual(expect.arrayContaining([{ gong: 3, name: '真诈' }]))
  })

  it('标记挂具体干：艮八天盘庚「刑·墓」+门迫、乾六地盘戊「空·墓」、坎一地盘癸「空」', () => {
    expect(byGong(pan, 8).tianGanTags).toEqual(['刑', '墓'])
    expect(byGong(pan, 8).gateTag).toBe('迫')
    expect(byGong(pan, 6).diGanTags).toEqual(['空', '墓'])
    expect(byGong(pan, 1).diGanTags).toEqual(['空'])
  })

  it('旺衰：酉月按地支纳卦布八态（坎胎坤休震死巽囚中休乾相兑旺艮没离废）', () => {
    expect(byGong(pan, 1).wangShuai).toBe('胎') // 坎
    expect(byGong(pan, 2).wangShuai).toBe('休') // 坤
    expect(byGong(pan, 3).wangShuai).toBe('死') // 震
    expect(byGong(pan, 4).wangShuai).toBe('囚') // 巽
    expect(byGong(pan, 5).wangShuai).toBe('休') // 中
    expect(byGong(pan, 6).wangShuai).toBe('相') // 乾
    expect(byGong(pan, 7).wangShuai).toBe('旺') // 兑
    expect(byGong(pan, 8).wangShuai).toBe('没') // 艮
    expect(byGong(pan, 9).wangShuai).toBe('废') // 离
  })
})

describe('dingJieQi 超神/接气', () => {
  it('超神：2024-06-15 上元符头早于夏至 7 天 → 夏至/超神7', () => {
    const lunar = Solar.fromDate(new Date(2024, 5, 15)).getLunar()
    expect(dingJieQi(lunar)).toEqual({ jieQi: '夏至', chaoShen: 7 })
  })

  it('超神：2026-10-06 上元符头早于寒露 6 天 → 寒露/超神6', () => {
    const lunar = Solar.fromDate(new Date(2026, 9, 6)).getLunar()
    expect(dingJieQi(lunar)).toEqual({ jieQi: '寒露', chaoShen: 6 })
  })

  it('接气：2024-10-01 上元符头晚于秋分 5 天 → 秋分/接气5', () => {
    const lunar = Solar.fromDate(new Date(2024, 9, 1)).getLunar()
    expect(dingJieQi(lunar)).toEqual({ jieQi: '秋分', chaoShen: -5 })
  })
})

describe('纯函数单测', () => {
  it('findFuTouZhi：庚戌 → 符头己酉（酉）', () => {
    expect(findFuTouZhi('庚', '戌')).toBe('酉')
    expect(findFuTouZhi('甲', '子')).toBe('子')
    expect(findFuTouZhi('己', '卯')).toBe('卯')
    expect(findFuTouZhi('乙', '丑')).toBe('子') // 乙丑 回溯 1 天到甲子
  })

  it('zhiShiGong：值使随时宫（阳顺阴逆）', () => {
    expect(zhiShiGong(7, '甲戌', '巳', 'yang')).toBe(5) // 阳遁顺数 7 步到中五
    expect(zhiShiGong(7, '甲戌', '巳', 'yin')).toBe(9) // 阴遁逆数 7 步到离九
    expect(zhiShiGong(1, '甲寅', '未', 'yin')).toBe(5) // 2026-10-06 未时：逆数 5 步到中五
  })

  it('kongWangGongs：申酉 → 坤二、兑七', () => {
    expect(kongWangGongs('申酉')).toEqual([2, 7])
  })

  it('nianMingGan：出生年天干', () => {
    expect(nianMingGan(1984)).toBe('甲')
    expect(nianMingGan(1985)).toBe('乙')
    expect(nianMingGan(2024)).toBe('甲')
  })

  it('jiGongTarget：寄宫方式', () => {
    expect(jiGongTarget('kun2', 'yang')).toBe(2)
    expect(jiGongTarget('gen8', 'yin')).toBe(8)
    expect(jiGongTarget('yangGenYinKun', 'yang')).toBe(8)
    expect(jiGongTarget('yangGenYinKun', 'yin')).toBe(2)
  })
})

describe('阴遁结构自检（2024-07-20 12:00，大暑后）', () => {
  const pan = paiPan(new Date(2024, 6, 20, 12, 0, 0))

  it('阴遁、地盘逆布、九神阴序含玄武', () => {
    expect(pan.dun.yinYang).toBe('yin')
    // 九宫均有星与神
    expect(pan.palaces.every((p) => p.star)).toBe(true)
    expect(pan.palaces.every((p) => p.god)).toBe(true)
    // 九门（飞盘用中门）占满九宫
    expect(pan.palaces.filter((p) => p.gate).length).toBe(9)
    // 阴遁九神含白虎/玄武（太常仍使用）
    expect(pan.palaces.some((p) => p.god === '玄武')).toBe(true)
  })
})
