// 奇门格局与标记：八专日、五不遇时、三诈（真诈/重诈/休诈）、
// 六仪击刑、门迫、入墓、仪空（六仪空亡）。依据热卜显示，逐项对照。

// 八专日（日坐八专：干支同气或坐本气/墓库藏干）。
// 甲寅、乙卯、庚申、辛酉（坐禄）；戊戌、己未（坐本气）；癸丑、丁未（坐墓库藏干）。
const BA_ZHUAN_RI = new Set(['甲寅', '乙卯', '戊戌', '己未', '庚申', '辛酉', '癸丑', '丁未'])

/** 日柱是否为八专日 */
export function isBaZhuanRi(dayGanZhi: string): boolean {
  return BA_ZHUAN_RI.has(dayGanZhi)
}

// 天干相克（时干克日干 = 五不遇时）。克者在前、被克者在后。
const GAN_KE: Record<string, string> = {
  甲: '戊',
  乙: '己',
  丙: '庚',
  丁: '辛',
  戊: '壬',
  己: '癸',
  庚: '甲',
  辛: '乙',
  壬: '丙',
  癸: '丁',
}

/** 五不遇时：时干克日干（同阴阳，故相克即同极性） */
export function isWuBuYuShi(dayGan: string, timeGan: string): boolean {
  return GAN_KE[timeGan] === dayGan
}

// 三诈：开/休/生三吉门 + 乙丙丁三奇（天盘干）+ 阴神
const JI_MEN = new Set(['开门', '休门', '生门'])
const SAN_QI = new Set(['乙', '丙', '丁'])
const ZHA_SHEN: Record<string, string> = { 太阴: '真诈', 九地: '重诈', 六合: '休诈' }

/** 三诈落宫（真诈/重诈/休诈） */
export function findZhaGe(
  gateByGong: Record<number, string>,
  tianGanByGong: Record<number, string>,
  godByGong: Record<number, string>,
): { gong: number; name: string }[] {
  const out: { gong: number; name: string }[] = []
  for (let gong = 1; gong <= 9; gong++) {
    const name = ZHA_SHEN[godByGong[gong]]
    if (name && JI_MEN.has(gateByGong[gong]) && SAN_QI.has(tianGanByGong[gong])) {
      out.push({ gong, name })
    }
  }
  return out
}

// 六仪击刑（天盘六仪落宫受刑）：己坤2、戊震3、壬癸巽4、庚艮8、辛离9。
const JI_XING_GONG: Record<string, number> = { 己: 2, 戊: 3, 壬: 4, 癸: 4, 庚: 8, 辛: 9 }

// 门迫（八门克所落宫）：门五行克宫五行。
const MEN_PO_GONG: Record<string, number[]> = {
  开门: [3, 4], // 金克木（震、巽）
  休门: [9], // 水克火（离）
  生门: [1], // 土克水（坎）
  伤门: [8, 2], // 木克土（艮、坤）
  杜门: [8, 2], // 木克土（艮、坤）
  景门: [6, 7], // 火克金（乾、兑）
  死门: [1], // 土克水（坎）
  惊门: [3, 4], // 金克木（震、巽）
  中门: [],
}

// 入墓（天干入墓库）：甲癸坤2、乙丙戊乾6、丁己庚艮8、辛壬巽4。
const MU_GONG: Record<string, number> = {
  甲: 2,
  乙: 6,
  丙: 6,
  丁: 8,
  戊: 6,
  己: 8,
  庚: 8,
  辛: 4,
  壬: 4,
  癸: 2,
}

// 仪空（六仪空亡）：地盘六仪落宫恰为其遁甲旬之空亡宫。
// 甲子戊空戌亥（乾6/兑7）、甲戌己空申酉（坤2/兑7）、甲申庚空午未（离9/坤2）、
// 甲午辛空辰巳（巽4）、甲辰壬空寅卯（艮8/震3）、甲寅癸空子丑（坎1/艮8）。
const YI_KONG_GONG: Record<string, number[]> = {
  戊: [6, 7],
  己: [2, 7],
  庚: [9, 2],
  辛: [4],
  壬: [8, 3],
  癸: [1, 8],
}

/** 每宫标记（挂在具体干/门上）：天盘干刑墓、地盘干空墓、门迫 */
export function marksByGong(
  gateByGong: Record<number, string>,
  tianGanByGong: Record<number, string>,
  diGanByGong: Record<number, string>,
): Record<number, { tianGanTags: string[]; diGanTags: string[]; gateTag: string }> {
  const out: Record<number, { tianGanTags: string[]; diGanTags: string[]; gateTag: string }> = {}
  for (let gong = 1; gong <= 9; gong++) {
    const tian = tianGanByGong[gong]
    const di = diGanByGong[gong]
    const gate = gateByGong[gong]
    const tianGanTags: string[] = []
    const diGanTags: string[] = []
    let gateTag = ''
    if (JI_XING_GONG[tian] === gong) tianGanTags.push('刑')
    if (MU_GONG[tian] === gong) tianGanTags.push('墓')
    if ((YI_KONG_GONG[di] ?? []).includes(gong)) diGanTags.push('空')
    if (MU_GONG[di] === gong) diGanTags.push('墓')
    if ((MEN_PO_GONG[gate] ?? []).includes(gong)) gateTag = '迫'
    out[gong] = { tianGanTags, diGanTags, gateTag }
  }
  return out
}

// 旺衰（8 态：旺相胎没死囚废休）。
// 依据（反推自 2026-10-06 酉月热卜全盘，已与用户核对）：按月建地支纳卦，
// 月支所在卦 = 旺，其余卦按十二地支顺序依次为 相胎没死囚废休。
// 地支顺序：子(坎) 丑寅(艮) 卯(震) 辰巳(巽) 午(离) 未申(坤) 酉(兑) 戌亥(乾)。
const ZHI_GUA: Record<string, number> = {
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
/** 卦序（地支顺序）：坎 艮 震 巽 离 坤 兑 乾 */
const GUA_CYCLE = [1, 8, 3, 4, 9, 2, 7, 6] as const
const WANG_SHUAI = ['旺', '相', '胎', '没', '死', '囚', '废', '休'] as const

/** 每宫旺衰字（按宫号 1-9 返回，中五宫寄坤二随坤） */
export function wangShuaiByGong(monthZhi: string): Record<number, string> {
  const wangGua = ZHI_GUA[monthZhi]
  if (!wangGua) return {}
  const idx = GUA_CYCLE.indexOf(wangGua as (typeof GUA_CYCLE)[number])
  const out: Record<number, string> = {}
  for (let k = 0; k < 8; k++) {
    out[GUA_CYCLE[(idx + k) % 8]] = WANG_SHUAI[k]
  }
  out[5] = out[2] // 中五宫寄坤二
  return out
}
