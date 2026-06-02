# Plugin Publishing Layout

这份文档沉淀 Forge 当前可工作的发布方案，目标是把同一套结构复用到其他项目。

## 目标

- 同一个仓库同时支持 Codex 和 Claude Code 安装
- 安装方式走正式 marketplace，不依赖本地脚本
- 发布包自包含，不能引用仓库外路径

## 结论

正式 marketplace 必须指向 `plugins/<plugin-name>`，不能指向仓库根目录。

`plugins/<plugin-name>` 必须是完整发布工件，至少包含：

- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `skills/`

如果 marketplace 指向仓库根目录：

- Codex 可能出现 marketplace 已添加，但 `plugin add` 找不到插件

如果发布包里的 manifest 引用 `../../skills` 之类的仓库外路径：

- Claude Code 会在缓存目录里报 `skills: Invalid input`

## 推荐目录

```text
repo/
├── .agents/
│   └── plugins/
│       └── marketplace.json
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── .codex-plugin/
│   └── plugin.json
├── skills/                              # 开发态 source of truth
└── plugins/
    └── your-plugin/                     # 发布态自包含工件
        ├── .claude-plugin/
        │   └── plugin.json
        ├── .codex-plugin/
        │   └── plugin.json
        └── skills/
            ├── foo/
            │   └── SKILL.md
            └── bar/
                └── SKILL.md
```

## Marketplace 写法

### Codex marketplace

```json
{
  "name": "your-plugin",
  "interface": {
    "displayName": "Your Plugin Marketplace"
  },
  "plugins": [
    {
      "name": "your-plugin",
      "source": {
        "source": "local",
        "path": "./plugins/your-plugin"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Engineering"
    }
  ]
}
```

### Claude marketplace

```json
{
  "name": "your-plugin",
  "description": "Short marketplace description",
  "owner": {
    "name": "Your Team"
  },
  "homepage": "https://github.com/your-org/your-repo",
  "plugins": [
    {
      "name": "your-plugin",
      "description": "Plugin description",
      "source": "./plugins/your-plugin"
    }
  ]
}
```

## Manifest 写法

### 仓库根目录的 Codex manifest

根目录 manifest 用于仓库开发和本地校验，可以直接引用根目录 `skills/`：

```json
{
  "name": "your-plugin",
  "version": "0.1.0",
  "skills": "./skills"
}
```

### 发布包里的 Codex manifest

发布包 manifest 必须引用发布包内部的 `skills/`：

```json
{
  "name": "your-plugin",
  "version": "0.1.0",
  "skills": "./skills"
}
```

### 仓库根目录的 Claude manifest

Claude manifest 需要显式列出每个 skill：

```json
{
  "name": "your-plugin",
  "version": "0.1.0",
  "skills": [
    "./skills/foo",
    "./skills/bar"
  ]
}
```

### 发布包里的 Claude manifest

发布包里的 Claude manifest 也必须只引用发布包内部路径：

```json
{
  "name": "your-plugin",
  "version": "0.1.0",
  "skills": [
    "./skills/foo",
    "./skills/bar"
  ]
}
```

不要写：

- `../../skills/foo`
- `../skills/foo`
- 仓库根目录之外的任何路径

## 发布规则

每次发版前，至少同步这几类文件：

- `package.json`
- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `plugins/your-plugin/.claude-plugin/plugin.json`
- `plugins/your-plugin/.codex-plugin/plugin.json`

如果发布包里的 `skills/` 是从根目录复制出来的，还要同步：

- `skills/ -> plugins/your-plugin/skills/`

## 推荐发布流程

1. 在根目录维护 `skills/` 和根级 manifest
2. 生成或同步发布包：
   复制 `skills/` 到 `plugins/your-plugin/skills/`
   更新 `plugins/your-plugin/.codex-plugin/plugin.json`
   更新 `plugins/your-plugin/.claude-plugin/plugin.json`
3. 确认 marketplace 指向 `./plugins/your-plugin`
4. 跑校验
5. bump version
6. commit and push

## 最小校验项

建议把下面这些检查写进仓库自检：

- 根目录 `.codex-plugin/plugin.json` 存在
- 根目录 `.claude-plugin/plugin.json` 存在
- 发布包 `.codex-plugin/plugin.json` 存在
- 发布包 `.claude-plugin/plugin.json` 存在
- `plugins/your-plugin/skills/` 存在
- Codex marketplace 的 `source.path === "./plugins/your-plugin"`
- 发布包 Codex manifest 的 `skills === "./skills"`
- 发布包 Claude manifest 的每一项 skill 都以 `"./skills/"` 开头

## cc-design 的当前实现

当前仓库现在可直接作为参考实现：

- Codex marketplace: `.agents/plugins/marketplace.json`
- Claude marketplace: `.claude-plugin/marketplace.json`
- 根目录 Codex manifest: `.codex-plugin/plugin.json`
- 根目录 Claude manifest: `.claude-plugin/plugin.json`
- 根目录 skill 开发入口: `skills/cc-design/SKILL.md`
- 发布包目录: `plugins/cc-design/`
- 发布包 Codex manifest: `plugins/cc-design/.codex-plugin/plugin.json`
- 发布包 Claude manifest: `plugins/cc-design/.claude-plugin/plugin.json`
- 发布包 skill: `plugins/cc-design/skills/cc-design/SKILL.md`
- 自检逻辑: `scripts/validate-plugin-package.mjs`

对 `cc-design` 这类非纯 skill 仓库，发布包除了 manifest 和 `skills/`，还需要把运行时依赖一起打进包内，至少包括：

- `references/`
- `templates/`
- `scripts/`
- `assets/`
- `agents/`
- `load-manifest.json`
- `VERSION`

## 迁移到其他项目

迁移时按这个顺序最稳：

1. 先在新项目根目录建立 `skills/`
2. 再补根级 `.codex-plugin/plugin.json` 和 `.claude-plugin/plugin.json`
3. 新建 `plugins/<name>/`
4. 把 `skills/` 打包到 `plugins/<name>/skills/`
5. marketplace 全部改指向 `./plugins/<name>`
6. 最后再接入版本同步和自检

这样做的好处是：

- 开发态和发布态职责分开
- Codex 和 Claude 的差异被限制在 manifest 层
- 发布问题能在仓库自检阶段暴露，而不是等用户安装时报错
