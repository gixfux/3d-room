<template>
  <div class="footer">

    <div class="runApps">
      <Menu></Menu>
    </div>

    <div class="logoBox" v-show="appsStore.currentApps.length">
      <div class="runningApp" v-for="app in appsStore.currentApps" :key="app" :class="app" v-html="svgContext.logos[app]" @click="toggleWindowToTop(app)"></div>
    </div>

    <Calendar></Calendar>
  </div>
</template>

<script setup lang="ts">
import { useAppsStore } from '../stores/appsStore'
import Calendar from './Calendar.vue'
import Menu from './Menu.vue'

const svgContext: SvgContext = {
  logos: {
    Terminal:
      '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><g id="System / Terminal"><path id="Vector" d="M17 15H12M7 10L10 12.5L7 15M3 15.8002V8.2002C3 7.08009 3 6.51962 3.21799 6.0918C3.40973 5.71547 3.71547 5.40973 4.0918 5.21799C4.51962 5 5.08009 5 6.2002 5H17.8002C18.9203 5 19.4796 5 19.9074 5.21799C20.2837 5.40973 20.5905 5.71547 20.7822 6.0918C21 6.5192 21 7.07899 21 8.19691V15.8031C21 16.921 21 17.48 20.7822 17.9074C20.5905 18.2837 20.2837 18.5905 19.9074 18.7822C19.48 19 18.921 19 17.8031 19H6.19691C5.07899 19 4.5192 19 4.0918 18.7822C3.71547 18.5905 3.40973 18.2837 3.21799 17.9074C3 17.4796 3 16.9203 3 15.8002Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>',
    Browser:
      '<svg width="30px" height="30px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="white"><circle cx="96" cy="96" r="74" stroke="#000000" stroke-width="12" /><ellipse cx="96" cy="96" stroke="#000000" stroke-width="12" rx="30" ry="74" /><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M28 72h136M28 120h136" /></svg>',
    Blob: '<svg fill="white" width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>'
  }
}

const appsStore = useAppsStore()

function toggleWindowToTop(app: string) {
  console.log(app)

  if (appsStore[app.toLowerCase() + 'Context'].isShow) {
    if (appsStore[app.toLowerCase() + 'Context'].zIndex !== appsStore.showAppsNum) {
      appsStore.toggleWindowIndexToTop(app.toLowerCase() + 'Context')
    } else {
      appsStore[app.toLowerCase() + 'Context'].isShow = false
      appsStore.showAppsNum--
    }
  } else {
    appsStore[app.toLowerCase() + 'Context'].isShow = true
    appsStore.showAppsNum++
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 50px;
  width: 100%;
  background-color: #9c9c9ca9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .logoBox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: auto;
    height: 50px;
    padding: 5px;
    border-radius: 0.5rem;
    background-color: #312f2f24;
  }

  .runApps {
    position: absolute;
    left: 20px;
  }
}
</style>