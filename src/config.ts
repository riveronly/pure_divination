export interface Hexagram {
    type: string
    title: string
    desc: string
    number: string
    summary: string
}

export const hexagramArray: Array<Hexagram> = [
    {
        type: '小吉',
        title: '[小吉] 人来喜时，五行属木，临六合，凡谋事主一、五、七有和合、吉利之含义。',
        desc: `小吉最吉昌，路上好商量，阴人来报喜，失物在坤方，行人立刻至，交易甚是强。凡事皆合好，病者保安康，大吉又大顺，万事如意详，出行可得喜，千里吉安祥。诸事可心顺，有忧皆消光，求借自来助，众友愿相帮，重病莫要愁，久病得安康。不见得相见，不打自归庄，千人称赞君，无限上荣光，交易成兴隆，十二分财量.`,
        number: '人来喜时，属水，六合，凡事主逢在一、五、七',
        summary: '吉，小惊喜，发小财，不持久。'
    },
    {
        type: '空亡',
        title: '[空亡] 音信稀时，五行属土，颜色黄色，方位中央；临勾陈。谋事主三、六、九。有不吉、无结果、忧虑之含义。',
        desc: `空亡事不长，阴人无主张，求财心白费，行人有灾殃，失物永不见，官事有刑伤。病人遇邪鬼，久病添祸殃，失物难找见，找寻空荡荡，出行不吉利，凶多不吉祥。办事凶为多，处处有阻挡，求借不能成，成事化败伤，得病凶多噩，久患雪加霜。寻人无音信，知音变空想，万口都诽骂，小舟遭狂浪，求财有二分，不吉不利亡`,
        number: '音信稀时，属土，勾陈，凡事主在三、六、九（辰未丑）',
        summary: '凶，没有结果，失去核心，没意义。'
    },
    {
        type: '大安',
        title: '[大安] 身不动时，五行属木，颜色青色，方位东方。临青龙，凡谋事主一、五、七。有静止、心安。吉祥之含义。',
        desc: `大安事事昌，求财在坤方，失物去不远，宅舍保安康，行人身未动，病者主无妨。将军回田野，仔细与推详，丢失在附近，可能西南向，安居得吉日，不可动身祥。办事别出屋，求借邀自房，得病凶化吉，久疾得安康，寻人知音信，可能归村庄。口舌能消散，远行要提防，交易别出村，离屯细推详，求财有八分，得全不出房。`,
        number: '身不动时，属木，青龙，凡事主逢一、五、七（寅巳申）',
        summary: '吉，持久的，安稳的事情过程不变。'
    },
    {
        type: '留连',
        title: '[留连] 人未归时，五行属水，颜色黑色，方位北方，临玄武，凡谋事主二、八、十。有喑味不明，延迟。纠缠．拖延、漫长之含义。',
        desc: `留连事未当，求事日莫光，凡事只宜缓，去者未回向，失物南方去，急急行便访。紧记防口舌，人口且平祥，丢失难寻找，窃者又转场，出行定不归，久去拖延长。办事不果断，牵连又返往，求借不易成，被求而彷徨，此日患疾病，几天不复康。找人迷雾中，迷迷又恍惚，口舌继续有，拖拉又伸长，女方嫁吉日，求财六分量。`,
        number: '人未归时，属水，玄武，凡事主逢在二、八、十（卯午子）',
        summary: '凶，延迟，拖延，漫长，曲折。'
    },
    {
        type: '速喜',
        title: '[速喜] 人即至时，五行属火，颜色红色方位南方，临朱雀，谋事主三，六，九。有快速、喜庆，吉利之含义。指时机已到。',
        desc: `速喜喜临乡，求财往南方，失物申午未，逢人路寻详，官事有福德，病者无大伤。六畜田稼庆，行人有音向，丢失得音信，微乐在面上，出行遇吉利，小喜而顺当。办事如逢春，吉利又荣光，小量可求借，大事难全强，久病见小愈，得病速回康，寻人得知见，口舌见消亡，交易可得成，但不太久长，求财有十分，吉时得顺当。`,
        number: '人便至时，属火，朱雀，凡事主在三、六、九 （辰戌未）',
        summary: '吉，很快速，喜庆，时机到了'
    },
    {
        type: '赤口',
        title: '[赤口] 官事凶时，五行属金，颜色白色，方位西方，临白虎，谋事主四、七，十。有不吉、惊恐，凶险、口舌是非之含义。',
        desc: `赤口主口伤，官事且紧防，失物急去找，行人有惊慌，鸡犬多作怪，病者上西方。更须防咒咀，恐怕染瘟殃，找物犯谎口，寻问无音向，出门千口怨，言谈万骂伤。办事犯口舌，难成有阻挡，求借不全顺，闭口无事张，得病千口猜，求医还无妨。寻人得凶音，人心不安详，口舌犯最重，交易口舌防，求财只四分，逢吉才成当。`,
        number: '官事凶时，属金，白虎，凡事主在四、七、十',
        summary: '凶，口舌之争，官司纠纷。'
    }
]

export const fortuneArray = [
    [
        { msg: '' },
        { msg: '小吉加空亡，病人不妥当，失物正东找，婚姻再想想。' },
        { msg: '小吉加大安，事事两周全，婚姻当日定，失物自己损。' },
        { msg: '小吉加留连，事事有反还，婚姻有人破，失物上西南。' },
        { msg: '小吉加速喜，事事从头起，婚姻能成就，失物在院里。' },
        { msg: '小吉加赤口，办事往外走，婚姻有难处，失物丢了手。' }
    ],
    [
        { msg: '空亡加小吉，事事有猜疑，婚姻有喜事，失物回家里。' },
        { msg: '' },
        { msg: '空亡加大安，事事不周全，婚姻从和好，失物反复间。' },
        { msg: '空亡加留连，办事处处难，婚姻重新定，失物永不还。' },
        { msg: '空亡加速喜，事事怨自己，婚姻有一定，失物在家里。' },
        { msg: '空亡加赤口，办事官非有，婚姻难定准，失物往远走。' }
    ],
    [
        { msg: '大安加小吉，事事从己及，失物不出门，婚姻成就地。' },
        { msg: '大安加空亡，病人要上床，失物无踪影，事事不顺情。' },
        { msg: '' },
        { msg: '大安加留连，办事不周全，失物西北去，婚姻晚几天。' },
        { msg: '大安加速喜，事事自己起，失物当日见，婚姻自己提。' },
        { msg: '大安加赤口，办事不顺手，失物不用找，婚姻两分手。' }
    ],
    [
        { msg: '留连加小吉，事事不用提，失物东南去，病者出人齐。' },
        { msg: '留连加空亡，病人准死亡，失物不见面，婚姻两分张。' },
        { msg: '留连加大安，办事两分张，婚姻有喜事，先苦后来甜。' },
        { msg: '' },
        { msg: '留连加速喜，事事由自己，婚姻有成意，失物三天里。' },
        { msg: '留连加赤口，病者死人口，失物准丢失，婚姻两分手。' }
    ],
    [
        { msg: '速喜加小吉，婚姻有人提，病人当天好，时物在家里。' },
        { msg: '速喜加空亡，婚姻有分张，病者积极治，失物不久见。' },
        { msg: '速喜加大安，事事都平安，姻姻成全了，占病都相安。' },
        { msg: '速喜加留连，婚姻不可言，失物无信息，病人有仙缘。' },
        { msg: '' },
        { msg: '速喜加赤口，自己往外走，失物往正北，婚姻得勤走。' }
    ],
    [
        { msg: '赤口加小吉，办事自己提，婚姻不能成，失物无信息。' },
        { msg: '赤口加空亡，无病也上床，失物不用找，婚姻不能成。' },
        { msg: '赤口加大安，办事险和难，失物东北找，婚姻指定难。' },
        { msg: '赤口加留连，办事有困难，行人在外走，失物不回还。' },
        { msg: '赤口加速喜，婚姻在自己，失物有着落，办事官事起。' },
        { msg: '' }
    ]
]
