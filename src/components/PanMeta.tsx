import type { QimenPan } from '../core/qimen/types'
import { GONG_NAME } from '../core/qimen/constants'

function MetaItem({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-xs text-dim">{k}</span>
      <span className="text-sm text-moon">{v}</span>
    </div>
  )
}

/**
 * 盘头标注：把四柱（含纳音）、节气·元、阴阳遁局数、值符值使、旬首、
 * 旬空（空亡）、马星、超神/接气、年命等一次性展示。主排盘页与记录详情共用。
 */
export function PanMeta({ pan }: { pan: QimenPan }) {
  const { fourPillars: fp, dun } = pan
  const chaoShen =
    dun.chaoShen > 0 ? `${dun.chaoShen} 天` : dun.chaoShen < 0 ? `接气 ${-dun.chaoShen} 天` : '正授'

  // 格局提示：八专 / 五不遇时 / 三诈（遁：宫-真诈/重诈/休诈）
  const geJu: string[] = []
  if (pan.baZhuan) geJu.push('八专')
  if (pan.wuBuYuShi) geJu.push('五不遇时')
  for (const z of pan.zhaGe) geJu.push(`遁：${GONG_NAME[z.gong]}-${z.name}`)

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-gold/25 glass-panel p-3">
      {/* 四柱 + 纳音 */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {(
          [
            ['年', 'year'],
            ['月', 'month'],
            ['日', 'day'],
            ['时', 'time'],
          ] as const
        ).map(([label, key]) => (
          <div key={key} className="flex flex-col items-center">
            <span className="text-[11px] text-dim">{label}</span>
            <span
              className={`text-base leading-5 ${
                key === 'day' || key === 'time' ? 'text-gold-glow' : 'text-gold-soft'
              }`}
            >
              {fp[key]}
            </span>
            <span className="text-[10px] text-dim/70">{fp.naYin[key]}</span>
          </div>
        ))}
      </div>

      <div className="ornament text-[10px]">✦</div>

      {/* 格局提示（八专 / 五不遇时 / 三诈） */}
      {geJu.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {geJu.map((g) => (
            <span key={g} className="rounded bg-gold/15 px-1.5 py-0.5 text-xs text-gold-soft">
              {g}
            </span>
          ))}
        </div>
      )}

      {/* 盘局与用神标注 */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <MetaItem k="节气" v={`${dun.jieQi}（${dun.yuan}）`} />
        <MetaItem k="阴阳遁" v={dun.yinYang === 'yang' ? `阳遁 ${dun.juShu} 局` : `阴遁 ${dun.juShu} 局`} />
        <MetaItem k="值符星" v={pan.zhiFuStar} />
        <MetaItem k="值使" v={`${pan.zhiShiGate}落${pan.zhiShiGong}宫`} />
        <MetaItem k="旬首" v={pan.xunShou} />
        <MetaItem k="旬空" v={pan.xunKong || '—'} />
        <MetaItem k="马星" v={pan.maXing || '—'} />
        <MetaItem k="超神" v={chaoShen} />
        <MetaItem k="年命" v={pan.nianMing || '未设'} />
      </div>
    </div>
  )
}
