import type { QimenPan } from '../core/qimen/types'

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line/40 py-2 text-sm last:border-0">
      <span className="text-dim">{k}</span>
      <span className="text-moon">{v}</span>
    </div>
  )
}

export function PanSimple({ pan }: { pan: QimenPan }) {
  const { fourPillars: fp, dun } = pan
  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg border border-line/70 glass-panel p-3">
        <h3 className="mb-1 text-xs tracking-widest text-gold">四柱</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {(
            [
              ['年', 'year'],
              ['月', 'month'],
              ['日', 'day'],
              ['时', 'time'],
            ] as const
          ).map(([label, key]) => (
            <div key={key}>
              <div className="text-xs text-dim">{label}</div>
              <div className="text-base text-moon">{fp[key]}</div>
              <div className="text-[10px] text-dim/70">{fp.naYin[key]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line/70 glass-panel p-3">
        <h3 className="mb-1 text-xs tracking-widest text-gold">局</h3>
        <Row k="节气" v={`${dun.jieQi}（${dun.yuan}）`} />
        <Row k="阴阳遁" v={dun.yinYang === 'yang' ? `阳遁 ${dun.juShu} 局` : `阴遁 ${dun.juShu} 局`} />
        <Row k="超神" v={dun.chaoShen > 0 ? `${dun.chaoShen} 天` : dun.chaoShen < 0 ? `接气 ${-dun.chaoShen} 天` : '正授'} />
      </section>

      <section className="rounded-lg border border-line/70 glass-panel p-3">
        <h3 className="mb-1 text-xs tracking-widest text-gold">用神</h3>
        <Row k="值符星" v={pan.zhiFuStar} />
        <Row k="值使门" v={pan.zhiShiGate} />
        <Row k="旬首" v={pan.xunShou} />
        <Row k="旬空" v={pan.xunKong || '—'} />
        <Row k="马星" v={pan.maXing || '—'} />
        <Row k="年命" v={pan.nianMing || '未设'} />
      </section>

      <section className="rounded-lg border border-line/70 glass-panel p-3 text-xs text-dim">
        <p>{pan.solar.text}</p>
        <p className="mt-1">{pan.lunar.text}</p>
      </section>
    </div>
  )
}
