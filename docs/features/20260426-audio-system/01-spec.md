# 浏览器音频播放 + 视频导出音效系统

## 问题陈述

如何让 cc-design 的 37 SFX + 6 BGM 在浏览器内可预听、在视频导出时可混入，且与现有 Stage+Sprite 动画时间线引擎集成？

## 方案及理由

**方案: 双路径音效系统**

两条独立路径，共享同一套 SFX/BGM 资产：

1. **浏览器路径** — `templates/audio-engine.jsx`，使用 AudioContext 在浏览器内播放 SFX 和 BGM，通过 `<SFX>` 声明式组件与 Stage+Sprite 时间线集成
2. **导出路径** — `scripts/add-sfx-to-video.sh`，使用 ffmpeg adelay+amix 将 SFX 时间线 JSON 混入导出视频，沿用现有的 `add-music.sh` 模式

两者不可互相替代：Playwright recordVideo 不捕获浏览器音频，ffmpeg 后处理才是视频导出的真正手段。

理由：
- 浏览器引擎满足预览需求，Scene preset 一键加载完整音效编排
- ffmpeg 导出路径保证帧级精确对齐（浏览器无法做到帧级对齐）
- 共享同一套 SFX 资产目录，不重复维护

## Artifact Type

artifact_type: software

## External References

- Search status: completed
- Scan date: 2026-04-26
- Sources:
  - MDN Web Audio API Best Practices — AudioContext, decodeAudioData
  - Pixabay / Mixkit / FreePD / freesound.org — 免版税音效和音乐
  - Safari Web Audio API decodeAudioData limitations (no MP3 support)
  - cc-design/references/audio-design-rules.md — 双轨音频系统
  - cc-design/references/sfx-library.md — 37 SFX 分类目录
  - cc-design/references/animations.md — Stage+Sprite 时间线引擎

### Fact
- Playwright `recordVideo` captures video only, no system audio — browser audio engine is independent from video export pipeline
- Safari `decodeAudioData` does not support MP3 format — must provide AAC/WAV alternative or detect and fallback
- Web Audio API `AudioContext` requires user gesture to `resume()` — autoplay policy
- `AudioBufferSourceNode` cannot be seeked — timeline scrubbing requires stop+restart
- Pixabay, Mixkit, freesound.org offer CC0-licensed SFX usable for commercial projects
- cc-design's `references/sfx-library.md` defines 37 SFX with detailed prompts, durations, and categories
- `animations.jsx` uses `requestAnimationFrame` delta-time — inherently has 5-16ms jitter, cannot guarantee frame-level alignment in browser
- Existing `add-music.sh` script already adds BGM to exported video via ffmpeg — pattern to extend

### Pattern
- AI coding assistants (Claude Code, Codex) consume HTML templates and render in browser — templates must be self-contained
- RequestAnimationFrame + AudioContext run on separate clocks — desync is inevitable without explicit synchronisation
- Tweaks pattern (`tweaks-system.md`) uses floating panel + localStorage — audio controls should follow same pattern

### Inference
- No ElevenLabs API key available → SFX must be sourced from royalty-free libraries (Pixabay, freesound.org)
- Scene presets are configuration profiles (select BGM, set volumes, apply frequency isolation settings), not cue schedulers — SFX timing is always animation-specific
- Scrubbing is a design gap in the existing Stage engine that the audio feature surfaces — solving it properly (pause SFX, restart BGM at position) also improves the Stage's scrub experience for non-audio animations

### Unknown
- Which royalty-free SFX platform(s) will have the best matching sounds for cc-design's 37 catalog entries
- Exact browser compatibility requirements (is legacy Safari support needed?)
- Whether the 37 SFX catalog needs adjustment when sourced from free libraries vs ElevenLabs-generated

### Adopt
- AudioContext-based browser engine (`templates/audio-engine.jsx`) for preview
- `<SFX>` declarative component (not `useSFX()` hook) — more React-idiomatic, avoids semantic mismatch
- ffmpeg post-processing for video export — extend `add-music.sh` to support SFX timeline
- Royalty-free SFX sources (Pixabay / freesound.org) — replacing ElevenLabs API
- All audio assets committed to git (user confirmed)
- Scene presets as configuration profiles only
- Sprite-relative timing for SFX cues
- Mute SFX during scrubbing, reposition BGM

### Reject
- ElevenLabs API for SFX generation (no API key available)
- Dual timing modes for `at` parameter (sprite-relative only)
- Browser engine as audio source for Playwright export (architecturally impossible)
- ffmpeg synthetic audio fallback (quality doesn't meet audio-design-rules standard)
- Scene presets that attempt to pre-schedule SFX cue times (not animation-appropriate)
- Cloud streaming of audio assets (offline requirement)
- WAV format (too large)

## Scout Review Summary

- **CEO** (Verdict: Important): API key blocking → resolved via royalty-free SFX sources. Scope confirmed full (both engines). Git asset strategy accepted.
- **Eng** (Verdict: Important): Safari MP3 decodeAudioData limitation → adopt dual-format or detection. rAF/AudioContext desync risk → design for sync from start. Video export audio isolation → twin architecture adopted.
- **Design** (Verdict: Important): `useSFX()` semantic mismatch → adopt `<SFX>` component. Scrubbing audio breakage → explicit scrub protocol. Scene preset scope creep → defined as config profiles only.
- **Blocking resolved**: ElevenLabs API key unavailable → switched to royalty-free SFX sourcing
- **Important adopted**: Dual architecture (browser + export), `<SFX>` component over hook, sprite-relative timing, scrubbing protocol, autoplay policy design
- **Suggestions deferred**: BGM as separate download (rejected, user chose commit to git), `<SFX>` component naming bikeshed (resolved to `<SFX>` for brevity)

## 核心假设（待验证）

- [ ] 37 个 SFX 可以从免版税库（Pixabay / freesound.org）找到品质匹配的文件 — 生成脚本后验证第一批 5 个 SFX
- [ ] `audio-engine.jsx` 与 `animations.jsx` 独立加载、不破坏现有无音频动画 — 完成后用现有 demo 回归测试
- [ ] 10-14 MB 音频资产增加到 git 仓库，日常开发体验可接受 — 克隆和 CI 时间监控
- [ ] 场景预设的价值足够用户愿意使用（vs 手动配置）— 完成后让用户试用点评

## MVP 范围

**MVP （第一迭代）**：

1. `assets/sfx/` — 9 分类目录，37 SFX 文件（从免版税库下载）
2. `assets/bgm/` — 6 BGM 文件（从免版税库下载）
3. `templates/audio-engine.jsx` — AudioContext 引擎，包含：
   - `window.AudioEngine` 全局实例
   - `AudioEngine.playSFX(path, options?)` — 播放 SFX
   - `AudioEngine.playBGM(src, options?)` — 循环 BGM
   - `AudioEngine.stopAll()` — 停止所有
   - `AudioEngine.setVolume('sfx', n)` / `AudioEngine.setVolume('bgm', n)`
   - Buffer Cache（避免重复解码）
   - Autoplay 处理（延迟初始化到用户手势）
4. `<SFX at={2.5} src="keyboard/type" />` 组件，整合到 `audio-engine.jsx`
5. `<Soundtrack>` 组件 — 场景预设容器
6. `templates/audio-controls.jsx` — 音频控件 UI（SFX 音量、BGM 音量、BGM 选择器、重置）
7. `<BGM>` 组件
8. `scripts/add-sfx-to-video.sh` — ffmpeg SFX 混音脚本（基于现有 add-music.sh 模式）
9. `load-manifest.json` — audio-engine 添加到 `audio-design` task type

**第二迭代**：
10. Tweaks 面板集成（可折叠音频区域）

**第三迭代**：
11. `scripts/fetch-sfx.sh` — SFX 下载脚本（从 Pixabay/freesound.org API 自动获取，作为自动化工具，非必需）

## 架构决策记录

### ADR 1: 双路径架构（浏览器 + ffmpeg）
- **背景**: Playwright recordVideo 不捕获浏览器音频
- **决策**: 浏览器用 AudioContext 预览，ffmpeg 后处理混音导出
- **代价**: 维护两条独立路径
- **缓解**: 共享同一套资产目录，时间线描述统一为 JSON 格式

### ADR 2: `<SFX>` 组件而非 `useSFX()` hook
- **背景**: `useSFX()` 是副作用不返回值，与 `useSprite()` 语义不一致
- **决策**: 提供 `<SFX at={2.5} src="keyboard/type" />` 声明式组件
- **代价**: 组件无法在条件渲染中灵活控制
- **缓解**: `<SFX>` 支持 `disabled` prop 和 `volume` prop

### ADR 3: 时间线拖拽时，静音 SFX + 重定位 BGM
- **背景**: AudioBufferSourceNode 不支持 seek
- **决策**: 拖拽期间停止所有 SFX，BGM 跳到新位置重新开始
- **代价**: 用户失去拖拽时 SFX 预览
- **缓解**: 这是专业工具的一致性做法（AE / Premiere 拖拽时间轴时也不触发音频）

### ADR 4: Sprite-relative 时间
- **背景**: `useSprite()` 用 `t`(0→1 进度)，SFX 用秒数更好理解
- **决策**: `<SFX at={2.5}>` 的单位是秒，相对于最近的 `<Sprite>` 开始时间
- **代价**: 需要在组件中额外传递时间信息
- **缓解**: 内部自动计算（`elapsed + at`），开发者不需要关心

### ADR 5: 免版税 SFX 替代 ElevenLabs
- **背景**: 没有 ElevenLabs API key
- **决策**: 从 Pixabay / freesound.org 等免版税源获取 SFX
- **代价**: 匹配品质的搜索成本
- **缓解**: 提供一个 Node.js 下载脚本作为辅助工具；搜索策略为每个 SFX prompt 找最匹配的 CC0 文件

## 详细设计

### 目录结构

```
assets/
├── sfx/
│   ├── keyboard/      type.mp3, type-fast.mp3, delete-key.mp3, space-tap.mp3, enter.mp3
│   ├── ui/            click.mp3, click-soft.mp3, focus.mp3, hover-subtle.mp3, tap-finger.mp3, toggle-on.mp3
│   ├── transition/    whoosh.mp3, whoosh-fast.mp3, swipe-horizontal.mp3, slide-in.mp3, dissolve.mp3
│   ├── container/     card-snap.mp3, card-flip.mp3, stack-collapse.mp3, modal-open.mp3
│   ├── feedback/      success-chime.mp3, error-tone.mp3, notification-pop.mp3, achievement.mp3
│   ├── progress/      loading-tick.mp3, complete-done.mp3, generate-start.mp3
│   ├── impact/        logo-reveal.mp3, logo-reveal-v2.mp3, brand-stamp.mp3, drop-thud.mp3
│   ├── magic/         sparkle.mp3, ai-process.mp3, transform.mp3
│   └── terminal/      command-execute.mp3, output-appear.mp3, cursor-blink.mp3
└── bgm/
    ├── bgm-tech.mp3
    ├── bgm-tutorial.mp3
    ├── bgm-educational.mp3
    ├── bgm-ad.mp3
    ├── bgm-tech-alt.mp3
    └── bgm-tutorial-alt.mp3
```

### audio-engine.jsx API

```jsx
// 全局实例
const engine = window.AudioEngine;

// 初始化（第一次用户交互时调用）
engine.init(); // 创建 AudioContext，resume()

// SFX 播放
engine.playSFX('keyboard/type');                    // 默认音量 1.0
engine.playSFX('keyboard/type', { volume: 0.8 });   // 自定义音量
engine.playSFX('keyboard/type', { delay: 0.5 });    // 延迟 0.5s

// BGM
engine.playBGM('bgm-tech');                         // 从 assets/bgm/ 加载
engine.playBGM('bgm-tech', { volume: 0.45, loop: true });
engine.stopBGM();

// 全局控制
engine.setVolume('sfx', 1.0);
engine.setVolume('bgm', 0.45);
engine.mute();   // 静音
engine.unmute(); // 取消静音
engine.stopAll(); // 停止所有音频

// 预制管理器
engine.loadPreset('terminal-demo');
// 等同于: engine.init() + engine.playBGM('bgm-tech', {volume: 0.45}) + set SFX vol 1.0
```

### `<SFX>` 组件

```jsx
function Scene() {
  const { t, elapsed } = useSprite();
  return (
    <>
      <SFX at={0.0} src="keyboard/type-fast" />
      <SFX at={1.5} src="keyboard/enter" />
      <SFX at={2.5} src="terminal/command-execute" />
      {/* 视觉元素 */}
    </>
  );
}
```

**内部实现逻辑**:
1. 在 `useSprite()` 上下文中读取 `elapsed`（从 Sprite 开始到当前的时间）
2. 当 `elapsed` 首次达到 `at` 值时，触发 `AudioEngine.playSFX(src, options)`
3. 使用 `useRef` 记录已触发的 SFX，防止重复触发
4. 当 Sprite 被卸载（离开时间范围）时，停止未完成的 SFX？不 — SFX 允许自然播放完毕
5. 拖拽时：检测到非顺滑时间跳变 → 重置触发记录，停止当前 SFX

### `<Soundtrack>` 组件

```jsx
<Stage duration={20}>
  <Soundtrack preset="terminal-demo">
    <Sprite start={0} end={5}>
      <TerminalScene />
    </Sprite>
  </Soundtrack>
</Stage>
```

**preset 配置**:
```js
const presets = {
  'terminal-demo': {
    bgm: 'bgm-tech',
    bgmVolume: 0.45,
    sfxVolume: 1.0,
    frequencyFilter: false, // 浏览器中不做频率隔离（ffmpeg 导出时做）
  },
  'product-launch': {
    bgm: 'bgm-tech',
    bgmVolume: 0.45,
    sfxVolume: 1.0,
  },
  'tutorial-walkthrough': {
    bgm: 'bgm-tutorial',
    bgmVolume: 0.50,
    sfxVolume: 1.0,
    sfxDensity: 'low', // 提供语义密度提示
  },
  'ai-generation': {
    bgm: 'bgm-tech-alt',
    bgmVolume: 0.40,
    sfxVolume: 1.0,
    sfxDensity: 'high',
  },
};
```

### `<BGM>` 组件

```jsx
<BGM src="bgm-tech" volume={0.45} />
```

简单包装，在挂载时调用 `AudioEngine.playBGM()`，卸载时自动停止。

### 场景预设（Presets as Configuration, Not Scheduler）

预设定位：
- 选择 BGM
- 设定 SFX / BGM 默认音量
- 提供密度语义提示（供 agent 写代码时参考）
- **不预定义 SFX 时间点** — 这是动画的职责

### Scrubbing 协议

当 Stage 拖拽时间位置时：
1. 触发 `onSeek` 回调
2. AudioEngine 立即停止所有活动的 SFX AudioBufferSourceNode
3. BGM 在拖拽结束后重启到新位置（跳过渡期间）
4. 所有 `<SFX>` 组件的内部 firedRef 重置，以便在 play 重新经过时间点时重新触发
5. 拖拽过程中：不产生新 SFX，保持沉默

### Autoplay 策略

1. Stage 默认 `playing=true`，但 audio-engine 延迟初始化
2. 首次用户交互（play/pause 按钮点击、scrubber 拖拽）时执行 `AudioEngine.init()`
3. init 创建 AudioContext 并 resume()
4. 初始化后，BGM 自动开始播放
5. 如果用户从未交互，不产生任何音频
6. 状态覆盖：Stage 底部控件显示"🔇"图标提示音频已准备好（hover 显示 "点击启用音频"）

### Safari 兼容策略

由于 Safari `decodeAudioData` 不支持 MP3：
- 主格式为 MP3（Chrome / Firefox / Edge）
- 在 `audio-engine.jsx` 中检测 Safari：`/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)`
- Safari 下 fallback 到 `<audio>` 元素播放（Safari 的 `<audio>` 支持 MP3）
- 或：在 Safari 下使用 `fetch` + 转码到 WAV 再 decode

优先级：MP3 为主，Safari fallback 到 `<audio>`。这不需要额外格式转换。

### Tweaks 集成（第二迭代）

```jsx
// 在 TweaksPanel 中添加折叠区域
<TweaksSection label="Audio">
  <TweakSlider label="SFX Volume" param="sfxVolume" min={0} max={1} step={0.1} />
  <TweakSlider label="BGM Volume" param="bgmVolume" min={0} max={1} step={0.1} />
  <TweakSelect label="BGM" param="bgmTrack" options={['none', 'bgm-tech', 'bgm-tutorial', 'bgm-educational', 'bgm-ad']} />
  <TweakButton label="Reset Audio" onClick={() => AudioEngine.setVolume('sfx', 1.0); AudioEngine.setVolume('bgm', 0.45)} />
</TweaksSection>
```

### ffmpeg 导出路径

在现有 `add-music.sh` 基础上扩展为 `add-sfx-to-video.sh`，增加 SFX 时间线输入：

```bash
# 用法: ./add-sfx-to-video.sh video.mp4 sfx-timeline.json [bgm.mp3]
# sfx-timeline.json 格式:
# [
#   {"src": "assets/sfx/keyboard/type.mp3", "time": 1.0},
#   {"src": "assets/sfx/keyboard/enter.mp3", "time": 2.5},
#   {"src": "assets/sfx/terminal/command-execute.mp3", "time": 3.0}
# ]

# 内部: 遍历 timeline，为每个 SFX 生成:
#   -itsoffset <time> -i <src>
# 并用 amix 合并所有输入，沿用频率隔离模板:
#   [bgm]lowpass=f=4000,volume=0.45[bgm]
#   [sfx_all]highpass=f=800,volume=1.0[sfx]
#   [bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

输出视频直接包含音效，无需额外后处理。

## 不做清单（及理由）

| 事项 | 理由 |
|------|------|
| ElevenLabs API 生成脚本 | 没有 API key，改为免版税来源 |
| 3D 空间音频 (PannerNode) | 无明确需求场景 |
| Web Audio API 合成全部音效 | 合成音质远不如 MP3，CPU 开销大 |
| 云端流式音频 | 增加延迟、离线不可用 |
| ffmpeg 实时混音（浏览器内） | 浏览器无法运行 ffmpeg |
| WAV 格式 | MP3 更小，兼容性足够 |
| 音频频谱可视化 | 纯装饰性，不解决实际问题 |
| 浏览器内帧级音频对齐 | rAF 固有 jitter（5-16ms）无法消除，ffmpeg 导出才能保证 |
| 场景预设预调度 SFX 时间点 | 时间点永远取决于动画内容，预设是配置模板不是时间线模板 |
| BGM 独立下载包（用户已拒绝） | 用户确认直接提交到 git |

## 待解决问题

- **Safari 降级方案确认**: `<audio>` 元素 fallback 是否足够，还是需要 AAC 格式转换？
- **SFX 来源具体选择**: Pixabay vs freesound.org vs Mixkit — 需要试找 5 个 SFX 后评估哪个平台匹配度最高
- **api key for sfx download**: Pixabay/freesound.org 是否有 API key 要求？（Pixabay 需要 free API key，freesound.org 也需要）
- **BGM 具体曲目**: 需要在 3 个免版税平台搜索匹配 6 首 cc-design demo 风格的曲目
- **更新 sfx-library.md**: ElevenLabs prompt 对免版税搜索仍有参考价值（描述声音特征），但需要标注来源变更
