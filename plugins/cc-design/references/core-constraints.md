# Core Constraints — 始终加载的核心约束层

> **Load when:** Every design task(all-design-tasks 基础必载包第一位)。
> **Role:** 本文件是摘要+索引,不是替换。完整规则见各区块末尾的"详见"指针。

---

## §1 Iron Law(违反 = 硬停止)

1. **No unchecked fact = no design decision** — 陈述品牌/产品/价格/发布状态/规格前,必须先 WebSearch 验证。猜 = 返工。
   - ❌ 禁止:"I remember…"/"As far as I know…"/"It should be like this"(指可查事实时)
   - ✅ 无法验证时:"I cannot confirm this — please check."
2. **No AI slop patterns. Ever.** — 见 §2 速查表。违反则删除并替换为最简替代,不要争论哪个"没那么糟"。
3. **No screenshot after final edit = no delivery.** — 代码审查永远不够。每次最终编辑后必须渲染 + 截图 + 逐 section 检查。

详见 `references/design-iron-law.md`。

---

## §2 AI Slop 速查表(违反即删)

| 模式 | 一句话识别 | 替代方案 |
|---|---|---|
| 全屏紫粉蓝渐变 | rainbow/mesh/purple→pink→blue | 单色微妙渐变或纯色;必要用时仅作 hover 微 accent |
| 圆角卡 + 左边框色 | `border-radius + border-left: 4px solid` | 背景对比/字重对比/分隔线/不用卡 |
| emoji 装饰 | 🚀✨💡🎯 在标题/特性/CTA 前 | 真图标库(Lucide/Heroicons/Phosphor)或留空 |
| SVG 画人物/场景/物体 | AI 风插画,blob 角色 | 灰色占位框 + 文字标签"Illustration Placeholder WxH" |
| 假数据/假评价 | "10000+ users"/"99.9% uptime" 无来源 | 占位符"Your metric here"或向用户索取真实数据 |
| bento grid(非必要) | 所有 landing 都想做 bento | 按 信息结构选布局,非必要不用 |
| dark mode slop | `#0D1117` + neon + glowing border | 仅开发者工具类产品用,且需有意为之 |
| glassmorphism slop | 三层 frosted glass 叠加 + 全屏 blur | glass 仅作 accent,不作整体设计语言 |
| illustration slop | flat vector + pastel + 挥手角色 | 真实摄影,或不用 |
| stats section slop | 四个数字一排无来源无上下文 | 有真实数据才放,并给上下文;否则删 |
| feature slop | 3 列 icon+title+desc,三列听起来一样 | 真产品有价值差异才用;否则重构信息 |
| badge slop | "New/Popular/Beta/🔥" 贴满 | badge 仅用于真实例外,不用于装饰 |

详见 `references/content-guidelines.md`(完整规则)与 `references/anti-patterns/`(分场景反模式)。

---

## §3 禁用字体

❌ Inter / Roboto / Arial / Helvetica / Fraunces / Space Grotesk / 纯 system font stack

✅ 替代方向:
- Serif display + sans body(editorial 感)— 如 Instrument Serif + Geist Sans
- Mono display + sans body(technical 感)— 如 JetBrains Mono + Suisse Int'l
- Heavy display + light body(强对比)
- Google Fonts 小众好选择:Instrument Serif / Cormorant / Bricolage Grotesque / JetBrains Mono

不要凭空捏造字体名。

详见 `references/content-guidelines.md` Typography Traps。

---

## §4 交付前必查清单(Mandatory Pre-Delivery)

**结构检查:**
- [ ] console 无 error(`browser_console_messages` level: error → 0)
- [ ] 所有目标 viewport 已测试(至少 desktop + 1 个窄屏)
- [ ] 每个 touched section 已独立截图(不止首屏)

**视觉检查:**
- [ ] 字号符合 scale(slides ≥24px / web ≥14px / mobile ≥16px)
- [ ] 间距为 8px 倍数
- [ ] 对比度 ≥ 4.5:1(WCAG AA)

**slop 检查:** 逐项过 §2 的 12 项,任何一项命中 = 删除并替换。

详见 `references/verification-protocol.md`(完整三阶段协议)。

---

## §5 STOP Signals(命中即停并重评)

| 信号 | 含义 | 动作 |
|---|---|---|
| 颜色靠记忆,非从品牌资产提取 | 设计上下文失败 | STOP. 提取真实品牌色 |
| 间距无一致 scale | 缺设计系统 | STOP. 先建立 8px scale |
| Hero 精致,其余崩 | 选择性验证 | STOP. 逐 section 独立验证 |
| 编造数据/评价 | P0 违反,不可修复 | STOP. 删除,用占位符或真实来源 |
| 字体无角色理由就选定 | 装饰优于系统 | STOP. 按角色分配,至多 2 核心 + 1 mono |
| 所有 section 用同一布局 | 模式懒惰 | STOP. 按内容类型变化布局密度 |
| 元素用于填空白 | 怕留白 | STOP. 留白是设计元素,不填 |
| 交互元素无状态覆盖 | 交互设计不完整 | STOP. 每个 interactive 元素需 default/hover/active/(disabled)/(error) |

详见 `references/design-red-flags.md`(完整自省信号表)。

---

## §6 Scale Specs(最小字号)

| 场景 | 最小字号 |
|---|---|
| Slides (1920×1080) | body ≥ **24px**(理想 28-36px),title 60-120px |
| Web | body ≥ **14px**,hit target ≥ **44×44px** |
| Mobile | body ≥ **16px**(避免 iOS auto-zoom) |
| Print | body ≥ **10pt**(~13.3px),caption 8-9pt |
| 对比度 | body vs bg ≥ **4.5:1**,large text ≥ **3:1** |
| 行高 | 1.5-1.7(CKJ 1.7-1.8) |

详见 `references/content-guidelines.md` Scale Specifications。

---

## §7 Deep-Dive Index(展开层)

本文件是摘要。需要深入时,按主题查阅:

| 主题 | 展开文件 |
|---|---|
| 完整 slop 规则与 CSS 示例 | `references/content-guidelines.md` |
| 分场景反模式(color/layout/typography/interaction) | `references/anti-patterns/{color,layout,typography,interaction}.md` |
| 完整自省信号 + 人类伙伴信号 | `references/design-red-flags.md` |
| 常见说辞 debunk | `references/design-common-sayings.md` |
| 验证协议全流程(三阶段 + fix loop) | `references/verification-protocol.md` |
| Iron Law 完整定义 | `references/design-iron-law.md` |
