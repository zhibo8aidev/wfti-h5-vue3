import type { DimensionKey, PersonaCode, PersonaMeta, QuestionItem } from './types';

export const DIMENSIONS: DimensionKey[] = ['F1', 'F2', 'E1', 'E2', 'S1', 'S2', 'A1', 'A2'];

export const QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    dimension: 'F1',
    title: '世界杯分组出来了，你支持的球队分到了「死亡之组」，你的第一反应是？',
    options: [
      { key: 'A', text: '死亡之组又怎样？八进四我都想好怎么走了，信仰不灭', score: 1 },
      { key: 'B', text: '有点慌，但还是会看，不行就当见证历史了', score: 2 },
      { key: 'C', text: '赶紧看看其他组有没有更值得追的队伍，人生苦短何必吊死一棵树', score: 3 }
    ]
  },
  {
    id: 2,
    dimension: 'F1',
    title: '你在直播吧看到「你的主队核心球星转会到死敌球队」的新闻，你？',
    options: [
      { key: 'A', text: '心碎但立场不变，我支持的是球衣上的队徽，不是某个人', score: 1 },
      { key: 'B', text: '纠结好一阵子，可能会同时关注两支队，但主队还是主队', score: 2 },
      { key: 'C', text: '那我也跟着关注新东家吧，球星在哪精彩就在哪', score: 3 }
    ]
  },
  {
    id: 3,
    dimension: 'F2',
    title: '直播吧社区有人发帖说「越位规则根本不合理应该取消」，你？',
    options: [
      { key: 'A', text: '洋洋洒洒写了 800 字回帖，从造越位战术讲到越位规则的百年演变史', score: 1 },
      { key: 'B', text: '简单回复「越位存在有它的道理」，不太想深入辩论', score: 2 },
      { key: 'C', text: '越位是什么？就是那个让我刚才的欢呼白喊的东西吧？', score: 3 }
    ]
  },
  {
    id: 4,
    dimension: 'F2',
    title: '世界杯期间你打开直播吧最先看的内容是？',
    options: [
      { key: 'A', text: '赛后技术统计 + 热力图 + 跑动距离，复盘每个进球的战术逻辑', score: 1 },
      { key: 'B', text: '比分结果和进球集锦，顺便扫一眼新闻评论区', score: 2 },
      { key: 'C', text: '热搜段子和球星表情包，看看今天又有什么名场面可以存图', score: 3 }
    ]
  },
  {
    id: 5,
    dimension: 'E1',
    title: '你支持的球队在第 94 分钟头球绝杀了！你的反应是？',
    options: [
      { key: 'A', text: '内心波涛汹涌但表面只是用力握了一下拳，然后冷静地看 VAR 回放', score: 1 },
      { key: 'B', text: '猛拍沙发大喊一声，立刻打开直播吧发一条庆祝评论', score: 2 },
      { key: 'C', text: '原地弹射起飞把啤酒泼了一地，抱住旁边的人不管认不认识，邻居以为发生了地震', score: 3 }
    ]
  },
  {
    id: 6,
    dimension: 'E1',
    title: '你在直播吧看文字直播，看到一条「VAR 取消进球」的推送，你？',
    options: [
      { key: 'A', text: '叹口气，打开回放看看到底是不是越位', score: 1 },
      { key: 'B', text: '在评论区发了一串省略号和一个裂开的表情', score: 2 },
      { key: 'C', text: '手机差点没摔出去，连发三条评论骂 VAR 是足球之敌，手在抖', score: 3 }
    ]
  },
  {
    id: 7,
    dimension: 'E2',
    title: '你支持的球队连输两场小组赛，最后一轮必须大比分赢才有理论出线机会，你？',
    options: [
      { key: 'A', text: '做好心理准备提前进入吃瓜模式，不抱不切实际的幻想', score: 1 },
      { key: 'B', text: '嘴上说「没戏了」但还是默默定了闹钟，万一呢', score: 2 },
      { key: 'C', text: '穿上球衣倒好啤酒，「数学上还没淘汰信仰就不熄灭」，发一条动态说今晚见证奇迹', score: 3 }
    ]
  },
  {
    id: 8,
    dimension: 'E2',
    title: '世界杯决赛你支持的球队输了，赛后你在直播吧的状态是？',
    options: [
      { key: 'A', text: '伤心但理性接受，发了一句「四年后再来」关掉了 APP', score: 1 },
      { key: 'B', text: '反复刷赛后分析和球员采访，心情低落好几天但慢慢恢复', score: 2 },
      { key: 'C', text: '连续一周在社区发情感帖，看到决赛集锦就破防，已经在倒计时下一届了', score: 3 }
    ]
  },
  {
    id: 9,
    dimension: 'S1',
    title: '你支持的球队半决赛绝杀晋级了！比赛结束那一刻你最想做的事是？',
    options: [
      { key: 'A', text: '一个人在黑暗中静静坐了五分钟消化这种快乐，然后默默关掉手机去睡觉', score: 1 },
      { key: 'B', text: '立刻打电话给那个和你一样支持这队的朋友，两人在电话里疯狂复盘每一分钟', score: 2 },
      { key: 'C', text: '冲下楼找到最近的夜宵摊或便利店，跟任何一个还醒着的人分享这个消息，不管认不认识', score: 3 }
    ]
  },
  {
    id: 10,
    dimension: 'S1',
    title: '你在看球的时候旁边坐了一个陌生人，TA 穿着对手球队的球衣，你？',
    options: [
      { key: 'A', text: '互不打扰，各看各的，我甚至会稍微挪远一点避免尴尬', score: 1 },
      { key: 'B', text: '保持礼貌距离，精彩时刻对视一笑，赛后可能握个手说声「好球」', score: 2 },
      { key: 'C', text: '开场前就开始互相调侃垃圾话，进球了对着 TA 做庆祝动作，赛后加了微信约下次继续', score: 3 }
    ]
  },
  {
    id: 11,
    dimension: 'S2',
    title: '世界杯期间你在直播吧社区的活跃程度是？',
    options: [
      { key: 'A', text: '潜水看帖为主，偶尔点几个赞，不太发言', score: 1 },
      { key: 'B', text: '碰到精彩比赛会发个短评或转发一条新闻，但不是每场都发', score: 2 },
      { key: 'C', text: '赛前预测帖 + 比赛实时吐槽 + 赛后复盘长文，评论区出现频率比解说员还高', score: 3 }
    ]
  },
  {
    id: 12,
    dimension: 'S2',
    title: '有人在直播吧评论区说了一个离谱的观点（比如「梅西不配进世界杯最佳阵容」），你？',
    options: [
      { key: 'A', text: '看到了但懒得回，各有各的看法', score: 1 },
      { key: 'B', text: '点了一下反对，或者简短回复一句「不敢苟同」', score: 2 },
      { key: 'C', text: '直接开麦长文回击，配图配数据配历史战绩，这事不辩清楚今天不睡了', score: 3 }
    ]
  },
  {
    id: 13,
    dimension: 'A1',
    title: '世界杯即将开始，你的备战状态是？',
    options: [
      { key: 'A', text: '知道有世界杯就行，有空看看直播，忙了看集锦也可以', score: 1 },
      { key: 'B', text: '重点场次已经标记了，愿意为此调整一下作息', score: 2 },
      { key: 'C', text: '假已经请好了，零食囤完了，赛程表打印贴床头，直播吧通知全开，这个月我只属于足球', score: 3 }
    ]
  },
  {
    id: 14,
    dimension: 'A1',
    title: '直播吧上架了一款世界杯限定周边（球衣 / 纪念品 / 实体球星卡），你？',
    options: [
      { key: 'A', text: '看看热闹不花钱，精神支持即可', score: 1 },
      { key: 'B', text: '喜欢的球队有好看的周边可能会入一件', score: 2 },
      { key: 'C', text: '球衣球鞋围巾贴纸一套拿下，限定版不抢到手心不安，柜子里已经没有位置了', score: 3 }
    ]
  },
  {
    id: 15,
    dimension: 'A2',
    title: '直播吧的世界杯竞猜活动开始了，你的策略是？',
    options: [
      { key: 'A', text: '跟着热门选强队赢，不折腾', score: 1 },
      { key: 'B', text: '大部分跟大众，但偶尔根据自己的分析猜一两场冷门', score: 2 },
      { key: 'C', text: '专挑黑马和大冷门下手，「非洲球队进四强」这种预测我每届都有，万一呢', score: 3 }
    ]
  },
  {
    id: 16,
    dimension: 'A2',
    title: '凌晨 3 点有一场不涉及你主队的「神仙打架」对决（巴西 vs 阿根廷），但你明天有重要事，你？',
    options: [
      { key: 'A', text: '理性胜出，定好闹钟明天看直播吧的回放和集锦', score: 1 },
      { key: 'B', text: '先睡到凌晨，闹钟响了如果醒了就看，太困就算了', score: 2 },
      { key: 'C', text: '还用想？这是一辈子可能只看一次的对决！看完再说，打哈欠是明天的事', score: 3 }
    ]
  }
];

export const REGULAR_PERSONA_ORDER: PersonaCode[] = [
  'GOAT',
  'FANA',
  'GURU',
  'SOFA',
  'RIOT',
  'MUTE',
  'YOLO',
  'VIBE',
  'SALT',
  'JINX',
  'MOOD',
  'CLIP',
  'CHEF',
  'MONK',
  'SOUL',
  'DRIP'
];

export const PERSONAS: Record<PersonaCode, PersonaMeta> = {
  GOAT: {
    code: 'GOAT',
    name: '绿茵教父',
    copy: '既然认准了这抹颜色，这辈子就跟它死磕到底了。信仰要是不滚烫，那和白开水有什么区别？热爱不需要理由，只需要这一腔跨越时空的孤勇。',
    vector: [1, 1, 2, 3, 2, 2, 3, 2],
    tags: ['信仰图腾', '热血死忠', '队徽至上'],
    star: '梅西',
    enemy: 'MOOD',
    partner: 'FANA',
    color: '#0082FF'
  },
  FANA: {
    code: 'FANA',
    name: '熬夜圣体',
    copy: '熬最深的夜，看最燃的球。在这个月，咖啡就是我的血液，开球哨就是我的闹钟。只要球赛还没终场，我的字典里就永远没有“睡觉”这两个字。',
    vector: [1, 2, 3, 3, 2, 2, 3, 2],
    tags: ['凌晨在线', '燃到终场', '咖啡续命'],
    star: 'C罗',
    enemy: 'MONK',
    partner: 'GOAT',
    color: '#FF3D00'
  },
  GURU: {
    code: 'GURU',
    name: '野生教练',
    copy: '当你们在看球飞到哪了，我在看阵型是怎么散的。别说我没情感投入，我的大脑已经在这一秒钟内，替主教练完成了三次能够扭转乾坤的换人。',
    vector: [2, 1, 1, 2, 1, 2, 2, 2],
    tags: ['阵型雷达', '换人预案', '战术复盘'],
    star: '莫德里奇',
    enemy: 'CLIP',
    partner: 'SOFA',
    color: '#005FC7'
  },
  SOFA: {
    code: 'SOFA',
    name: '场外指导',
    copy: '虽然脚下是拖鞋，但心里装的是大力神杯。只要给我一个遥控器，我能在那场球赛里赢回全世界。赛场上是那22人，但屏幕前我才是绝对主宰。',
    vector: [2, 2, 2, 2, 2, 3, 2, 1],
    tags: ['遥控器主帅', '屏幕统帅', '赛后开会'],
    star: '德布劳内',
    enemy: 'YOLO',
    partner: 'GURU',
    color: '#111827'
  },
  RIOT: {
    code: 'RIOT',
    name: '易燃易爆',
    copy: '嗓门大不代表没逻辑，主要是心脏跳得太快，声音小了压不住。要是看球都带不来这一声咆哮，那还有什么灵魂？这种真性情才是足球最燃的部分。',
    vector: [2, 2, 3, 3, 2, 3, 2, 2],
    tags: ['分贝拉满', '情绪火山', '热血输出'],
    star: '姆巴佩',
    enemy: 'MUTE',
    partner: 'VIBE',
    color: '#FF3D00'
  },
  MUTE: {
    code: 'MUTE',
    name: '深水炸弹',
    copy: '内心已经上演了八次百米冲刺，表面上还是像坐禅一样优雅。绝杀时的那一声“牛掰”，是我最后的倔强。所有的澎湃，都藏在这一份克制的深情里。',
    vector: [1, 2, 2, 2, 1, 1, 2, 2],
    tags: ['表面冷静', '内心绝杀', '克制深情'],
    star: '凯恩',
    enemy: 'RIOT',
    partner: 'MONK',
    color: '#334155'
  },
  YOLO: {
    code: 'YOLO',
    name: '冷门刺客',
    copy: '强队捧杯那是例行公事，黑马逆袭才是生命奇迹。我就是要盯着那些没人看好的角落，万一奇迹发生了呢？平凡中孕育的非凡，才是这世界的真相。',
    vector: [2, 2, 2, 2, 2, 2, 2, 3],
    tags: ['黑马信徒', '赔率猎手', '奇迹偏爱'],
    star: '孙兴慜',
    enemy: 'SOFA',
    partner: 'DRIP',
    color: '#00A2A8'
  },
  VIBE: {
    code: 'VIBE',
    name: '气氛组担当',
    copy: '战术我可能看不懂，但气氛我必须拉满。只要啤酒管够、旗子刷够，我就是全场最亮的那个球场火种。输赢固然重要，但共享狂欢的过程要更加完美。',
    vector: [3, 3, 3, 2, 3, 3, 2, 2],
    tags: ['旗帜挥舞', '全场火种', '共享狂欢'],
    star: '内马尔',
    enemy: 'MONK',
    partner: 'CHEF',
    color: '#00C853'
  },
  SALT: {
    code: 'SALT',
    name: '嘴强王者',
    copy: '评论区才是我的第二主场。每一场精彩的对线，都是我对足球“真理”的一次全速冲刺。我不怕站到多数人的对立面，我只怕我的对手根本不敢接招。',
    vector: [2, 2, 2, 2, 2, 3, 2, 2],
    tags: ['评论区主场', '观点冲刺', '敢接招吗'],
    star: '布鲁诺',
    enemy: 'MUTE',
    partner: 'TROL',
    color: '#7C3AED'
  },
  JINX: {
    code: 'JINX',
    name: '毒奶体质',
    copy: '我的一句“稳了”抵过千言万语。如果不幸言中反向结局，只能说明足球这门玄学我还没钻研透。别怪我嘴毒，我只是被命运选中的那个反向明灯。',
    vector: [2, 2, 2, 1, 2, 2, 2, 3],
    tags: ['反向明灯', '玄学研究', '稳了别说'],
    star: '格列兹曼',
    enemy: 'GOAT',
    partner: 'DRIP',
    color: '#F59E0B'
  },
  MOOD: {
    code: 'MOOD',
    name: '墙头球迷',
    copy: '谁踢得好看我就是谁的死忠。人生苦短，为什么非要把快乐寄托在某支总让我心碎的球队身上？我只追逐这一刻的精彩，我的热爱永远保持新鲜感。',
    vector: [3, 2, 2, 2, 2, 2, 1, 2],
    tags: ['精彩至上', '快乐迁徙', '新鲜热爱'],
    star: '贝林厄姆',
    enemy: 'GOAT',
    partner: 'CLIP',
    color: '#EC4899'
  },
  CLIP: {
    code: 'CLIP',
    name: '三分钟热度',
    copy: '高光时刻才是足球的灵魂，我只负责打包多巴胺。把90分钟的精华浓缩到三分钟，这叫效率，懂吗？在信息爆炸的时代，我只收藏最璀璨的星光。',
    vector: [3, 3, 1, 1, 2, 1, 1, 1],
    tags: ['高光收藏', '效率看球', '多巴胺剪辑'],
    star: '维尼修斯',
    enemy: 'GURU',
    partner: 'MOOD',
    color: '#06B6D4'
  },
  CHEF: {
    code: 'CHEF',
    name: '后勤部长',
    copy: '你以为我半夜爬起来是看谁夺冠？我主要是想找个最正当的理由，和兄弟们在烤串堆里共享这份热闹。球场在那边，但这餐桌上的烟火气也同样迷人。',
    vector: [3, 3, 2, 2, 3, 2, 2, 1],
    tags: ['夜宵统筹', '餐桌主场', '兄弟集合'],
    star: '阿尔瓦雷斯',
    enemy: 'MUTE',
    partner: 'VIBE',
    color: '#16A34A'
  },
  MONK: {
    code: 'MONK',
    name: '局外人',
    copy: '进球也好，乌龙也罢，我都报以慈悲的微笑。世界在狂欢，我在保持心态的最后一块净土。能让你破防的是比分，能让我动容的只有那清晨的微风。',
    vector: [3, 3, 1, 1, 1, 1, 1, 1],
    tags: ['心态净土', '慈悲微笑', '清晨微风'],
    star: '坎特',
    enemy: 'FANA',
    partner: 'MUTE',
    color: '#64748B'
  },
  SOUL: {
    code: 'SOUL',
    name: '散场诗人',
    copy: '比胜负更动人的，是球星老去时的背影。我在那场夏天的雨里，捞起过无数足球少年的梦。足球不只是圆的，它还盛满了我们那回不去的青葱岁月。',
    vector: [2, 2, 3, 1, 2, 2, 3, 2],
    tags: ['背影收藏', '夏天的雨', '青春回声'],
    star: '莫德里奇',
    enemy: 'CLIP',
    partner: 'GOAT',
    color: '#2563EB'
  },
  DRIP: {
    code: 'DRIP',
    name: '第六感球迷',
    copy: '别跟我讲数据，那太冷冰冰。我能闻到空气里转机降临的味道，这是足球给我的直觉超能力，在这种玄学面前，任何理性的逻辑推演都显得苍白无力。',
    vector: [2, 3, 3, 2, 2, 2, 2, 2],
    tags: ['直觉超能力', '玄学嗅觉', '转机预感'],
    star: '迪马利亚',
    enemy: 'GURU',
    partner: 'JINX',
    color: '#0EA5E9'
  },
  TROL: {
    code: 'TROL',
    name: '杠精球评家',
    copy: '我不是故意抬杠，我只是觉得这个世界的观点太单一了。如果不跟我过两招，你怎么知道自己的热爱有多深？我毕生的追求，就是在对攻中寻求真理。',
    tags: ['线上对攻', '观点校准', '真理追击'],
    star: '罗伊·基恩',
    enemy: 'MONK',
    partner: 'SALT',
    color: '#7C3AED',
    isHidden: true
  },
  HERO: {
    code: 'HERO',
    name: '四年一醒',
    copy: '平时我是个路人甲，世界杯开始的那一刻，我能比任何死忠都更疯狂。这种四年一次的觉醒，懂的人自然懂。我不是在追星，我是在寻找那个丢失的自己。',
    tags: ['四年觉醒', '反差狂热', '奇迹续航'],
    star: '罗纳尔多',
    enemy: 'CLIP',
    partner: 'FANA',
    color: '#FF3D00',
    isHidden: true
  }
};
