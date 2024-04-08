<template>
    <div v-if="state.refresh">
        <div class="resultDiv" style="justify-content: space-between">
            <div>{{ getLunarDate() }}</div>
            <div>{{ getSolarDate() }}</div>
        </div>

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
import { Solar } from 'lunar-typescript'
import { fortuneArray, Hexagram, hexagramArray } from '../config.ts'

const state = reactive({
    resultMonth: {} as Hexagram,
    resultDay: {} as Hexagram,
    resultHour: {} as Hexagram,
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
    state.nextUpdateTime = '剩余' + (Math.floor(second / 60) + 1) + '分钟'
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
    let lunar = Solar.fromDate(new Date()).getLunar()
    return `${lunar}${lunar.getTimeZhi()}时`
}

/**
 * 获取阳历日期
 */
const getSolarDate = () => {
    const solar = Solar.fromDate(new Date())
    return `${solar.toString()}日${solar.getHour()}时`
}

/**
 * 计算小六壬结果
 */
const getDivination = () => {
    const currentSolar = Solar.fromDate(new Date())
    const currentLunar = currentSolar.getLunar()

    const lunarMonthIndex = currentLunar.getMonth()
    const lunarDayIndex = currentLunar.getDay()
    const lunarHourIndex = currentLunar.getTime().getZhiIndex() + 1

    let lunarMonthArr = []
    for (let i = 0; i < lunarMonthIndex; i++) {
        let index = i % hexagramArray.length
        lunarMonthArr[i] = hexagramArray[index]
    }

    let startDayIndex = lunarMonthArr.length > 0 ? hexagramArray.indexOf(lunarMonthArr[lunarMonthArr.length - 1]) : 0
    let lunarDayArr = []
    for (let i = 0; i < lunarDayIndex; i++) {
        let index = (startDayIndex + i) % hexagramArray.length
        lunarDayArr[i] = hexagramArray[index]
    }

    let startHourIndex = lunarDayArr.length > 0 ? hexagramArray.indexOf(lunarDayArr[lunarDayArr.length - 1]) : 0
    let lunarHourArr = []
    for (let i = 0; i < lunarHourIndex; i++) {
        let index = (startHourIndex + i) % hexagramArray.length
        lunarHourArr[i] = hexagramArray[index]
    }

    //月
    state.resultMonth = lunarMonthArr[lunarMonthArr.length - 1]
    //日
    state.resultDay = lunarDayArr[lunarDayArr.length - 1]
    //时
    state.resultHour = lunarHourArr[lunarHourArr.length - 1]
    //日时解析
    state.fortuneMsg = fortuneArray
        [hexagramArray.indexOf(lunarDayArr[lunarDayArr.length - 1])]
        [hexagramArray.indexOf(lunarHourArr[lunarHourArr.length - 1])].msg
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
