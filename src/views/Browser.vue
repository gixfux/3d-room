<template>
  <div id="browser">
    <!-- {{ props.windowName }} -->
    <div class="header">
      <svg width="30px" height="30px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="white">
        <circle cx="96" cy="96" r="74" stroke="#000000" stroke-width="12" />
        <ellipse cx="96" cy="96" stroke="#000000" stroke-width="12" rx="30" ry="74" />
        <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M28 72h136M28 120h136" />
      </svg>
      <div class="title">浏览器</div>
    </div>

    <iframe src="https://www.bing.com/?&mkt=zh-CN&mkt=zh-CN"></iframe>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['windowName'])
</script>

<style lang="scss" scoped>
#browser {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;

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

  iframe {
    width: 100%;
    height: calc(100% - 30px);
  }
}
</style>