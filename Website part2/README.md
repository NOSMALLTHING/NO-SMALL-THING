# Demo3 - Butter Video 局部页面项目

本项目基于 Butter Video 官网进行定制与本地化，保留了高质量的动态字体特效、时间线图层动效与响应式设计。

## 1. 页面范围说明
- **保留区域**：
  - **Ticker 品牌走马灯**：合作伙伴 Logo 展示（Airbnb, SpaceX, Netflix 等）
  - **StatementTimeline 核心陈述与时间线**：`Butter is the first video editor where creatives can build and remix...` 与高精度时间线插图动效
  - **StoryOne 积木动效区**：`There’s a block for that` / `Browse curated blocks for motion graphics, kinetic type, 3D, shader effects, and beyond.` 动态字体与右侧交互面板
- **已移除区域**：
  - **顶部栏（Header）**：全局导航、菜单链接与登录按钮已彻底移除。
  - **首屏主页（Hero）**：包括 `Engineered for Creativity` 标题、`Butter, the first video editor...` 副标、`Get Started` 按钮及 3D 钥匙圈模型/备用图均已彻底移除。
  - **StoryTwo 及后续所有下半部分**：从 `StoryTwo`（`Infinitely customizable.` / 旋钮滑块）开始的所有模块（StoryThree、FeatureCards、FeaturesHighlight、GalleryCarousel、FeaturesSection、DoubleBlock、BlockHighlight）以及全站 Footer 底部栏均已彻底删除。
- **本地化多媒体资源**：
  - 时间线高精度插图（`timeline.png`）与文字动效碎片（`focus.png`, `glow.png`, `halftone.png`, `inflate.png`, `word_glow.png` 及字母碎片）均已保存在本地 `marketing-assets/images/` 目录中。
  - 所有因移除首屏和底部栏而不再需要的无用资产（7 个 3D 钥匙圈模型 `.glb`、`city.jpg` 反射贴图、`hero_fallback.png` 备用图、`footer-logo.svg`）均已彻底清理，大幅节省项目体积。

## 2. 精简后的项目目录结构
```text
Demo3/
├── index.html            # 核心网页主文件（已同步为最新精简版本）
├── marketing-assets/     # 本地化必要静态资源
│   └── images/
│       ├── statement/    # 时间线背景插图 (timeline.png)
│       └── text-effects/ # 动态文字特效卡片与字母切片
├── favicon.ico           # 网站图标
├── icon.png              # 网站高清图标
├── 打开网站.bat          # 一键启动本地服务并调起浏览器的脚本
├── README.md             # 本说明文档
└── www.butter.video/     # 镜像源目录（保留备份兼容）
```

## 3. 如何运行与预览页面
因为该网页使用 Next.js + Three.js 异步加载资产，现代浏览器禁止通过 `file:///` 直接读取本地模型与字体脚本，**必须在 HTTP 服务环境下访问**：

### 方式一（推荐，直接双击）：
双击项目根目录下的 **`打开网站.bat`** 即可自动启动本地服务并调起浏览器打开 `http://localhost:3000/index.html`。

### 方式二（命令行）：
在项目根目录下执行：
```bash
python -m http.server 3000
```
然后在浏览器访问：[http://localhost:3000/index.html](http://localhost:3000/index.html)。

### 方式三（VS Code）：
在 `index.html` 上右键选择 **Open with Live Server**。
