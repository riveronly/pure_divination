<template>
  <div>
    <div class="info">
      <el-text class="type">{{ getLunarDate() }}</el-text>
      <el-text class="type">{{ new Date().toLocaleDateString() + "日" + new Date().getHours() + "时" }}</el-text>
    </div>

    <div class="main">
      <div v-for="(item, index) in [state.cause, state.elapse, state.outcome]" v-show="item.title" :key="index"
           :style="{backgroundColor: index===2?'#5f93a0':''}" class="result">
        <div class="type">
          {{ getTypeNum(index) }} {{ item.type }}
        </div>
        <div>
          <span>简译：</span>
          {{ item.authorSay }}
        </div>
        <div>
          <span>详情：</span>
          {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, defineEmits } from "vue";
  import { Lunar, Solar } from 'lunar-typescript';
  import { hexagramArray } from "./config.ts";

  const emit = defineEmits(["stopLoading"])
  const state = reactive({
    cause: {type: "", title: "", desc: "", number: "", authorSay: ""},
    elapse: {type: "", title: "", desc: "", number: "", authorSay: ""},
    outcome: {type: "", title: "", desc: "", number: "", authorSay: ""},

    lunarMonth: 0,
    lunarDay: 0,
    lunarHour: 0,
  });

  onMounted(() => {
    calcResult();
    emit("stopLoading")
  });

  const getLunarDate = () => {
    return Lunar.fromDate(new Date()).toString() + "日" + Lunar.fromDate(new Date()).getTimeZhi() + "时";
  };

  const getTypeNum = (index: number) => {
    return index === 0 ? state.lunarMonth : (index === 1 ? state.lunarDay : state.lunarHour);
  };

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
    state.cause = hexagramArray[positionIndex];

    //日
    state.lunarDay = lunarDay;
    palacePosition += (lunarDay - 1) % 6;
    positionIndex = ((palacePosition % 6) || 6) - 1;
    state.elapse = hexagramArray[positionIndex];

    //时
    state.lunarHour = lunarHour;
    palacePosition += (lunarHour - 1) % 6;
    positionIndex = ((palacePosition % 6) || 6) - 1;
    state.outcome = hexagramArray[positionIndex];
  };
</script>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: start;
  justify-content: start;
  border: 1px #000000 solid;
  padding: 10px;
}

.result > :not(:last-child) div {
  margin-bottom: 10px;
}

.result > div > span {
  color: blueviolet;
}

.type {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.main {
  display: flex;
  flex-direction: row;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  animation: opacity-translate 1s;
}

.result:first-child {
  opacity: 0;
  animation: opacity-translate 1s 1s forwards;
}
.result:nth-child(2) {
  opacity: 0;
  animation: opacity-translate 1s 2s forwards;
}
.result:last-child {
  opacity: 0;
  animation: opacity-translate 1s 3s forwards;
}

@keyframes opacity-translate {
  0% {
    transform: translateY(-100px);
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
}
</style>