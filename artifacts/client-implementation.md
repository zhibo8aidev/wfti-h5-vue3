# WFTI H5 Frontend Implementation

- 时间：2026-04-27
- Owner：frontend
- 项目：`wfti-h5-vue3`
- 技术栈：Vue 3 + Vue Router + Vite + TypeScript + Vitest

## 实现范围
- 完成手机端 H5 主链路：landing -> quiz -> calculating -> result -> poster preview。
- 16 道题、隐藏人格检测、8 维向量评分、16 种常规人格曼哈顿距离匹配均在前端静态实现。
- 人格结果文案以内置静态配置承载，不依赖后端接口。
- 最近结果与答题草稿使用 `localStorage` 分离缓存：
  - `wfti_quiz_draft_v1`：24 小时断点续答草稿。
  - `wfti_latest_result_v1`：当前设备最近人格结果。
- 登录、分享、保存相册、站内跳转通过统一 `bridge` adapter 占位，点击统一 toast：`待开发`。

## 关键文件
- `src/domains/questionBank.ts`：题库、人格文案、人格向量与展示元数据。
- `src/domains/personalityEngine.ts`：评分、隐藏人格优先检测、距离匹配。
- `src/services/localRepository.ts`：草稿与最近结果缓存。
- `src/services/bridge.ts`：占位 bridge 入口。
- `src/pages/`：Landing、Quiz、Calculating、Result、Status 页面。
- `src/components/PosterPreviewModal.vue`：前端 Canvas 海报预览。
- `src/tests/`：题库算法、缓存与主链路 shell 测试。

## 验证结果
- `npm run test:run`
  - 3 个测试文件通过。
  - 11 个测试用例通过。
  - 覆盖题库与算法、隐藏人格优先级、并列距离排序、本地最近结果 / 草稿缓存逻辑、主链路路由与 16 题结果缓存闭环。
- `npm run build`
  - `vue-tsc --noEmit` 通过。
  - `vite build` 通过。

## 未接入项
- 本期未建设后端服务。
- 登录、分享、保存相册、站内跳转未接真实 bridge，按范围要求统一提示 `待开发`。
