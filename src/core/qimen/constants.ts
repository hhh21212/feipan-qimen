// 飞盘奇门排盘基础常量表。
// 依据：飞盘奇门（非转盘），九星/八门按洛书顺飞，九神阳顺阴逆。

// 十天干 / 十二地支
export const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
export const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const

// 三奇六仪（地盘固定顺序）：戊己庚辛壬癸丁丙乙
export const QI_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'] as const

// 洛书九宫顺飞序（坎一 → 坤二 → 震三 → 巽四 → 中五 → 乾六 → 兑七 → 艮八 → 离九）
export const LUOSHU_SHUN = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
// 逆飞序（用于阴遁地盘、九神逆布）
export const LUOSHU_NI = [9, 8, 7, 6, 5, 4, 3, 2, 1] as const

// 宫名（下标即宫号 1-9）
export const GONG_NAME = ['', '坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离'] as const

// 九星：本位宫号（天禽居中五）
export const STARS = [
  { name: '天蓬', gong: 1 },
  { name: '天芮', gong: 2 },
  { name: '天冲', gong: 3 },
  { name: '天辅', gong: 4 },
  { name: '天禽', gong: 5 },
  { name: '天心', gong: 6 },
  { name: '天柱', gong: 7 },
  { name: '天任', gong: 8 },
  { name: '天英', gong: 9 },
] as const

// 九门：本位宫号（飞盘含中门，中五宫本位门为中门）
export const GATES = [
  { name: '休门', gong: 1 },
  { name: '死门', gong: 2 },
  { name: '伤门', gong: 3 },
  { name: '杜门', gong: 4 },
  { name: '中门', gong: 5 },
  { name: '开门', gong: 6 },
  { name: '惊门', gong: 7 },
  { name: '生门', gong: 8 },
  { name: '景门', gong: 9 },
] as const

// 九神：飞盘用九神（含太常），阳遁 / 阴遁顺序不同
export const GODS_YANG = ['值符', '螣蛇', '太阴', '六合', '勾陈', '太常', '朱雀', '九地', '九天'] as const
export const GODS_YIN = ['值符', '螣蛇', '太阴', '六合', '白虎', '太常', '玄武', '九地', '九天'] as const

// 旬首 → 六仪（甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸）
export const XUN_TO_YI: Record<string, string> = {
  甲子: '戊',
  甲戌: '己',
  甲申: '庚',
  甲午: '辛',
  甲辰: '壬',
  甲寅: '癸',
}

// 六仪 → 旬首（反向）
export const YI_TO_XUN: Record<string, string> = {
  戊: '甲子',
  己: '甲戌',
  庚: '甲申',
  辛: '甲午',
  壬: '甲辰',
  癸: '甲寅',
}

// 24 节气局数表：节气名 → 阴阳遁 + [上元, 中元, 下元] 局数
export const JIE_QI_JU: Record<
  string,
  { yinYang: 'yang' | 'yin'; ju: [number, number, number] }
> = {
  冬至: { yinYang: 'yang', ju: [1, 7, 4] },
  小寒: { yinYang: 'yang', ju: [2, 8, 5] },
  大寒: { yinYang: 'yang', ju: [3, 9, 6] },
  立春: { yinYang: 'yang', ju: [8, 5, 2] },
  雨水: { yinYang: 'yang', ju: [9, 6, 3] },
  惊蛰: { yinYang: 'yang', ju: [1, 7, 4] },
  春分: { yinYang: 'yang', ju: [3, 9, 6] },
  清明: { yinYang: 'yang', ju: [4, 1, 7] },
  谷雨: { yinYang: 'yang', ju: [5, 2, 8] },
  立夏: { yinYang: 'yang', ju: [4, 1, 7] },
  小满: { yinYang: 'yang', ju: [5, 2, 8] },
  芒种: { yinYang: 'yang', ju: [6, 3, 9] },
  夏至: { yinYang: 'yin', ju: [9, 3, 6] },
  小暑: { yinYang: 'yin', ju: [8, 2, 5] },
  大暑: { yinYang: 'yin', ju: [7, 1, 4] },
  立秋: { yinYang: 'yin', ju: [2, 5, 8] },
  处暑: { yinYang: 'yin', ju: [1, 4, 7] },
  白露: { yinYang: 'yin', ju: [9, 3, 6] },
  秋分: { yinYang: 'yin', ju: [7, 1, 4] },
  寒露: { yinYang: 'yin', ju: [6, 9, 3] },
  霜降: { yinYang: 'yin', ju: [5, 8, 2] },
  立冬: { yinYang: 'yin', ju: [6, 9, 3] },
  小雪: { yinYang: 'yin', ju: [5, 8, 2] },
  大雪: { yinYang: 'yin', ju: [4, 7, 1] },
}

// 符头日支 → 三元（甲己为符头，按日支定元）
export const FU_TOU_YUAN: Record<string, '上元' | '中元' | '下元'> = {
  子: '上元',
  午: '上元',
  卯: '上元',
  酉: '上元',
  寅: '中元',
  申: '中元',
  巳: '中元',
  亥: '中元',
  辰: '下元',
  戌: '下元',
  丑: '下元',
  未: '下元',
}

// 十二支本位宫（用于空亡、马星定位）：子→坎1、丑寅→艮8、卯→震3、辰巳→巽4、午→离9、未申→坤2、酉→兑7、戌亥→乾6
export const ZHI_GONG: Record<string, number> = {
  子: 1,
  丑: 8,
  寅: 8,
  卯: 3,
  辰: 4,
  巳: 4,
  午: 9,
  未: 2,
  申: 2,
  酉: 7,
  戌: 6,
  亥: 6,
}

// 马星（驿马）：三合局 → 马星地支（申子辰马在寅，寅午戌马在申，巳酉丑马在亥，亥卯未马在巳）
export const MA_XING: Record<string, string> = {
  申: '寅',
  子: '寅',
  辰: '寅',
  寅: '申',
  午: '申',
  戌: '申',
  巳: '亥',
  酉: '亥',
  丑: '亥',
  亥: '巳',
  卯: '巳',
  未: '巳',
}

// 寄宫方式
export type JiGongMode = 'kun2' | 'gen8' | 'yangGenYinKun' | 'yangKunYinGen'

/** 中五宫寄宫目标（按寄宫方式与阴阳遁） */
export function jiGongTarget(mode: JiGongMode, yinYang: 'yang' | 'yin'): number {
  switch (mode) {
    case 'kun2':
      return 2
    case 'gen8':
      return 8
    case 'yangGenYinKun':
      return yinYang === 'yang' ? 8 : 2
    case 'yangKunYinGen':
      return yinYang === 'yang' ? 2 : 8
  }
}
