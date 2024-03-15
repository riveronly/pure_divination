<template>
    <!--时间时辰-->
    <div class="timeNowInfo">
        <el-text class="bigFont">{{ getLunarDate() }}</el-text>
        <el-text class="bigFont">{{ getGregorianDate() }}</el-text>
    </div>
    <!--卦象结果-->
    <div v-if="state.refresh" class="resultInfo">
        <div
            v-for="(item, index) in [
                state.resultMonth,
                state.resultDay,
                state.resultHour
            ]"
            :key="index"
            class="result"
        >
            <div class="bigFont">{{ getTypeNum(index) }} {{ item.type }}</div>
            <span>{{ item.summary }}</span>
        </div>
    </div>
    <!--更新时间-->
    <div v-if="state.refresh" class="updateInfo">
        <div>{{ state.fortuneMsg }}</div>
        <div>
            {{
                state.lunarMonth > state.lunarYearMonth
                    ? state.lunarYearMonth === 0
                        ? ``
                        : `${state.thisYearNumber}年闰${
                            state.lunarYearMonth
                        }月 月份+1`
                    : ``
            }}
        </div>
        <div>{{ state.nextUpdateTime }}</div>
        <div v-on:click="refreshMain" class="result" style="width: 20px;height: 20px;padding: 8px;margin-right: 0">
            <img src="@/assets/icon/refresh-circle.svg" alt="" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive } from 'vue'
import { Lunar, LunarYear, Solar, SolarYear } from 'lunar-typescript'
import { fortuneArray, hexagramArray } from '../config/config.ts'

const state = reactive({
    resultMonth: { type: '', desc: '', summary: '' },
    resultDay: { type: '', desc: '', summary: '' },
    resultHour: { type: '', desc: '', summary: '' },

    fortuneMsg: '',

    lunarMonth: 0,
    lunarDay: 0,
    lunarHour: 0,
    refresh: true,
    nextUpdateTime: '',
    thisYearNumber: 0,
    lunarYearMonth: 0
})

onMounted(() => {
    calcResult()
    evenThough()
})

/**
 * 获取Bing每日壁纸
 */
// const fetchBackground = async () => {
//     const bg = await fetch('/api/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN')
//     const json = await bg.json()
//     const bgRef = ref('')
//     bgRef.value = 'https://cn.bing.com' + json.images[0].url
//     document.body.style.background = `url(${bgRef.value})`
// }

/**
 * 每分钟重新计算 更新剩余分钟数
 */
const evenThough = () => {
    millisecondRemaining()
    setInterval(() => {
        millisecondRemaining()
    }, 1000)
}

/**
 * 更新剩余分钟数
 */
const millisecondRemaining = () => {
    const now = new Date()
    const nextPeriod = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Math.floor(now.getHours()) + (now.getHours() % 2 === 0 ? 1 : 2),
        0,
        0,
        0
    ).getTime()
    const millisecond = nextPeriod - now.getTime()

    if (millisecond === 0) {
        refreshMain()
    }

    const minutes = Math.floor(millisecond / 1000 / 60)
    state.nextUpdateTime = '距下个卦象还剩' + minutes + '多分钟'
    // console.log(state.nextUpdateTime)

    return millisecond
}

const refreshMain = () => {
    state.refresh = false
    nextTick(() => {
        calcResult()
        state.refresh = true
    })
}

/**
 * 获取农历日期
 */
const getLunarDate = () => {
    let lunarDay = Solar.fromDate(new Date()).getLunar()
    const lunarHour = Solar.fromDate(new Date()).getLunar().getTimeZhiIndex() + 1
    if (lunarHour === 1) {//如果是子时，已是下一天
        // 获取当前日期
        let today = new Date()
        // 创建明天的日期
        let tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        lunarDay = Solar.fromDate(tomorrow).getLunar()
    }
    return `${lunarDay}
    ${Lunar.fromDate(new Date()).getTimeZhi()}时`
}

/**
 * 获取公历日期
 */
const getGregorianDate = () => {
    return `${new Date().toLocaleDateString()}日${new Date().getHours()}时`
}

/**
 * 获取对应落宫步数
 * @param index
 */
const getTypeNum = (index: number) => {
    return index === 0
        ? state.lunarMonth
        : index === 1
            ? state.lunarDay
            : state.lunarHour
}

/**
 * 计算卦象结果
 */
const calcResult = () => {
    const solar = Solar.fromDate(new Date())
    const lunar = solar.getLunar()

    const lunarMonth = lunar.getMonth()
    const lunarDay = lunar.getDay()
    const lunarHour = lunar.getTimeZhiIndex() + 1

    let palacePosition: number //宫位(1-6)
    let positionIndex: number

    //本年
    state.thisYearNumber = SolarYear.fromDate(new Date()).getYear()
    //本年是否有闰月，是闰几月
    state.lunarYearMonth = LunarYear.fromYear(
        2023 || state.thisYearNumber
    ).getLeapMonth()
    console.log('ocean-' + '' + '->' + state.lunarYearMonth)

    //月
    state.lunarMonth =
        lunarMonth +
        (lunarMonth > state.lunarYearMonth
            ? state.lunarYearMonth === 0
                ? 0
                : 1
            : 0)
    palacePosition = state.lunarMonth % 6 || 6
    positionIndex = palacePosition - 1
    state.resultMonth = hexagramArray[positionIndex]

    //日
    state.lunarDay = lunarDay
    if (lunarHour === 1) {//如果是子时，已是下一天
        state.lunarDay = lunarDay + 1
    }
    palacePosition += (state.lunarDay - 1) % 6
    positionIndex = (palacePosition % 6 || 6) - 1
    state.resultDay = hexagramArray[positionIndex]
    const fortuneDay = fortuneArray[positionIndex]

    //时
    state.lunarHour = lunarHour
    palacePosition += (state.lunarHour - 1) % 6
    positionIndex = (palacePosition % 6 || 6) - 1
    state.resultHour = hexagramArray[positionIndex]
    state.fortuneMsg = fortuneDay[positionIndex].msg
}
</script>

<style scoped>
.timeNowInfo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
}

.bigFont {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: #000;
}

.resultInfo {
    display: flex;
    flex-direction: row;
}

.result {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: start;
    text-align: start;
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    margin-right: 10px;
}

.result > span {
    color: #27424c;
}

.result:not(:last-child) {
    opacity: 0;
    animation: opacity-translate 1s forwards;
}

.result:last-child {
    opacity: 0;
    animation: opacity-translate 1s forwards;
}

.updateInfo {
    color: #27424c;
    opacity: 0;
    flex-direction: column;
    animation: opacity-translate 1s 1s forwards;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
        margin-top: 10px;
    }
}

@keyframes opacity-translate {
    0% {
        transform: translateY(-10px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@media only screen and (max-width: 1080px) {
    .resultInfo {
        flex-wrap: wrap;
    }

    .result {
        width: 100%;
        margin-bottom: 10px;
    }

    .timeNowInfo {
        flex-direction: column;
        align-items: start;
    }

    .bigFont {
        font-size: 20px;
    }
}
</style>
