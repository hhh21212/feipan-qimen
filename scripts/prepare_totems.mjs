// 把 Wényàng 纹样卡片图转成「主题色 + 透明底」的水印 PNG。
// 米白宣纸底 -> 透明；深色纹样 -> 主题色实心。留白自动裁掉。
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const BEASTS = {
  xianhe:   { card: 'scripts/_dl/xianhe_card.png',   color: [0xe0, 0xc5, 0x8f] }, // 月白金
  xuanwu:   { card: 'scripts/_dl/xuanwu_card.png',   color: [0xc7, 0xa2, 0x52] }, // 古金
  zhuque:   { card: 'scripts/_dl/zhuque_card.png',   color: [0xd9, 0x8a, 0x6b] }, // 朱红
  qinglong: { card: 'scripts/_dl/qinglong_card.png', color: [0x6f, 0xd0, 0xbd] }, // 玉青
  qilin:    { card: 'scripts/_dl/qilin_card.png',    color: [0x8a, 0x6a, 0x2f] }, // 墨金
};

const MAXW = 1200; // 输出宽度上限（原生 1086 不降采样，避免高分屏糊）

async function process(name, { card, color }) {
  const { data, info } = await sharp(card).greyscale().resize(MAXW, null, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  // 底色 = 四角中位数（宣纸 ~240）
  const corners = [
    data[0], data[W - 1],
    data[(H - 1) * W], data[(H - 1) * W + W - 1],
  ].sort((a, b) => a - b);
  const bg = corners[Math.floor(corners.length / 2)];

  // alpha = 灰度反相 + 对比拉伸：底色透明，深色纹样不透明
  const LO = 60, HI = bg - 20;
  const alpha = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const g = data[i];
    let a = g <= LO ? 255 : g >= HI ? 0 : Math.round(((HI - g) / (HI - LO)) * 255);
    alpha[i] = a;
  }

  // 找 alpha>15 的包围盒，裁掉留白
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (alpha[y * W + x] > 15) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 <= x0 || y1 <= y0) { console.log(name, 'EMPTY MASK'); return; }
  const pad = Math.round((x1 - x0) * 0.02) + 2;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

  // 构建 RGBA
  const [r, g, b] = color;
  const OPACITY = 0.20; // 淡印水印（略提以显清晰）
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const si = (y + y0) * W + (x + x0);
    const di = (y * cw + x) * 4;
    out[di] = r; out[di + 1] = g; out[di + 2] = b;
    out[di + 3] = Math.round(alpha[si] * OPACITY);
  }

  const outp = `public/totems/${name}.png`;
  await sharp(out, { raw: { width: cw, height: ch, channels: 4 } }).png({ compressionLevel: 9, palette: true }).toFile(outp);
  console.log(`${name}: bg=${bg} crop=${cw}x${ch} -> ${outp}`);
}

(async () => {
  for (const [name, cfg] of Object.entries(BEASTS)) await process(name, cfg);
  console.log('DONE');
})();
