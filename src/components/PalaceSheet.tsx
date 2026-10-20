import { motion, AnimatePresence } from 'framer-motion'
import type { Palace } from '../core/qimen/types'

function Item({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-dim">{k}</span>
      <span className={accent || 'text-moon'}>{v}</span>
    </div>
  )
}

export function PalaceSheet({ palace, onClose }: { palace: Palace | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {palace && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-auto w-full max-w-md rounded-t-2xl border-t border-line/70 bg-ink-800/85 px-5 pb-safe pt-4 backdrop-blur-xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-lg text-gold">
                {palace.name} · {palace.star}
              </h3>
              <div className="flex gap-1">
                {palace.isZhiFu && <span className="rounded bg-gold/20 px-1.5 text-xs text-gold-soft">值符</span>}
                {palace.isZhiShi && <span className="rounded bg-jade/20 px-1.5 text-xs text-jade">值使</span>}
                {palace.isKongWang && <span className="rounded border border-dashed border-dim/60 px-1.5 text-xs text-dim">空亡</span>}
                {palace.isMaXing && <span className="rounded bg-mist/20 px-1.5 text-xs text-mist">马星</span>}
                {palace.isNianMing && <span className="rounded bg-moon/15 px-1.5 text-xs text-moon">年命</span>}
              </div>
            </div>
            <div className="mb-3 divide-y divide-line/40 rounded-lg border border-line/60 bg-ink-700/50 px-3 py-1">
              <Item k="九星" v={palace.star} accent="text-gold" />
              <Item k="八门" v={`${palace.gate || '（无门）'}${palace.gateTag ? `（${palace.gateTag}）` : ''}`} />
              <Item k="天盘神" v={palace.god} accent="text-mist" />
              <Item k="地盘神" v={palace.diGod} accent="text-mist" />
              <Item k="天盘干" v={`${palace.tianGan}${palace.tianGanTags.length ? `（${palace.tianGanTags.join('·')}）` : ''}`} accent="text-gold-soft" />
              <Item k="地盘干" v={`${palace.diGan}${palace.diGanTags.length ? `（${palace.diGanTags.join('·')}）` : ''}`} />
              {palace.jiGan.length > 0 && <Item k="寄宫干" v={palace.jiGan.join('、')} />}
              {palace.anGan && <Item k="暗干" v={palace.anGan} />}
              {palace.wangShuai && <Item k="旺衰" v={palace.wangShuai} />}
            </div>
            <button onClick={onClose} className="w-full rounded-lg border border-line/70 py-2.5 text-sm text-dim">
              关闭
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
