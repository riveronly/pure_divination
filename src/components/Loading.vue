<template>
  <img :src="icon" class="loading" alt=""/>
</template>

<script lang="ts" setup>
import icon from "../asset/icon.svg"
</script>

<style scoped>
.loading {
  width: 30vw;
  animation: rotate360deg 1s infinite;
}

@keyframes rotate360deg {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
</style>