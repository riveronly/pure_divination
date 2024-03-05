<template>
    <div class="background" :style="`background-image: url('${background}')`">
        <div class="container">
            <MainPage />
        </div>
    </div>
</template>

<script lang="ts" setup>
import MainPage from './components/MainPage.vue'
import { ref } from 'vue'
import { isProd } from './utils/config';

const background = ref('')

/**
 * 获取每日壁纸
 */
 const fetchBackground = async () => {
    const BING_ORIGIN = 'https://cn.bing.com'
    const baseURL = isProd ? BING_ORIGIN : '/api'
    const bg = await fetch(`${baseURL}/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN`)
    const json = await bg.json()
    background.value = BING_ORIGIN + json.images[0].url
    console.log(background.value, json)
}

fetchBackground()

</script>

<style scoped>
.background {
    min-width: 320px;
    min-height: 100vh;

    background-position: center;
    background-size: cover;

    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}
</style>