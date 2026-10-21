# NO SMALL THING — Design Foundation

## 初期交付边界（历史记录）

完成全局 Layout、设计 Token、导航、Typography、12/8/4 栏网格、共用组件和使用真实品牌素材的 Hero 基础构图。Studio、Expertise、Contact 仅为可导航的版式骨架；后续逐页深化。Contact 当前不是可提交表单的页面。

## 视觉方向

从 [Production Portugal](https://productionportugal.com/) 借鉴电影画幅、安静的导航、视觉尺度对比及编辑式留白。NO SMALL THING 使用自己的火星横幅与原生滚动，未复制参考站的版式、文案、素材和动效。Hero 阶段已将最初的编辑式两行宣言替换为完整首屏电影画面。

- 主色：Black `#080809`；内容与结构延伸：Charcoal `#171719`。
- 主文字：Warm White `#F0ECE7`；次级文字使用中性灰。
- Mars Orange `#C87450` 只用于标记、重点和交互反馈，不作为大面积底色。
- 原始火星横幅保持原始比例。桌面完整展示；手机以中心安全画幅保留主标语、飞船和日出，外围两侧辅助注释可离开可视区，其内容仍保留在原文件与替代文字中。
- Logo 完整呈现在页头与展开导航。保留图片原有底色、形状、字标和比例，不重绘、不拉伸、不滤色。

## Typography

Manrope Regular / Semibold，以开源 SIL OFL 授权本地托管。标签使用系统等宽字体，形成品牌宣言和功能信息的层级。

| 层级 | 规则 |
| --- | --- |
| Display | `clamp()` 流体字号，约 64–144px；移动断点另设 56px 起始值；行高 1.02 |
| Heading | 44–96px；行高 1.1 |
| Body | 16–18px；行高 1.6 |
| Utility labels | 10px 等宽、小范围字距；移动端辅助标签适当缩小 |

紧字距仅用于大字号编辑式标题。小字号标签用于索引与装饰性元信息，业务正文保持正常阅读尺寸。当前 Hero 的可见主标题来自原始图片，不另行排字。

## Homepage Hero / 第二阶段

- `100svh` 完整首屏，覆盖式 Logo / Work / Services / About / Contact 导航；小屏通过原生可访问菜单显示链接。
- 桌面以 `object-fit: contain` 完整展示超宽原图，背景使用与原图衔接的纯黑电影留白。
- 手机竖屏将原图宽度设为容器的 168%，居中展示安全区域；平板竖屏为 140%。保留图内完整主标题，图片不拉伸、不重绘。手机横屏恢复完整画幅。
- 没有叠加标题、说明段落、宣传按钮、额外光效或视差。保留隐藏的语义化 H1 供辅助技术使用。
- 唯一提示为底部 Scroll to Explore 与细线箭头，链接至 Hero 后的真实锚点。本阶段下方仍为已有页脚，未来内容区块接在该锚点之后。
- Work 只建立使用现有 PageShell 的导航目的地，没有开发案例区块；Services 和 About 分别复用既有 Expertise 与 Studio 路由。
- 已检查 1440×900 桌面和 390×844 手机画幅、100svh 高度、无横向溢出、手机菜单 / Escape 焦点返回、滚动锚点及生产构建。

## Layout 与网格

| 视口 | 网格 | 外边距 |
| --- | --- | --- |
| ≥1024px | 12 栏 | 流体 4.1vw，上限 80px |
| 768–1023px | 8 栏 | 同上 |
| <768px | 4 栏 | 20px |

容器最大宽度 1600px，栏距 16–32px。间距基于 4px：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128。

## 共用组件

- `Container`：统一页面内容宽度。
- `Grid`：响应式 12/8/4 栏；各区块自身定义跨栏，避免在共用组件中固化内容。
- `SectionLabel`：橙色定位标记、标签、可选索引。
- `TextLink` / `Arrow`：轻量文字链接和方向图标，最小 44px 操作高度。
- `BrandLogo`：原版品牌图片，仅允许尺寸与布局调整。
- `Reveal`：内容默认可见，进入视野时轻微位移；遵循减少动态效果的系统偏好。
- `SiteHeader`：桌面主导航、全端菜单、当前页状态。
- `SiteFooter`：版权、标语及返回顶部。

## 交互与可访问性

采用原生 `dialog` 提供菜单焦点约束与背景隔离。菜单支持 Escape 关闭、关闭后焦点返回触发器、锁定背景滚动。提供 Skip to content、可见键盘焦点、语义化标题、原图替代文字与当前页标记。不劫持滚动，不引入持续视差或自动播放装饰。

## 素材来源

用户提供 `C:/Users/thowz/Downloads/Startup/NO SMALL THING.jpeg` 与 `Transcend Everything_ Mars Horizon.png`。项目内仅重命名为 `no-small-thing.jpeg` 与 `mars-horizon.png`；文件内容保持原样。字体许可证位于 `public/fonts/OFL.txt`。

## 后续开发

继续按用户指令逐区块添加真实内容。后续可展开 Studio / 品牌理念、Expertise、Selected Work（取得真实案例后）和 Contact（取得正式联系方式后）。不提前补充虚构案例、客户徽标、成绩数字或联系方式。

## 最终实现

下文为初次完整交付状态。最新的固定开场、框景过渡、透明字标与独立 N 符号规范见 cinematic-experience.md，优先采用该文档。

所有首页区块及 Work、Expertise、Studio、Contact 独立页面已完成。共享 `--type-section`、`--section-space`、`--tracking-heading` 保持排版节奏。Footer 使用原始 Logo、品牌标语及用户确认的四个联系渠道。

Hero 桌面加入最大 8px 的轻微视差，仅在大屏精确指针设备启用；手机与 reduced-motion 偏好禁用。原生平滑锚点滚动不劫持滚轮。文字、图片与页面进入动画克制，内容在无 JavaScript 时仍可阅读。菜单提供原生 dialog 焦点管理与无脚本链接。

原始图片保留；Hero 无损 WebP 与原 PNG 解码像素一致。Logo 响应式版本保留整幅作品，不裁剪或重绘。主要页面允许索引，Design System 保持 noindex。实际域名通过环境变量配置，详细运行与交付说明见 README 与 final-review.md。
