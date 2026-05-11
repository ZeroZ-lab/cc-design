# CEO Scout Feedback: Interactive Explainer

## Verdict
**Important** -- 方向可行，但 v0.1 范围偏大，需要砍一刀再动手。

---

## Evidence Used

- **local:** cc-design v0.5.1 现有 10 个 templates（全部 JSX/JS/CSS）、58+ references、30+ taskTypes；brainstorm 文档的三次方案迭代记录；spec 的 "不做" 清单和开放问题
- **external:** 网络搜索不可用，以下判断基于 inferred
- **inferred:** AI/SaaS/Infra 团队的解释需求真实存在（RAG pipeline、Agent workflow、架构对比是高频场景），但当前解决方式多样（Excalidraw、Miro、手写 HTML、Figma 原型、Slidev），cc-design 的差异化在于 AI 驱动 + 高保真 + 零操作成本

---

## Findings

### Blocking Issues

无。问题真实，方案方向正确，不需要停。

### Important Issues

**1. [Important] v0.1 做三个模板是过度范围 -- 先做 flow_explainer 一个就够了**

来源: local + inferred

理由: cc-design 现有 10 个模板中，没有一个的交互复杂度接近 explainer（step-by-step 播放 + hover 聚焦 + 入场动画 + SVG 连线 + 响应式）。这是全新的模板模式，第一个模板会暴露所有未知问题：SVG 路径计算、步骤状态机、移动端触摸交互、prefers-reduced-motion 降级。三个模板意味着三倍的 bug 面积，v0.1 没必要承担。

建议: v0.1 只做 `flow_explainer.html`。它覆盖最高频场景（RAG pipeline、Agent workflow、请求处理链路），且技术挑战最大 -- 如果它能做好，layer 和 compare 是布局变体，难度低一个量级。

**2. [Important] 模板内嵌 schema 的做法需要验证 -- 这是整个方案的关键风险点**

来源: local

理由: cc-design 现有模板都是代码模板（JSX 引擎、CSS token 文件、device frame），不是数据模板。Explainer 模板第一次把"数据结构"放进 HTML 注释让 AI 学习 -- 这意味着 AI 需要从注释中理解 schema，然后在生成时正确填充数据。如果 AI 的 schema 遵循率低（比如遗漏 steps 数组的 focus 字段、edge 的 from/to 写错），交互就会直接坏掉。

建议: v0.1 在 flow_explainer 模板中显式验证这一点。在验收标准里加一条："用 5 个不同 prompt 测试生成结果，schema 遵循率 >= 4/5"。如果不行，v0.1 就要退回到独立 JSON schema。

**3. [Important] 目标用户的痛感描述不够尖锐 -- "需要比 PPT 更好的解释资产"是弱的痛点陈述**

来源: inferred

理由: "比 PPT 更好"是功能对比，不是痛点。真正的痛点是：(a) 售前需要在客户面前实时解释架构，静态图不够，手绘太粗糙；(b) 技术博客作者需要 embed 一个可交互的流程图，但 Excalidraw 输出不够精美，手写 SVG 太费时间；(c) PM 需要给非技术利益相关者解释 RAG pipeline，截图看不懂，录屏太长。这些场景的共通点是"需要高保真 + 可交互 + 快速产出"，而 cc-design 的 AI 驱动模式恰好命中。

建议: 在 spec 里补充 2-3 个具体场景的痛点描述，用作验收时的"真实场景测试"依据。

**4. [Important] 对 cc-design 的价值杠杆不够清晰 -- 是新用户入口还是现有用户增强？**

来源: local + inferred

理由: spec 同时列了三种目标用户（产品团队、售前、技术布道者），但没说这个功能主要是用来吸引新用户（"来用 cc-design 做交互式解释"）还是增强现有用户粘性（"我本来用它做 landing page，现在还能做 explainer"）。这两者的设计取舍不同：如果是获客入口，模板质量是 P0，因为第一次生成的效果决定了留存；如果是粘性增强，与现有工作流的衔接（比如从 landing page 里的一个架构图跳转到 explainer）更重要。

建议: 明确 v0.1 的主要价值杠杆是哪一种。推荐定位为"现有用户的增强" -- 因为 cc-design 的安装和激活门槛已经不低，新增 explainer 不太可能是独立获客入口。

**5. [Important] 成功标准缺少量化 -- "MVP 如何判断有效"没有回答**

来源: local

理由: 验收标准全部是功能性的（"能识别"、"能运行"、"无错误"），没有商业有效性指标。这不阻塞开发，但阻塞后续决策（v0.2 做什么、三个模板是否都值得做）。

建议: 补充 v0.1 的北极星指标建议。例如："3 个内部测试用户在 15 分钟内从 prompt 到满意输出的成功率 >= 2/3"。不需要精确数据，但需要一个可判断的门槛。

### Suggestions

**6. [Suggestion] "不做"清单很扎实，但建议加一条：不做自动布局算法**

来源: inferred

理由: 节点图的自动布局（dagre、elkjs 等）是工程黑洞。v0.1 的模板应该用固定布局位置（模板定义好节点位置规则），AI 只填充数据。自动布局留给 v2 或永远不做。

**7. [Suggestion] 节点数量上限的建议值偏低，可以放宽但设定硬上限**

来源: inferred

理由: flow <= 8 节点、compare <= 6 对比点在移动端是合理的，但桌面端可以更大。建议用 viewport 自适应：桌面端 flow 上限 12，移动端上限 6。硬上限（报错提示）设在 15。

**8. [Suggestion] 检测关键词列表太窄，建议补充场景化关键词**

来源: local

理由: spec 列了 9 个检测关键词，但漏了高频同义表达：pipeline, workflow, system architecture, tech stack, how it works, 原理, 机制, 链路, 技术架构, 数据流, 交互图表, 演示页面。检测面太窄意味着很多 explainer 需求会被路由到通用 landing-page，生成错误类型的输出。

**9. [Suggestion] 考虑把 flow_explainer 拆成两个变体而非一个**

来源: inferred

理由: 流程图有两种典型布局：线性流程（A -> B -> C -> D）和分支流程（带 decision 菱形）。线性流程用 SVG 直线/曲线就够了，分支流程需要处理分支合并、回环等复杂拓扑。v0.1 先只做线性流程会更安全。

---

## Spec Impact

### Adopt
- v0.1 范围从 3 模板砍到 1 个（flow_explainer），layer 和 compare 推到 v0.2
- 补充 2-3 个具体场景的痛点描述
- 验收标准新增 schema 遵循率测试
- 明确 v0.1 的价值杠杆定位（建议：现有用户增强）
- 检测关键词补充场景化同义词
- "不做"清单补充"不做自动布局算法"

### Reject
- （无）spec 的"不做"清单和核心原则不需要推翻

### Ask User
1. v0.1 的价值杠杆定位：获客入口 还是 现有用户增强？
2. 砍到 1 个模板是否可接受？还是坚持 3 个？
3. 北极星指标用什么？建议"3 个测试用户 15 分钟内成功率 >= 2/3"
