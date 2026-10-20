# 飞盘奇门排盘

手机优先 · 仙气飘飘 · 可离线的**飞盘奇门遁甲排盘**网站（PWA）。纯前端静态站，可一键部署到 Netlify。

> ⚠️ 这是**飞盘**奇门，不是转盘奇门。两者排盘算法不同，本项目的核心（定局、值符值使、九星八门九神飞布）均按飞盘规则实现，默认参数与微信小程序「热卜」对齐。

## 技术栈

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4（`@tailwindcss/vite`）
- Framer Motion（宫详情弹层等动效）
- `lunar-javascript`（农历 / 干支 / 节气 / 纳音 / 旬空）
- 排盘内核自研纯 TS（三元定局、置闰、寄宫、飞布），与 UI 零耦合，带 Vitest 单元测试
- `vite-plugin-pwa`（manifest + Service Worker + 离线）
- IndexedDB（`idb`）本地记录存储，可导出 / 导入 JSON

## 本地运行

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器（SW 不干扰 HMR）
npm test           # 运行排盘内核单元测试
npm run build      # 类型检查 + 构建到 dist/
npm run preview    # 本地预览构建产物（可测试离线）
npm run icons      # 由 public/icons/*.svg 重新生成 PNG 图标（需要 sharp）
```

## 部署到 Netlify

项目已带好 `netlify.toml`（构建命令 `npm run build`、发布目录 `dist`、SPA 回退）与 `public/_redirects`，任选其一：

1. **连接 Git 仓库**（推荐）：把本项目推到 GitHub / GitLab，在 Netlify 里「Import from Git」选择该仓库，构建命令与发布目录会自动读取 `netlify.toml`，无需手动填写。
2. **拖拽部署**：本地 `npm run build` 后，把 `dist/` 文件夹直接拖进 Netlify 的「Deploy manually」。
3. **CLI**：`npm i -g netlify-cli` → `netlify deploy --prod --dir=dist`。

部署后默认是公开站点（Netlify 免费套餐）。

## 添加到主屏幕（PWA）

- **Android / Chrome / Edge**：打开站点 → 浏览器菜单「安装应用」，或设置页 →「安装到主屏幕」→「安装飞盘奇门」。
- **iOS / Safari**：Safari 打开 → 底部「分享」→「添加到主屏幕」。本站已带 `apple-mobile-web-app-*` 元信息与 180×180 `apple-touch-icon`。
- 安装后即以独立窗口运行，Service Worker 已预缓存全部静态资源，**断网可打开**；新版本自动更新（`registerType: 'autoUpdate'`）。

## 飞盘排盘规则（决策已锁定）

| 项 | 规则 |
|---|---|
| 盘式 | 飞盘（不实现转盘） |
| 定局法 | **置闰法**，置闰天数阈值**满 8 天**（热卜口径，局数进位处留有 TODO，待对盘微调） |
| 阴阳遁 | 冬至后阳遁、夏至后阴遁 |
| 寄宫 | 默认**寄坤二**，设置页可切换（寄艮八 / 阳寄艮·阴寄坤 / 阳寄坤·阴寄艮） |
| 九星 | 蓬→芮→冲→辅→禽→心→柱→任→英（洛书 1–9），**阴阳遁皆顺飞** |
| 八门 | 休→死→伤→杜→开→惊→生→景，**全部顺飞** |
| 飞盘中门 | 使用：八门可落中五宫，落中宫者**保留原门名**（如「伤门」，不写「中门」） |
| 九神 | 阳遁：值符·螣蛇·太阴·六合·勾陈·太常·朱雀·九地·九天；阴遁：值符·螣蛇·太阴·六合·白虎·太常·玄武·九地·九天。**含太常（九神制）**，值符神随值符星落宫，**阳顺阴逆** |
| 值符值使 | 时旬首落宫 → 该宫星为值符、门为值使；值符随时干、值使随时宫 |
| 天盘干 | 星不离干、干随星迁（值符星携本位干飞，余星携各自本位干） |
| 暗干 | 默认**不显示**（热卜口径）；可选值使门起 / 门地盘起 |
| 标注 | 四柱、节气、旬首、旬空（空亡）、马星、年命（出生年天干）、纳音、超神/接气 |

以上均抽象为排盘配置 `PaipanOptions`（默认值即上表），在**设置页**可切换。

### 真太阳时（可选）

设置页可开启「真太阳时」：把输入的北京时间换算为真太阳时后起局。换算为

```
真太阳时 = 北京时间 + 4 × (当地经度 − 120°) 分钟 + 均时差
```

均时差采用 NOAA 天文近似公式（纯天文学，非流派分歧）。默认关闭、默认经度 120°。

## 目录结构

```
src/
  core/
    qimen/          # 排盘内核（纯 TS，含 __tests__ 单元测试）
      constants.ts  #   九星/八门/九神/三奇六仪/洛书/24节气局数表
      dingju.ts     #   节气→阴阳遁→局数（置闰法，满 8 天）
      dipan.ts      #   地盘三奇六仪（含寄宫）
      zhifu.ts      #   旬首→值符值使
      feixing.ts    #   九星/八门/九神/天盘干/暗干/马星飞布
      biaozhu.ts    #   四柱/旬首/旬空/纳音/年命
      truesolar.ts  #   真太阳时换算（均时差 NOAA 近似公式）
      index.ts      #   入口：排盘(时间, 年命, 选项) => QimenPan
    storage/        # IndexedDB 记录 CRUD + 导入导出；设置持久化
  components/       # 九宫格 / 列表 / 简明视图、宫详情弹层、底部 Tab
  pages/            # 排盘 / 记录 / 设置
  hooks/            # usePWAInstall 等
public/icons/       # SVG 源 + 生成的 PNG（192/512/maskable/apple-touch）
netlify.toml  _redirects  # Netlify 部署配置
```

## 排盘依据（参考资料）

- 飞盘起局排法思路：https://www.sohu.com/a/398138537_120339516
- 飞盘奇门遁甲排局方法：https://www.daoisms.com.cn/2010/01/12/23206/
- 飞盘 vs 转盘区别：https://zhuanlan.zhihu.com/p/629192669
- 三元定局（置闰/拆补/茅山）：https://www.sohu.com/a/458513794_120071450
- 历法库 lunar-javascript：https://github.com/6tail/lunar-javascript

> 排盘算法中每处均以中文注释标注**依据**；凡流派分歧或规则不确定处，均以与参考软件「热卜」对齐为准，未对齐处标 `TODO` 待对盘后再调。
