<template>
    <div v-if="state.refresh">
        <div class="resultDiv" style="justify-content: space-between">
            <div>{{ getLunarDate() }}</div>
            <div>{{ getSolarDate() }}</div>
        </div>

        <div class="resultDiv">
            <div ref="ref1" class="result">
                <div v-for="(item, index) in state.lunarMonthArr" class="resultItem">{{ index + 1 }} {{ item?.type }}</div>
            </div>
            <div ref="ref2" class="result">
                <div v-for="(item, index) in state.lunarDayArr" class="resultItem">{{ index + 1 + state.lunarMonthArr.length }} {{ item?.type }}</div>
            </div>
            <div ref="ref3" class="result">
                <div v-for="(item, index) in state.lunarHourArr" class="resultItem">
                    {{ index + 1 + state.lunarMonthArr.length + state.lunarDayArr.length }} {{ item?.type }}
                </div>
            </div>
        </div>
        <div v-if="state.fortuneMsg !== ''">{{ state.fortuneMsg }}</div>
        <div>{{ state.nextUpdateTime }}</div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import { Solar } from "lunar-typescript";
import { fortuneArray, Hexagram, hexagramArray } from "../config.ts";

const ref1 = ref<HTMLDivElement | null>(null);
const ref2 = ref<HTMLDivElement | null>(null);
const ref3 = ref<HTMLDivElement | null>(null);

const state = reactive<{
    lunarMonthArr: Hexagram[];
    lunarDayArr: Hexagram[];
    lunarHourArr: Hexagram[];
    fortuneMsg: string;
    refresh: boolean;
    nextUpdateTime: string;
    nextLunaTime: number;
}>({
    lunarMonthArr: [],
    lunarDayArr: [],
    lunarHourArr: [],
    fortuneMsg: "",
    refresh: true,
    nextUpdateTime: "",
    nextLunaTime: 0,
});

onMounted(() => {
    getDivination();
    getRefreshTime();
    updateRemaining();
    setInterval(() => {
        updateRemaining();
    }, 1000);
});

const getRefreshTime = () => {
    const now = new Date();
    state.nextLunaTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + (now.getHours() % 2 === 0 ? 1 : 2),
        0,
        0,
        0
    ).getTime();
};

/**
 * 更新 剩余时间
 */
const updateRemaining = () => {
    const millisecond = state.nextLunaTime - new Date().getTime();
    const second = Math.floor(millisecond / 1000);
    state.nextUpdateTime = "剩余" + (Math.floor(second / 60) + 1) + "分钟";
    if (second <= 0) {
        refreshMain();
    }
    return millisecond;
};

const refreshMain = () => {
    state.refresh = false;
    nextTick(() => {
        getDivination();
        getRefreshTime();
        state.refresh = true;
    });
};

/**
 * 获取农历日期
 */
const getLunarDate = () => {
    let lunar = Solar.fromDate(new Date()).getLunar();
    return `${lunar}${lunar.getTimeZhi()}时`;
};

/**
 * 获取阳历日期
 */
const getSolarDate = () => {
    const solar = Solar.fromDate(new Date());
    return `${solar.toString()}日${solar.getHour()}点`;
};

type ElementAndNull = HTMLElement | null;
type DivElementAndNull = HTMLDivElement | null;
const startScrollAnimation = <T extends ElementAndNull>(refNode: T) => {
    const nodeArr: ElementAndNull[] = []

    const getNextNode = () => {
        let nextNode: ElementAndNull = null;

        if (nodeArr.length > 0) {
            nextNode = nodeArr.shift() ?? null;
        }

        return nextNode;
    };

    const scrollAnimation = <T extends ElementAndNull>(refNode: T) => {
        if (refNode) {
            const scrollOptions: ScrollToOptions = {
                left: 0,
                top: refNode.scrollHeight,
                behavior: "smooth",
            };

            if (refNode.children.length <= 1) {
                Promise.resolve().then(() => {
                    scrollAnimation(getNextNode());
                });
            } else {
                const scrollHandler = () => {
                    refNode.removeEventListener("scrollend", scrollHandler);
                    refNode.style.overflow = "hidden";
                    
                    const nextNode = getNextNode();
                    if (nextNode) {
                        scrollAnimation(nextNode);
                    }
                }

                refNode.addEventListener("scrollend", scrollHandler);
                refNode.scrollTo(scrollOptions);
            }
        }

        return {
            next: function<T extends ElementAndNull>(refNode: T) {
                nodeArr.push(refNode);
                return this;
            },
        };
    };

    return scrollAnimation(refNode);
};

/**
 * 计算小六壬结果
 */
const getDivination = () => {
    const currentSolar = Solar.fromDate(new Date());
    const currentLunar = currentSolar.getLunar();

    const lunarMonthIndex = currentLunar.getMonth();
    const lunarDayIndex = currentLunar.getDay();
    const lunarHourIndex = currentLunar.getTime().getZhiIndex() + 1;

    let lunarMonthArr = [];
    for (let i = 0; i < lunarMonthIndex; i++) {
        let index = i % hexagramArray.length;
        lunarMonthArr[i] = hexagramArray[index];
    }
    state.lunarMonthArr = lunarMonthArr;

    let startDayIndex = lunarMonthArr.length > 0 ? hexagramArray.indexOf(lunarMonthArr[lunarMonthArr.length - 1]) : 0;
    let lunarDayArr = [];
    for (let i = 0; i < lunarDayIndex; i++) {
        let index = (startDayIndex + i) % hexagramArray.length;
        lunarDayArr[i] = hexagramArray[index];
    }
    state.lunarDayArr = lunarDayArr;

    let startHourIndex = state.lunarDayArr.length > 0 ? hexagramArray.indexOf(lunarDayArr[lunarDayArr.length - 1]) : 0;
    let lunarHourArr = [];
    for (let i = 0; i < lunarHourIndex; i++) {
        let index = (startHourIndex + i) % hexagramArray.length;
        lunarHourArr[i] = hexagramArray[index];
    }
    state.lunarHourArr = lunarHourArr;

    //日时解析
    state.fortuneMsg =
        fortuneArray[hexagramArray.findIndex((item) => item.type === lunarDayArr[lunarDayArr.length - 1].type)][
            hexagramArray.findIndex((item) => item.type === lunarHourArr[lunarHourArr.length - 1].type)
        ].msg;

    nextTick(() => {
        startScrollAnimation<DivElementAndNull>(ref1.value).next<DivElementAndNull>(ref2.value).next<DivElementAndNull>(ref3.value);
    });
};
</script>

<style scoped>
.resultDiv {
    display: flex;
}

.result {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 5px;
    height: 2.5rem;
    padding: 0 10px;
    border-radius: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    overflow: scroll;
}

.resultItem {
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.result::-webkit-scrollbar {
    display: none;
}
</style>
