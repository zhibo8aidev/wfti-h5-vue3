# WFTI Vue3 H5 技术方案

## 1. 目标与边界
- 项目形态：直播吧 App WebView 内的 Vue 3 手机端 H5
- 目标：在不建设后端服务的前提下，完成 16 题人格测试、前端本地算法、结果页、海报、登录/分享 bridge 适配与本地缓存闭环
- 本方案仅覆盖 MVP，不包含 CMS、人格二级页、账号级结果同步与后端接口

## 2. 推荐前端架构
### 2.1 技术栈
- Vue 3
- Vue Router（单页状态路由）
- Pinia 或等价轻量状态容器
- Canvas / SVG / html2canvas（用于雷达图与海报）
- localStorage + adapter repository

### 2.2 目录建议
- `src/app/`：应用启动、路由、全局 providers
- `src/pages/`：landing、quiz、calculating、result、status、error
- `src/components/`：题卡、选项卡、进度条、底栏、雷达图、标签云、二维码区
- `src/domains/`：questionBank、personalityEngine、posterSchema
- `src/services/`：localRepository、bridge、poster、tracker
- `src/stores/`：env、auth、quiz、result、ui
- `src/mocks/`：本地 mock 数据与假 bridge
- `src/utils/`：time、storage、retry、device、formatters

### 2.3 核心分层
1. UI 层
   - 负责页面渲染、组件状态、动效与响应式布局
2. Domain 层
   - 负责题库、人格算法、结果元数据、海报结构描述
3. Service 层
   - 负责 bridge、海报生成、本地结果与草稿存储、埋点
4. Adapter 层
   - 封装 `【待桥接确认】` 宿主能力，保证主链路可先用 mock 跑通

## 3. 页面主链路
1. Landing 初始化活动静态配置、登录态、最近本地结果摘要
2. 未登录点击开始测试时，通过 `bridge.ensureLogin()` 拉起登录（若业务仍要求登录）
3. Quiz 页按固定顺序作答，支持回退和 24 小时断点续答
4. 第 16 题后进入 2.5 秒 calculating 页
5. `personalityEngine` 本地计算人格结果
6. Result 页渲染本地结果，并写入 `saveLatestLocalResult()`
7. 分享 / 保存走 `posterService + bridge` 组合链路
8. 重新预测时清理草稿并覆盖本地最近结果

## 4. 状态模型
### 4.1 全局状态切片
- `envStore`
  - `activityStatus`
  - `hostEnv`
  - `config`
- `authStore`
  - `uid`
  - `loginState`
- `quizStore`
  - `answers`
  - `currentIndex`
  - `draftUpdatedAt`
  - `resumeVisible`
- `resultStore`
  - `computedResult`
  - `latestLocalResult`
  - `saveStatus`
- `uiStore`
  - `loading`
  - `toast`
  - `posterModal`
  - `pageTransitionLock`

### 4.2 本地缓存
- `wfti_quiz_draft_v1`
- `wfti_latest_result_v1`
- `wfti_activity_config_v1`

规则：
- 草稿有效期 24 小时
- 换账号时可选清空旧草稿与旧结果
- 最近结果写入成功后覆盖本地旧结果

## 5. 算法模块设计
### 5.1 questionBank
- 固化 16 题题干、A/B/C 选项与 8 维映射
- 固化 16 常规人格原型向量
- 固化 2 个隐藏人格规则
- 固化人格展示文案、标签、关系链基础字段

### 5.2 personalityEngine
输入：16 题答案数组
输出：
- `personalityCode`
- `personalityName`
- `personalityCopy`
- `isHidden`
- `rawScores`
- `levelVector`
- `answers`
- `computedAt`

步骤：
1. A/B/C -> 1/2/3
2. 聚合 F1/F2/E1/E2/S1/S2/A1/A2
3. 映射 L/M/H -> 1/2/3 向量
4. 先判隐藏人格，TROL 优先于 HERO
5. 未命中隐藏人格时执行曼哈顿距离匹配
6. 同距离按 GOAT -> DRIP 顺序优先

### 5.3 单测要求
- 全 A / 全 B / 全 C
- TROL / HERO 命中
- TROL 与 HERO 同时命中优先级
- 并列距离排序
- 非法答案兜底与日志

## 6. 结果页与海报落地
### 6.1 结果页
- 顶部人格代号 + 中文昵称
- 插画区与标签云
- 八维雷达图
- 人格解析文案
- 球星对照 / 天敌 / 拍档
- 二维码区
- 固定底部操作栏
- `查看我的结果` 直接读取本地最近结果

### 6.2 海报生成
- 独立隐藏容器生成，不直接截整页
- 优先方案：DOM 模板 + `html2canvas`
- 备选方案：纯 Canvas 绘制
- 超过 5 秒视为失败，连续 3 次失败降级为截图提示
- 海报生成时隐藏底部操作栏

## 7. bridge 与本地仓储边界
### 7.1 bridge 能力
- `ensureLogin()`
- `share()`
- `saveImage()`
- `openRoute()`
- `getEnv()`

全部通过 `bridge adapter` 封装，未确认协议先用 web mock 实现。

### 7.2 localRepository 接口
- `getLatestLocalResult()`
- `saveLatestLocalResult(result)`
- `clearLatestLocalResult()`
- `getQuizDraft()`
- `saveQuizDraft(draft)`
- `clearQuizDraft()`

### 7.3 静态配置
- 活动状态、二维码目标链接、分享文案、人格数据均以本地静态配置维护
- 未来若需要服务端配置，可通过 adapter 扩展，但不属于本期范围

## 8. 埋点与日志
关键事件：
- landing 曝光 / CTA 点击
- 登录拉起 / 成功 / 取消
- 每题曝光 / 选项选择 / 返回上一题
- 结果计算完成
- 结果页曝光
- 海报生成成功 / 失败
- 保存相册点击 / 成功 / 失败
- 分享点击 / 成功 / 取消
- 本地缓存读取失败 / bridge 失败

## 9. 实施策略
1. 先搭工程骨架、状态管理、设计 token
2. 再落题库与算法单测
3. 实现 landing / quiz / calculating / result 主链路
4. 补雷达图、关系链、海报、二维码与 bridge 适配
5. 完成埋点、异常态与多机型回归

## 10. 当前阻塞与建议
- `【待桥接确认】`：登录、分享、保存图片、站内跳转协议
- 这些都可通过 adapter/mock 收口，不阻塞当前前端实现

## 11. 结论
当前项目已经明确为前端单体实现。技术评审通过后，只需启动前端实现，不再拆分 backend 任务。
