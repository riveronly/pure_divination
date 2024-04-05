<template>
    <div v-if="state.refresh">
        <div>{{ getLunarDate() }}</div>
        <div>{{ getGregorianDate() }}</div>
        <div class="resultDiv">
            <div v-for="(item) in [
                state.resultMonth,
                state.resultDay,
                state.resultHour
            ]"
                 class="result"
            >
                {{ item.type }}
            </div>
        </div>
        <div v-if="state.fortuneMsg!==''">{{ state.fortuneMsg }}</div>
        <div v-if="(state.lunarMonth > state.lunarYearMonth)&&state.lunarYearMonth !== 0">
            {{ `${state.thisYearNumber}年闰${state.lunarYearMonth}月` }}
        </div>
        <div>{{ state.nextUpdateTime }}</div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive } from 'vue'
import { Lunar, LunarYear, Solar, SolarYear } from 'lunar-typescript'
import { fortuneArray, hexagramArray } from '../config.ts'

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
    nextLunaTime: 0,
    thisYearNumber: 0,
    lunarYearMonth: 0
})

onMounted(() => {
    getDivination()
    getRefreshTime()
    updateRemaining()
    setInterval(() => {
        updateRemaining()
    }, 1000)
})

const getRefreshTime = () => {
    const now = new Date()
    state.nextLunaTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + (now.getHours() % 2 === 0 ? 1 : 2),
        0,
        0,
        0
    ).getTime()
}

/**
 * 更新 剩余时间
 */
const updateRemaining = () => {
    const millisecond = state.nextLunaTime - new Date().getTime()
    const second = Math.floor(millisecond / 1000)
    state.nextUpdateTime = '剩余' + Math.floor(second / 60) + '分钟'
    if (second <= 0) {
        refreshMain()
    }
    return millisecond
}

const refreshMain = () => {
    state.refresh = false
    nextTick(() => {
        getDivination()
        getRefreshTime()
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
    return `${lunarDay}${Lunar.fromDate(new Date()).getTimeZhi()}时`
}

/**
 * 获取公历日期
 */
const getGregorianDate = () => {
    return `${new Date().toLocaleDateString()}日${new Date().getHours()}时`
}

/**
 * 获取对应落宫步数
 */
// const getTypeNum = (index: number) => {
//     return index === 0
//         ? state.lunarMonth
//         : index === 1
//             ? state.lunarDay
//             : state.lunarHour
// }

/**
 * 计算卦象结果
 */
const getDivination = () => {
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
        state.thisYearNumber
    ).getLeapMonth()

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

.resultDiv {
    display: flex;
    width: 100%;
}

.result {
    flex: 1;
    margin: 5px;
    padding: 10px;
    border-radius: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
