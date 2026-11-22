# NO SMALL THING

品牌官网：Next.js App Router、React、TypeScript、Tailwind CSS 4、Motion。首页包含 Hero、Brand Introduction、Services、Selected Work、Approach、About、Contact 和 Footer。

## 运行与检查

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm verify
pnpm preview
```

开发预览：http://localhost:3000 。build 生成可部署的 out/ 静态文件，preview 预览生产产物。Windows 开发和构建使用 Webpack。pnpm optimize:assets 可从原始图片重新生成响应式品牌图片。

## 页面

| 路径 | 用途 |
| --- | --- |
| / | 完整首页 |
| /work | 明确标记的 Concept Projects |
| /work/[slug] | Problem / Solution / Technology / Outcome 案例详情 |
| /expertise | 五大核心业务 |
| /studio | 三位创始人的品牌故事 |
| /#site-footer | 页脚联系方式与预约（SAY HELLO / Book a Call） |
| /design-system | 内部设计参考页，noindex |

## 联系流程

官方 Email、Instagram、LinkedIn、GitHub 集中维护于 src/lib/contact.ts，并在页脚 SAY HELLO 及预约中直接提供。网站没有复杂邮件接收后端，不存储表单内容。各导航渠道（FIND US、Book A Call）平滑导航至页脚。

## 内容维护

- src/lib/projects.ts：项目数据与概念状态。当前没有虚构客户或商业成果；替换指南见 docs/portfolio.md。
- src/lib/about.ts：品牌故事及可选真实团队照片。
- src/app/globals.css：颜色、字体、间距、响应式网格及减少动态效果规则。
- public/brand/：原始 Logo 与 Mars Banner、完整构图的响应式图片；Hero 使用无损 WebP。
- public/fonts/：自托管 Manrope 字体和 OFL 许可证。

## 正式发布

域名暂未确定。正式发布时配置 NEXT_PUBLIC_SITE_URL 后重新构建，生成 canonical、绝对分享图片地址和 sitemap；当前不写入虚构域名。部署 out/ 到支持静态网站的服务器；托管平台需支持干净 URL 和自定义 404.html。scripts/preview.mjs 提供本地参考行为。没有自动发布或远程推送。

最终检查记录见 docs/final-review.md。

电影式体验升级说明见 docs/cinematic-experience.md：透明字标与独立 N 符号、桌面开场固定场景、滚动遮罩文字、服务标题停留、作品画幅揭示和菜单过渡均沿用现有 Motion 架构。

作品展映带支持鼠标惯性拖拽、原生触屏滑动、前后按钮及键盘切换；空间反馈、逐字标题、叙述阅读高亮与桌面页脚揭示均支持减少动态效果偏好。
