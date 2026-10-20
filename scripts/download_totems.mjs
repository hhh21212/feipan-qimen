// 通过 GitHub git blob API（api.github.com 可达）下载 Wényàng 5 张纹样卡片图。
// 依赖：curl、sharp；先拉取仓库文件树，再逐张 blob 下载。
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const fs = require('fs');

const REPO = 'dososo/chinese-traditional-patterns';
const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/main?recursive=1`;
const BLOB_API = `https://api.github.com/repos/${REPO}/git/blobs/`;
const WANT = {
  qinglong: '021_龙纹',
  zhuque:   '024_凤鸟纹',
  qilin:    '026_麒麟纹',
  xianhe:   '031_鹤纹',
  xuanwu:   '038_龟纹',
};

fs.mkdirSync('scripts/_dl', { recursive: true });
execFileSync('curl', ['-s', '-m', '120', '-A', 'Mozilla/5.0', '-o', 'scripts/_dl/tree.json', TREE_API], { stdio: 'inherit' });
const tree = JSON.parse(fs.readFileSync('scripts/_dl/tree.json', 'utf8')).tree;
const shaOf = (frag) => tree.find((f) => f.type === 'blob' && f.path.includes(frag) && f.path.endsWith('卡片图.png')).sha;

for (const [name, frag] of Object.entries(WANT)) {
  const sha = shaOf(frag);
  const tmp = `scripts/_dl/${name}.blob.json`;
  const out = `scripts/_dl/${name}_card.png`;
  try {
    execFileSync('curl', ['-s', '-m', '120', '-A', 'Mozilla/5.0', '--retry', '3', '-o', tmp, BLOB_API + sha], { stdio: 'inherit' });
  } catch (e) { console.log(name, 'CURL FAIL', e.message); continue; }
  const b = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  if (!b.content) { console.log(name, 'NO CONTENT', JSON.stringify(b).slice(0, 200)); continue; }
  const buf = Buffer.from(b.content, 'base64');
  fs.writeFileSync(out, buf);
  fs.unlinkSync(tmp);
  const m = await sharp(buf).metadata();
  console.log(`${name}\t${m.width}x${m.height}\t${m.format}\t${(buf.length/1024).toFixed(0)}KB`);

  const { data, info } = await sharp(buf).greyscale().resize(36, 48, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  const s = [];
  for (let y = 0; y < info.height; y++) {
    let dark = 0;
    for (let x = 0; x < info.width; x++) { if (data[y * info.width + x] < 180) dark++; }
    const r = dark / info.width;
    s.push(r > 0.85 ? '#' : r > 0.6 ? '+' : r > 0.3 ? '.' : ' ');
  }
  for (let g = 0; g < 8; g++) console.log('   [' + g + '] ' + s.slice(g * 6, g * 6 + 6).join(''));
}
console.log('DONE');
