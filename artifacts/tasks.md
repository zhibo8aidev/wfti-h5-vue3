# WFTI Vue3 H5 任务拆解

## 前端

### FE-01 工程骨架
- 目标：搭建 Vue3 H5 工程骨架、路由、状态管理、全局样式 token
- 产出：基础目录、路由外壳、状态容器、设计变量、异常页骨架
- 依赖：`artifacts/technical-design.md`、`artifacts/design.md`

### FE-02 题库与人格静态配置
- 目标：将 16 题、人格向量、隐藏人格、人格文案结构化为前端静态配置
- 产出：questionBank、personaMeta、关系链元数据
- 依赖：`FE-01`、`artifacts/specs/question-algorithm-spec.md`

### FE-03 人格算法引擎
- 目标：实现本地计算引擎与单测
- 产出：score mapper、hidden persona detector、distance matcher、测试用例
- 依赖：`FE-02`

### FE-04 落地页与活动状态页
- 目标：实现 landing、已测入口态、未开始/已结束状态页
- 产出：landing UI、CTA、防重点击、历史结果分支
- 依赖：`FE-01`、`FE-09`、`BE-02`、`BR-01`

### FE-05 答题主链路
- 目标：实现 16 题逐题答题、进度条、自动切题、回退、断点续答
- 产出：quiz 页面、切题动画、resume 弹层、本地草稿
- 依赖：`FE-01`、`FE-02`

### FE-06 计算过渡页与结果页
- 目标：实现 2.5 秒过渡页、结果页渲染与结果上报闭环
- 产出：calculating、result 页面、异步保存、失败重试队列
- 依赖：`FE-03`、`FE-05`、`BE-01`

### FE-07 雷达图与关系链组件
- 目标：实现 8 维雷达图、球星对照 / 天敌 / 拍档组件
- 产出：radar chart、relation cards、标签云
- 依赖：`FE-06`

### FE-08 海报生成与分享保存
- 目标：实现海报生成、分享名片、保存相册
- 产出：poster template、html2canvas/canvas 方案、失败降级、toast
- 依赖：`FE-06`、`BR-02`、`BE-03`

### FE-09 mock / adapter 层
- 目标：对桥接与接口不确定项进行统一收口
- 产出：repository adapter、bridge adapter、web mock 环境
- 依赖：`FE-01`

### FE-10 埋点接入
- 目标：接入页面、答题、结果、海报与 bridge 行为埋点
- 产出：tracker service、事件字典、错误日志钩子
- 依赖：`FE-04`、`FE-05`、`FE-06`、`FE-08`

## 后端

### BE-01 结果写入接口
- 目标：提供结果保存与覆盖更新能力
- 产出：`POST /api/wfti/result`、参数校验、覆盖语义
- 依赖：`artifacts/technical-design.md`

### BE-02 历史结果查询接口
- 目标：支撑“查看我的结果”与登录后直达结果
- 产出：`GET /api/wfti/result/latest`
- 依赖：`BE-01`

### BE-03 活动配置与二维码配置
- 目标：提供活动状态、分享文案、二维码 landing 配置
- 产出：`GET /api/wfti/config`
- 依赖：`BE-01`

### BE-04 联动边界输出
- 目标：提供专题 / 社区 / 竞猜可消费的人格结果边界
- 产出：`GET /api/wfti/linkage/latest` 或等价数据边界
- 依赖：`BE-01`、`BE-02`

### BE-05 mock 服务与联调环境
- 目标：为前端提供先行联调能力
- 产出：mock 数据仓、联调说明、样例返回
- 依赖：`BE-01`、`BE-02`、`BE-03`

## bridge / 配置确认

### BR-01 登录 bridge
- 目标：确认登录拉起、成功、取消回调
- 产出：bridge 协议文档、前端 adapter 对接说明

### BR-02 分享与保存相册 bridge
- 目标：确认图片分享、链接分享、相册权限与回调
- 产出：分享 / 保存协议说明

### BR-03 配置来源确认
- 目标：确认活动状态、分享文案、二维码配置来源
- 产出：字段清单、默认值、更新方式

### BR-04 站内路由 bridge
- 目标：确认结果页入口与二维码跳转的站内路由协议
- 产出：schema/path 规则、失败兜底方案

## QA / 联调

### QA-01 主链路联调
- 目标：验证 landing -> quiz -> calculating -> result -> poster 闭环
- 依赖：`FE-06`、`FE-08`、`BE-01`、`BE-02`

### QA-02 bridge 联调
- 目标：验证登录、分享、保存图片、路由跳转
- 依赖：`BR-01`、`BR-02`、`BR-04`

### QA-03 设计与多机型回归
- 目标：验证长屏布局、安全区、底栏固定、雷达图与海报表现
- 依赖：核心前端功能完成

### QA-04 边界验收
- 目标：覆盖未开始/已结束、网络异常、断点续答、保存失败、海报失败、接口失败重试
- 依赖：全部核心功能完成

## 推荐实施顺序
1. 前端先做 `FE-01`、`FE-02`、`FE-03`、`FE-09`
2. 后端并行做 `BE-01`、`BE-02`、`BE-03`
3. 主链路推进 `FE-04`、`FE-05`、`FE-06`、`FE-07`
4. bridge 确认并行推进 `BR-01`、`BR-02`、`BR-04`
5. 完成海报与埋点 `FE-08`、`FE-10`
6. 最后执行 `QA-01` 到 `QA-04`
