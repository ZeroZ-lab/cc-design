# 执行计划: 浏览器音频播放 + 视频导出音效系统

## 概览

- **artifact_type**: software
- **总任务数**: 12（含修复）
- **总复杂度**: L
- **关键依赖**: `templates/animations.jsx`（Stage + Sprite 时间线引擎）

### Reviewer 反馈关键修复

| 发现问题 | 来源 | 修复方式 |
|---------|------|---------|
| `onSeek` 回调缺失 — Stage 组件不支持外部监听 scrubbing | Eng + Design | 新增 T3.5: 向 `animations.jsx` 的 Stage 添加 `onSeek` prop |
| `add-music.sh` 从 `assets/bgm-*.mp3` 读取，T2 放 `assets/bgm/` 路径冲突 | CEO + Eng | T2: BGM 放在 `assets/` 根目录（`assets/bgm-tech.mp3`），保持兼容 |
| `add-sfx-to-video.sh` JSON 字段注入风险 | Security | T8: 输入验证 + bash array 构建参数，弃用 `node -e` fallback |
| README 第137行说音频资产不提交 | CEO | T10: 新增 README.md 更新 |
| `<audio>` Safari 降级被低估为"低风险" | Eng + Design | T3: 文档化为第二引擎，GainNode 拓扑 + 懒加载设计 |
| 自动播放策略导致初次体验脱节 | Design | T3: AudioContext 初始化前 Stage 显示"点击启用音频"覆盖层 |
| `sfxDensity` 字段语义误导 | Design | 改名为 `_sfxDensityHint`（带下划线，表明仅供 agent 参考） |
| UA sniffing 脆弱 | Security | 改用 feature detection: `'AudioContext' in window` |
| MP3 资产完整性校验 | Security | T1/T2: 添加 SHA256 CHECKSUMS.sha256 文件 |
| 音频控件与 Stage 控件栏重叠 | Design | T7: audio-controls 折叠到 Stage 现有底部控件栏 |
| SFX 数量过大（37个） | CEO | 保留 37 但 T1 分两步执行（先 15 核心 + 再 22 扩展） |

### 执行阶段

```
阶段 1 (并行)            阶段 2 (并行)             阶段 3                  阶段 4
┌─────────────────┐    ┌───────────────────┐    ┌──── audio-controls.jsx
│ T1a SFX (15核心) │──┬─┤ T3 audio-engine   │───▶│──── audio-engine 组件完成
│ T1b SFX (22扩展) │  │ │ (内核 + SFX +     │    └──── load-manifest
│ T2  BGM          │  │ │  BGM + Soundtrack) │         + 回归测试
│ T10 文档更新     │  │ │ T3.5 animations.jsx│
└─────────────────┘  │ │   onSeek prop      │
                      │ │ T8 add-sfx-to-    │
                      │ │    video.sh       │
                      │ └───────────────────┘
                      └── T1b(22扩展) 可在阶段2-3之间独立执行
```

---

## 并行执行矩阵

| Task | Depends On | parallel_safe | Complexity | 主要变更文件 |
|------|-----------|---------------|------------|------------|
| T1a  | —         | true          | M          | `assets/sfx/` + 15 MP3 + CHECKSUMS.sha256 |
| T1b  | T1a       | true          | M          | `assets/sfx/` + 22 MP3 |
| T2   | —         | true          | S          | `assets/bgm-*.mp3` + CHECKSUMS.sha256 |
| T3   | T1a, T2   | true          | L          | CREATE `templates/audio-engine.jsx` |
| T3.5 | —         | true          | S          | EDIT `templates/animations.jsx` |
| T4   | T3        | false         | M          | EDIT `templates/audio-engine.jsx` |
| T5   | T3        | false         | S          | EDIT `templates/audio-engine.jsx` |
| T6   | T4, T5    | false         | S          | EDIT `templates/audio-engine.jsx` |
| T7   | T3, T3.5  | false         | M          | CREATE `templates/audio-controls.jsx` |
| T8   | T1a, T2   | true          | M          | CREATE `scripts/add-sfx-to-video.sh` |
| T9   | T3, T7    | false         | S          | EDIT `load-manifest.json` |
| T10  | —         | true          | S          | EDIT `references/sfx-library.md`, `README.md`, `references/audio-design-rules.md` |
| T11  | T3-T7     | false         | S          | 无文件变更（仅验证） |

---

## 任务分解

### T1a: SFX 核心资产（15 个核心 SFX）

- **复杂度**: M
- **依赖**: 无
- **并行安全**: 是
- **验收标准**:
  - [ ] `assets/sfx/` 目录已创建，包含 9 子目录
  - [ ] 15 个核心 SFX MP3 已放入对应子目录：
    - keyboard: type*, type-fast*, enter*
    - ui: click*, click-soft, focus, toggle-on
    - transition: whoosh*, whoosh-fast, swipe-horizontal, slide-in
    - container: card-snap, modal-open
    - feedback: success-chime, error-tone, notification-pop
    - progress: complete-done, generate-start
    - impact: logo-reveal*, logo-reveal-v2, brand-stamp
    - magic: sparkle, ai-process
    - terminal: command-execute, output-appear
    (* 标注的为 v7b 核心音效，优先匹配)
  - [ ] 前 5 个 SFX 的品质已通过试听验证（与 sfx-library.md prompt 描述匹配）
  - [ ] 格式为 MP3, 44.1kHz, 每个 < 200KB
  - [ ] 已生成 `assets/sfx/CHECKSUMS.sha256`
  - [ ] 所有文件通过 git 提交
- **搜索优先级**: Pixabay（免 API key）> Mixkit > FreePD > freesound.org（需 API key）
- **实现要点**:
  - 11个核心 SFX + 4个 v7b 保留音效 = 15 个
  - 先用 Pixabay 搜索（不需 API key 即可下载），再尝试 Mixkit
  - ElevenLabs prompt notes 作为搜索关键词
  - 下载后试听验证品质一致
  - 生成 CHECKSUMS: `cd assets/sfx && shasum -a 256 *.mp3 keyboard/*.mp3 ui/*.mp3 ... > CHECKSUMS.sha256`
- **文件变更**:
  - CREATE: `assets/sfx/` + 9 子目录
  - CREATE: 15 个 `.mp3` 文件
  - CREATE: `assets/sfx/CHECKSUMS.sha256`

### T1b: SFX 扩展资产（剩余 22 个 SFX）

- **复杂度**: M
- **依赖**: T1a（目录结构就绪后添加文件）
- **并行安全**: 是（可在阶段 2-3 之间独立执行）
- **验收标准**:
  - [ ] 剩余 22 个 SFX MP3 已填充到对应子目录
  - [ ] 文件大小和格式与 T1a 一致
  - [ ] CHECKSUMS.sha256 已更新
- **说明**: 与 T1a 分开执行以避免第一阶段阻塞。核心 15 个 SFX 足够覆盖 80% 场景，扩展 SFX 可在主线工作（T3-T8）进行期间并行搜索。

### T2: BGM 资产

- **复杂度**: S
- **依赖**: 无
- **并行安全**: 是
- **验收标准**:
  - [ ] 6 个 BGM MP3 已放入 `assets/` 根目录（保持与 `add-music.sh` 兼容）
  - [ ] 文件命名: `bgm-tech.mp3`, `bgm-tutorial.mp3`, `bgm-educational.mp3`, `bgm-ad.mp3`, `bgm-tech-alt.mp3`, `bgm-tutorial-alt.mp3`
  - [ ] 风格匹配（tech=minimal synth+piano, tutorial=warm instructional, educational=curious thoughtful, ad=upbeat/promotional）
  - [ ] 格式为 MP3, 44.1kHz, 每个 < 5MB
  - [ ] 已生成 `assets/CHECKSUMS.sha256`
  - [ ] 通过 git 提交
- **路径说明**: BGM 放在 `assets/` 根目录（`assets/bgm-tech.mp3`），不是 `assets/bgm/bgm-tech.mp3`。现有 `add-music.sh` 从根目录搜索 `bgm-*.mp3`，此路径保持零中断兼容。
- **文件变更**:
  - CREATE: `assets/bgm-tech.mp3`, `bgm-tutorial.mp3`, `bgm-educational.mp3`, `bgm-ad.mp3`, `bgm-tech-alt.mp3`, `bgm-tutorial-alt.mp3`
  - CREATE: `assets/CHECKSUMS.sha256`（追加方式）

### T3: audio-engine.jsx — AudioEngine 内核

- **复杂度**: L
- **依赖**: T1a, T2（资产路径需在引擎中硬编码）
- **并行安全**: 是（与 T3.5, T8 并行）
- **验收标准**:
  - [ ] `window.AudioEngine` 全局单例已挂载
  - [ ] `AudioEngine.init()` 创建 AudioContext 并 resume。初始化延迟到首次用户手势
  - [ ] `AudioEngine.playSFX(path, options?)`: 支持 `{volume, delay}`。`path` 映射到 `assets/sfx/<path>.mp3`
  - [ ] `AudioEngine.playBGM(src, options?)`: 循环播放，支持 `{volume, loop}`。`src` 映射到 `assets/<src>.mp3`
  - [ ] `AudioEngine.stopBGM()` / `AudioEngine.stopAll()`: 停止所有活动源
  - [ ] `AudioEngine.setVolume('sfx', n)` / `AudioEngine.setVolume('bgm', n)`: 独立控制双轨音量
  - [ ] `AudioEngine.mute()` / `AudioEngine.unmute()`: 静音不破坏音量设置
  - [ ] `AudioEngine.loadPreset(name)`: 加载场景预设
  - [ ] Buffer Cache: `Map<string, Promise<AudioBuffer>>`，懒加载 + 缓存。首次 `playSFX()` 触发 `fetch` + `decodeAudioData`，缓存后复用
  - [ ] 缺失/无法解码的 SFX 文件静默跳过，console.warn 提示——不中断动画
  - [ ] BGM 切换为硬切（停止旧 → 开始新），记录为已知限制
  - [ ] 非 Safari: `AudioContext` 路径。Safari: feature detection（`'AudioContext' in window`）失败时 fallback 到 `<audio>` 元素
  - [ ] Autoplay 策略：初始化前 Stage 显示"点击启用音频"覆盖层，暂停动画直到用户交互
  - [ ] 与 `animations.jsx` 无冲突
  - [ ] 代码风格: IIFE 模式，与 `animations.jsx` 一致
- **内部架构**:
  ```
  AudioEngine (window.AudioEngine)
    ├── _initialized: boolean
    ├── _ctx: AudioContext | null
    ├── _masterGain: GainNode (总控)
    │   ├── _sfxGain: GainNode → setVolume('sfx', n)
    │   └── _bgmGain: GainNode → setVolume('bgm', n)
    ├── _bufferCache: Map<string, Promise<AudioBuffer>>
    ├── _activeSources: Set<AudioBufferSourceNode> (生命周期追踪)
    ├── _currentBGM: { src, source, gain } | null
    ├── _muted: boolean
    ├── presets: { [name]: PresetConfig }
    │
    ├── init()          // 创建 AudioContext + GainNode 拓扑 + resume()
    ├── playSFX()       // fetch → decode → play via BufferSource + sfxGain
    ├── playBGM()       // fetch → decode → loop via BufferSource + bgmGain
    ├── stopBGM()       // 停止 _currentBGM.source
    ├── stopAll()       // _activeSources.forEach(s => s.stop())
    ├── setVolume()     // sfxGain.gain.value / bgmGain.gain.value
    ├── mute/unmute()   // _masterGain.gain.value = 0 / restore
    └── loadPreset()    // 加载预设（配置，非时间线）
  ```
- **Safari 回退**: 使用 feature detection。`'AudioContext' not in window` 时，所有 AudioContext 方法改为使用 `<audio>` 元素。`<audio>` 不支持 `stopAll()` 细粒度控制——改为 `document.querySelectorAll('audio[data-audio-engine]').forEach(a => a.pause())`。
- **文件变更**:
  - CREATE: `templates/audio-engine.jsx`

### T3.5: animations.jsx — 添加 onSeek prop

- **复杂度**: S
- **依赖**: 无
- **并行安全**: 是（与 T3, T8 独立）
- **验收标准**:
  - [ ] `<Stage>` 组件接受 `onSeek` prop
  - [ ] `handleSeek` 触发时调用 `onSeek(time, prevTime)`，传递当前位置和之前位置
  - [ ] `handleScrub` 拖拽（mouse down + move）不触发 `onSeek`，仅在 mouse up 时触发
  - [ ] 代码向后兼容：不传此 prop 时无行为变化
  - [ ] 格式: `onSeek?: (time: number, prevTime: number) => void`
- **实现要点**:
  - `animations.jsx` 第 246 行附近的 `handleSeek` 中添加 `props.onSeek?.(newTime, currentTime)`
  - `handleScrub` 鼠标松开时调用 `onSeek`
  - `audio-engine.jsx` 监听 `onSeek`（通过 `window.__audioOnSeek` 或 Stage 传 prop——推荐 prop 方式）
  - 实际上 T3.5 提供 prop，T3 通过 `window.__audioOnSeek` 挂在 engine 上
- **文件变更**:
  - EDIT: `templates/animations.jsx`（添加 `onSeek` prop 到 Stage）

### T4: audio-engine.jsx — `<SFX>` 组件

- **复杂度**: M
- **依赖**: T3（AudioEngine 内核），T3.5（scrub 事件通知）
- **并行安全**: 否（与 T3 同文件）
- **验收标准**:
  - [ ] `<SFX at={2.5} src="keyboard/type" />` 正常工作
  - [ ] `at` 单位为秒，相对于最近 `<Sprite>` 的开始时间（`useSprite().elapsed`）
  - [ ] `elapsed` 首次达到 `at` 时触发 `AudioEngine.playSFX(src)`
  - [ ] 使用 `useRef` 记录已触发的 SFX，防止重复触发
  - [ ] 支持 `disabled` prop（条件禁用）
  - [ ] 支持 `volume` prop（覆盖默认音量）
  - [ ] Sprite 卸载时不主动停止 SFX（允许自然播完）
  - [ ] Scrubbing 时：重置 firedRef，停止当前 SFX（通过 T3.5 的 onSeek 机制）
  - [ ] 不在 `useSprite()` 上下文内时静默无操作
  - [ ] 嵌套 Sprite 从最内层读取 SpriteContext（React Context 标准行为）
  - [ ] `at={0}` 在 Sprite 挂载时正确触发（特殊处理：挂载时 `elapsed=0` 且 `firedRef=false` 时触发）
- **文件变更**:
  - EDIT: `templates/audio-engine.jsx`

### T5: audio-engine.jsx — `<BGM>` 组件

- **复杂度**: S
- **依赖**: T3
- **并行安全**: 否（与 T3 同文件）
- **验收标准**:
  - [ ] `<BGM src="bgm-tech" volume={0.45} />` 挂载时调用 `AudioEngine.playBGM()`
  - [ ] 卸载时自动 `stopBGM()`
  - [ ] 支持 `volume` prop（默认 0.45）
  - [ ] 支持 `loop` prop（默认 true）
  - [ ] 多个 `<BGM>` 同时存在时最后一次调用的生效
- **文件变更**:
  - EDIT: `templates/audio-engine.jsx`

### T6: audio-engine.jsx — `<Soundtrack>` 组件 + Preset 配置

- **复杂度**: S
- **依赖**: T4, T5
- **并行安全**: 否（与 T3 同文件）
- **验收标准**:
  - [ ] `<Soundtrack preset="terminal-demo">` 包裹子元素
  - [ ] 挂载时调用 `AudioEngine.loadPreset('terminal-demo')`
  - [ ] 卸载时清理（停止 BGM）
  - [ ] 预设是配置对象，不预定义 SFX 时间点
  - [ ] `_sfxDensityHint` 字段仅供 agent 参考，运行时忽略
- **预设配置**:
  ```js
  presets = {
    'terminal-demo':        { bgm: 'bgm-tech', bgmVolume: 0.45, sfxVolume: 1.0 },
    'product-launch':       { bgm: 'bgm-tech', bgmVolume: 0.45, sfxVolume: 1.0 },
    'tutorial-walkthrough': { bgm: 'bgm-tutorial', bgmVolume: 0.50, sfxVolume: 1.0, _sfxDensityHint: 'low' },
    'ai-generation':        { bgm: 'bgm-tech-alt', bgmVolume: 0.40, sfxVolume: 1.0, _sfxDensityHint: 'high' },
  }
  ```
- **文件变更**:
  - EDIT: `templates/audio-engine.jsx`

### T7: audio-controls.jsx — 音频控件 UI

- **复杂度**: M
- **依赖**: T3（AudioEngine API），T3.5（Stage onSeek 已就位）
- **并行安全**: 否
- **验收标准**:
  - [ ] SFX 音量滑块: 0-1, 步长 0.1，调用 `AudioEngine.setVolume('sfx', value)`
  - [ ] BGM 音量滑块: 0-1, 步长 0.1，调用 `AudioEngine.setVolume('bgm', value)`
  - [ ] BGM 选择器: 下拉选择全部 6 首 BGM + "None"
  - [ ] 重置按钮: SFX→1.0, BGM→0.45
  - [ ] 静音/取消静音按钮
  - [ ] AudioEngine 未 init 时显示"点击启用音频"覆盖层
  - [ ] 控件位**嵌入 Stage 现有底部控件栏**，不创建独立的浮动元素
  - [ ] UI 风格与现有 Stage 控件一致（暗色半透明）
- **布局说明**: audio-controls.jsx 不创建独立的浮动面板。控件插入到 Stage 现有的 `stageStyles.controls` 底部栏中，放在 scrubber 右侧。具体：在 BGM 选择器和音量滑块之间使用 `gap: 8px` 水平排列。
- **文件变更**:
  - CREATE: `templates/audio-controls.jsx`

### T8: add-sfx-to-video.sh — ffmpeg 混音脚本

- **复杂度**: M
- **依赖**: T1a, T2（资产路径确定）
- **并行安全**: 是（与 T3 浏览器引擎完全独立）
- **验收标准**:
  - [ ] 接受参数: `video.mp4` `sfx-timeline.json` `[--music=bgm.mp3]`
  - [ ] sfx-timeline.json 格式: `[{"src":"assets/sfx/...","time":1.0}, ...]`
  - [ ] 每个 SFX 用 `-itsoffset <time> -i <src>` 对齐时间点
  - [ ] 所有 SFX 通过 amix 合并
  - [ ] BGM 可选，提供时应用频率隔离（BGM lowpass=4kHz, SFX highpass=800Hz）
  - [ ] BGM 使用 0.3s fade in + 1.5s fade out
  - [ ] normalize=0 保持动态范围
  - [ ] 输出 AAC 192k
  - [ ] 保留原视频流（-c:v copy）
  - [ ] 支持 `--help` 输出
  - [ ] 错误处理：输入不存在、JSON 解析失败时有明确错误信息
  - [ ] JSON 中缺失的 SFX 文件发出 warn 并跳过——不导致 ffmpeg 失败
  - [ ] ✨ 输入验证：`src` 必须匹配 `^assets/(sfx|bgm)/.+\.mp3$`，`time` 必须匹配 `^[0-9]+(\.[0-9]+)?$`
  - [ ] ✨ 使用 bash array 构建参数，不用字符串拼接
  - [ ] ✨ jq 作为必需的依赖（`command -v jq` 检查），不使用 `node -e` fallback
  - [ ] ✨ `set -euo pipefail`
  - [ ] 输出文件: `<input>-sfx.mp4` 或 `--out` 指定
- **注意事项**: 基于现有 `add-music.sh` 模式扩展。BGM 从 `assets/` 根目录读取。
- **文件变更**:
  - CREATE: `scripts/add-sfx-to-video.sh`

### T9: load-manifest.json 更新

- **复杂度**: S
- **依赖**: T3, T7（文件必须存在）
- **并行安全**: 否
- **验收标准**:
  - [ ] `"audio-design"` taskType 新增 `"templates"` 字段: `["templates/audio-engine.jsx", "templates/audio-controls.jsx"]`
  - [ ] 现有其他 taskType 不受影响
  - [ ] 格式有效
- **文件变更**:
  - EDIT: `load-manifest.json`

### T10: 文档更新

- **复杂度**: S
- **依赖**: 无（可基于 spec 先行更新）
- **并行安全**: 是
- **验收标准**:
  - [ ] `references/sfx-library.md`: 顶部注释从"ElevenLabs"更新为免版税来源，添加 License 列追踪每文件来源和授权
  - [ ] `references/audio-design-rules.md`: 第 97 行 BGM 路径更新（确认路径，根目录 `bgm-*.mp3`）；添加浏览器端用法说明
  - [ ] `README.md`: 第 137 行从"Audio assets not included"更新为"Audio assets (SFX + BGM) committed to repository — ~10-14 MB total"
  - [ ] 37 SFX 的 prompt notes 保留（对搜索有参考价值）
  - [ ] 场景推荐组合和用法指南保持不变
- **文件变更**:
  - EDIT: `references/sfx-library.md`
  - EDIT: `references/audio-design-rules.md`
  - EDIT: `README.md`

### T11: 回归测试

- **复杂度**: S
- **依赖**: T3, T4, T5, T6, T7（所有模板完成）
- **并行安全**: 否
- **验收标准**:
  - [ ] 无音频 demo：使用现有 `animations.jsx`（不加载 `audio-engine.jsx`）在 Chrome 中打开 → 动画正常播放，Stage 控件正常，控制台无错误
  - [ ] 有音频 demo：加载 audio-engine.jsx 的 demo → 音频在首次用户交互后触发，Scrubbing 时 SFX 静音、BGM 重定位正确
  - [ ] BGM 切换：在 audio-controls 中选择不同 BGM → 新 BGM 播放，旧 BGM 停止
  - [ ] 音量控制：SFX 和 BGM 音量独立控制 → 验证效果
  - [ ] 静音/取消静音：静音后所有音频停止，取消静音后 BGM 恢复
  - [ ] Firefox 或 Safari（可选）：至少在一个非 Chrome 浏览器中验证基本功能
  - [ ] 测试矩阵覆盖: 播放→暂停→拖拽→继续播放, BGM 切换, 两路音量独立控制
- **文件变更**: 无

---

## 产出清单

| 文件 | 类型 | 任务 |
|------|------|------|
| `assets/sfx/` + 9 子目录 | 新增目录 | T1a, T1b |
| `assets/sfx/*.mp3` (37 个) | 新增媒体 | T1a (15), T1b (22) |
| `assets/sfx/CHECKSUMS.sha256` | 新增校验 | T1a |
| `assets/bgm-tech.mp3` ~ `bgm-tutorial-alt.mp3` (6 个) | 新增媒体 | T2 |
| `assets/CHECKSUMS.sha256` | 新增校验 | T2 |
| `templates/audio-engine.jsx` | 新增模板 | T3, T4, T5, T6 |
| `templates/animations.jsx` | 修改模板 | T3.5 |
| `templates/audio-controls.jsx` | 新增模板 | T7 |
| `scripts/add-sfx-to-video.sh` | 新增脚本 | T8 |
| `load-manifest.json` | 修改配置 | T9 |
| `references/sfx-library.md` | 修改文档 | T10 |
| `references/audio-design-rules.md` | 修改文档 | T10 |
| `README.md` | 修改文档 | T10 |

## 变更风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 部分 SFX 无法从免版税库找到品质匹配 | 中 — 可能需调整分类 | T1a 先验证 5 个样品；核心 15 个覆盖 80% 场景 |
| BGM 找不到匹配 cc-design demo 风格 | 中 — 需接受近似风格 | Pixabay/Mixkit 均有分类搜索（tech/ambient/cinematic） |
| AudioEngine 与现有动画不兼容 | 高 — 回归 bug | T11 回归测试覆盖无音频 demo |
| Safari `<audio>` 回退路径差异 | 低 — 不影响主要浏览器 | feature detection + console.info 告知用户 |
| ffmpeg 命令过长（>30 SFX） | 低 — 超出实际限制 | 文档化为~50 个 SFX 输入限制；必要时可两阶段渲染 |
| 10-14 MB 音频资产增加 git 体积 | 低 — 用户已确认 | README 更新说明 |

## 执行顺序建议

1. **T1a** + **T2** + **T10** + **T3.5**（并行，无依赖）
2. **T3** + **T8**（并行，依赖 T1a+T2）
3. **T1b**（可在阶段 2-3 间并行，与核心工作不冲突）
4. **T4 → T5 → T6** + **T7**（串行，依赖 T3）
5. **T9** + **T11**（串行，需所有模板完成）
