<template>
  <div>
    <Loading v-if="isLoading"/>
    <PureDivination v-show="!isLoading" @stopLoading="stopLoading"/>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import PureDivination from "./components/PureDivination.vue";
import Loading from "./components/Loading.vue";

const isLoading = ref(true)
const stopLoading = () => {
  isLoading.value = false
}
</script>

<style>
</style>