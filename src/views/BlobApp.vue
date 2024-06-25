<template>
  <div id="blob">
    <!-- {{ props.windowName }}-->

    <div class="header">
      <svg fill="#ffffff" width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
      </svg>
      <div class="title">博客</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps(['windowName'])
</script>

<style scoped>
#blob {
  background-color: #fff;
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 30px;
    background-color: rgba(32, 31, 31, 0.949);
    display: flex;
    align-items: center;

    svg {
      margin-right: 6px;
    }

    .title {
      display: inline;
      color: white;
      font-weight: 700;
      font-size: large;
    }
  }
}
</style>