# Portfolio / Selected Work

项目内容的单一数据源为 `src/lib/projects.ts`。首页 Selected Work、`/work` 目录及 `/work/[slug]` Case Study 共用该数据。

## 当前作品

- Orbit：原创 AI 工作流界面视觉研究。
- Form & Field：面向虚构刊物的原创编辑式网站视觉研究。

两项均为 2026 年自发 Concept Projects，非客户委托、非已上线产品。预览是项目内原创 SVG 视觉稿，不是实际运行系统的截图。技术栈明确标注 Proposed Stack；没有客户、业务指标或商业成效声明。

## 新增或替换作品

1. 将获准展示的预览图加入 `public/work/`。
2. 在 `projects` 中添加或替换记录：唯一 `slug`、`title`、`category`、`year`、`summary`、`cover.src` 和准确的 `cover.alt`。
3. 填写 `caseStudy.problem`、`solution`、`technology` 和 `outcome`。技术栈状态区分 `proposed` 与 `implemented`。
4. 自发概念使用 `status: "concept"` 并填写清楚的 `disclosure`。类型不允许在该状态填写客户字段。
5. 取得真实客户项目后使用 `status: "client"` 并填写 `client`。Outcome 仅填写可核实的产出；不要把设计目标写成已经取得的成果。
6. 运行 `pnpm build`；`generateStaticParams()` 会按数据生成独立 Case Study 页面。

`ProjectPreview` 负责预览图和状态标记；`SelectedWork` 负责目录布局。目录将一项作品置为全宽，后续作品向右错位；手机恢复单列等宽。交互以轻微图片缩放与箭头位移为主，支持键盘焦点和减少动态效果偏好。
