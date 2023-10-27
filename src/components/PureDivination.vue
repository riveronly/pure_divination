<template>
  <div>
    <div class="info">
      <el-text class="type">{{ getLunarDate() }}</el-text>
      <el-text class="type">{{ getDate() }}</el-text>
    </div>

    <div class="main">
      <div>
        <div v-for="(item, index) in [/*state.resultMonth, state.resultDay,*/ state.resultHour]" v-if="state.refresh"
             :key="index"
             class="result">
          <div class="type">
            {{ getTypeNum(2) }} {{ item.type }}
          </div>
          <div>
            <span>总结:</span>
            {{ item.summary }}
          </div>
          <div>
            <span>详情:</span>
            {{ item.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive} from "vue";
import {Lunar, Solar} from 'lunar-typescript';
import {hexagramArray} from "./config.ts";

const emit = defineEmits(["stopLoading"])
const state = reactive({
  resultMonth: {type: "", desc: "", summary: ""},
  resultDay: {type: "", desc: "", summary: ""},
  resultHour: {type: "", desc: "", summary: ""},

  lunarMonth: 0,
  lunarDay: 0,
  lunarHour: 0,
  refresh: true,
});

onMounted(() => {
  emit("stopLoading")
  calcResult()
  updateTimeRemaining()
});

const updateTimeRemaining = () => {
  const now = new Date();
  const nextPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(now.getHours()) + (now.getHours() % 2 === 0 ? 1 : 2), 0, 0, 0).getTime();
  const timeRemaining = nextPeriod - now.getTime();
  console.log("距下次更新还剩" + (timeRemaining / 1000 / 60).toFixed(0) + "分钟")
  setTimeout(() => {
    state.refresh = false
    nextTick(() => {
      calcResult()
      state.refresh = true
    })
    updateTimeRemaining()
  }, timeRemaining)
}

/**
 * 获取农历日期
 */
const getLunarDate = () => {
  return Lunar.fromDate(new Date()).toString() + "日" + Lunar.fromDate(new Date()).getTimeZhi() + "时";
};

/**
 * 获取公历日期
 */
const getDate = () => {
  return new Date().toLocaleDateString() + "日" + new Date().getHours() + "时";
};

/**
 * 获取对应落宫步数
 * @param index
 */
const getTypeNum = (index: number) => {
  return index === 0 ? state.lunarMonth : (index === 1 ? state.lunarDay : state.lunarHour);
};

/**
 * 计算卦象结果
 */
const calcResult = () => {
  const solar = Solar.fromDate(new Date());
  const lunar = solar.getLunar();

  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();
  const lunarHour = lunar.getTimeZhiIndex() + 1;

  let palacePosition: number; //宫位(1-6)
  let positionIndex: number;

  //月
  state.lunarMonth = lunarMonth;
  palacePosition = lunarMonth % 6 || 6;
  positionIndex = palacePosition - 1;
  state.resultMonth = hexagramArray[positionIndex];

  //日
  state.lunarDay = lunarDay;
  palacePosition += (lunarDay - 1) % 6;
  positionIndex = ((palacePosition % 6) || 6) - 1;
  state.resultDay = hexagramArray[positionIndex];

  //时
  state.lunarHour = lunarHour;
  palacePosition += (lunarHour - 1) % 6;
  positionIndex = ((palacePosition % 6) || 6) - 1;
  state.resultHour = hexagramArray[positionIndex];
};
</script>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: start;
  justify-content: start;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(30px)
}

.result > :not(:last-child) div {
  margin-bottom: 10px;
}

.result > div > span {
  color: #27ae60;
}

.type {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: #000;
}

.main {
  display: flex;
  flex-direction: row;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  /*animation: opacity-translate 1s;*/
}

/*
.result:first-child {
  opacity: 0;
  animation: opacity-translate 1s forwards;
}

.result:nth-child(2) {
  opacity: 0;
  animation: opacity-translate 1s forwards;
}
*/

.result:last-child {
  opacity: 0;
  animation: opacity-translate 1s forwards;
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
  .main {
    flex-wrap: wrap;
  }

  .info {
    flex-direction: column;
    align-items: start;
  }

  .type {
    font-size: 20px;
  }
}
</style>