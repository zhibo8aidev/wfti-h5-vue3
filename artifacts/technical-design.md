# WFTI Vue3 H5 技术方案

## 1. 目标与边界
- 项目形态：直播吧 App WebView 内的 Vue 3 手机端 H5
- 目标：在不新增原生能力的前提下，完成 16 题人格测试、前端本地算法、结果页、海报、异步结果上报与基础联动边界
- 本方案仅覆盖 MVP，不包含 CMS、人格二级页、站外独立站

## 2. 推荐前端架构
### 2.1 技术栈
- Vue 3
- Vue Router（单页状态路由）
- Pinia 或等价轻量状态容器
- Canvas / SVG / html2canvas（用于雷达图与海报）
- 原生 fetch + adapter 仓储层

### 2.2 目录建议
- `src/app/`：应用启动、路由、全局 providers
- `src/pages/`：landing、quiz、calculating、result、status、error
- `src/components/`：题卡、选项卡、进度条、底栏、雷达图、标签云、二维码区
- `src/domains/`：questionBank、personalityEngine、posterSchema
- `src/services/`：repository、bridge、poster、tracker
- `src/stores/`：env、auth、quiz、result、ui
- `src/mocks/`：本地 mock 数据与假 bridge
- `src/utils/`：time、storage、retry、device、formatters

### 2.3 核心分层
1. UI 层
   - 负责页面渲染、组件状态、动效与响应式布局
2. Domain 层
   - 负责题库、人格算法、结果元数据、海报结构描述
3. Service 层
   - 负责 bridge、接口访问、结果持久化、埋点、海报生成
4. Adapter 层
   - 封装 `【待桥接确认】` 与 `【待接口确认】` 能力，保证主链路可先用 mock 跑通

## 3. 页面主链路
1. Landing 初始化活动状态、登录态、历史结果摘要
2. 未登录点击开始测试时，通过 `bridge.ensureLogin()` 拉起登录
3. Quiz 页按固定顺序作答，支持回退和 24 小时断点续答
4. 第 16 题后进入 2.5 秒 calculating 页
5. `personalityEngine` 本地计算人格结果
6. Result 页先渲染本地结果，再异步调用 `repository.saveResult()`
7. 分享/保存走 `posterService + bridge` 组合链路
8. 重新预测时清理草稿与本次临时结果态

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
  - `remoteResult`
  - `saveStatus`
  - `pendingQueue`
- `uiStore`
  - `loading`
  - `toast`
  - `posterModal`
  - `pageTransitionLock`

### 4.2 本地缓存
- `wfti_quiz_draft_v1`
- `wfti_pending_result_v1`
- `wfti_activity_config_v1`

规则：
- 草稿有效期 24 小时
- 换账号立即清空旧草稿
- 结果成功写入后清除草稿

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

## 6. 结果页与海报设计落地
### 6.1 结果页
- 顶部人格代号 + 中文昵称
- 插画区与标签云
- 八维雷达图
- 人格解析文案
- 球星对照 / 天敌 / 拍档
- 二维码区
- 固定底部操作栏

### 6.2 海报生成
- 独立隐藏容器生成，不直接截整页
- 优先方案：DOM 模板 + `html2canvas`
- 备选方案：纯 Canvas 绘制
- 超过 5 秒视为失败，连续 3 次失败降级为截图提示
- 海报生成时隐藏底部操作栏

## 7. bridge 与接口边界
### 7.1 bridge 能力
- `ensureLogin()`
- `share()`
- `saveImage()`
- `openRoute()`
- `getEnv()`

全部通过 `bridge adapter` 封装，未确认协议先用 web mock 实现。

### 7.2 repository 接口
- `getLatestResult(uid)`
- `saveResult(payload)`
- `getActivityConfig(uid)`
- `getLinkageConfig(uid)`

### 7.3 服务语义
- 同一 UID 重测覆盖旧结果
- 保存失败不阻塞结果页
- 采用 `2s / 4s / 8s` 本地静默重试
- 二维码默认跳转活动落地页，并带 `source=poster&personality={code}`

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
- 接口失败 / bridge 失败

## 9. 实施策略
### 9.1 前端优先
1. 先搭工程骨架、状态管理、设计 token
2. 再落题库与算法单测
3. 然后实现 landing / quiz / calculating / result 主链路
4. 最后补海报、二维码、bridge、埋点

### 9.2 后端最小集
- `POST /api/wfti/result`
- `GET /api/wfti/result/latest`
- `GET /api/wfti/config`
- `GET /api/wfti/linkage/latest`

## 10. 当前阻塞与建议
- `【待桥接确认】`：登录、分享、保存图片、站内跳转协议
- `【待接口确认】`：鉴权、二维码配置、联动消费字段
- 不阻塞当前 tasks 拆解，均通过 adapter/mock 收口

## 11. 结论
当前已具备进入任务拆解与技术评审条件。实现阶段建议前后端并行，前端先以 mock / adapter 跑通主链路，再逐步替换真实 bridge 与接口。
