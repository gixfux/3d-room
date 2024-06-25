<template>
  <div id="menu">
    <div class="icon-menu" @click="menuIsShow = !menuIsShow">
      <svg fill="white" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>microsoft</title>
        <path d="M16.742 16.742v14.253h14.253v-14.253zM1.004 16.742v14.253h14.256v-14.253zM16.742 1.004v14.256h14.253v-14.256zM1.004 1.004v14.256h14.256v-14.256z"></path>
      </svg>
    </div>
    <div class="mask" v-show="menuIsShow" @click="menuIsShow = !menuIsShow"></div>
    <Transition>
      <div class="menu-main" v-show="menuIsShow">
        <div class="item browser" @click="addApp('Browser')">
          <svg width="100px" height="100px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="96" cy="96" r="74" stroke="#2980b9" stroke-width="10" />
            <ellipse cx="96" cy="96" stroke="#2980b9" stroke-width="10" rx="30" ry="74" />
            <path stroke="#2980b9" stroke-linecap="round" stroke-linejoin="round" stroke-width="10" d="M28 72h136M28 120h136" />
          </svg>
        </div>

        <div class="item terminal" @click="addApp('Terminal')">
          <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="System / Terminal">
              <path id="Vector" d="M17 15H12M7 10L10 12.5L7 15M3 15.8002V8.2002C3 7.08009 3 6.51962 3.21799 6.0918C3.40973 5.71547 3.71547 5.40973 4.0918 5.21799C4.51962 5 5.08009 5 6.2002 5H17.8002C18.9203 5 19.4796 5 19.9074 5.21799C20.2837 5.40973 20.5905 5.71547 20.7822 6.0918C21 6.5192 21 7.07899 21 8.19691V15.8031C21 16.921 21 17.48 20.7822 17.9074C20.5905 18.2837 20.2837 18.5905 19.9074 18.7822C19.48 19 18.921 19 17.8031 19H6.19691C5.07899 19 4.5192 19 4.0918 18.7822C3.71547 18.5905 3.40973 18.2837 3.21799 17.9074C3 17.4796 3 16.9203 3 15.8002Z" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </svg>
        </div>

        <div class="item blob" @click="addApp('Blob')">
          <svg fill="none" width="100px" height="100px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" stroke="pink" stroke-width="1.5" />
          </svg>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAppsStore } from '../stores/appsStore'
import { ref } from 'vue'

const initAppValue = {
  Terminal: {
    top: 100,
    left: 400,
    bottom: 50,
    right: 20
  },
  Browser: {
    top: 50,
    left: 200,
    bottom: 100,
    right: 100
  },
  Blob: {
    top: 30,
    left: 100,
    bottom: 200,
    right: 400
  }
}

const appsStore = useAppsStore()

let menuIsShow = ref(false)

function addApp(app: string) {
  const addAppContext = appsStore[app.toLowerCase() + 'Context']
  if (!addAppContext.isActive) {
    appsStore.currentApps.push(app)
    addAppContext.top = initAppValue[app].top
    addAppContext.bottom = initAppValue[app].bottom
    addAppContext.left = initAppValue[app].left
    addAppContext.right = initAppValue[app].right
    addAppContext.isActive = true
    appsStore.showAppsNum++
  } else {
    addAppContext.isShow = true
    appsStore.showAppsNum++
  }
  appsStore.toggleWindowIndexToTop(app.toLowerCase() + 'Context')
  menuIsShow.value = !menuIsShow.value
}
</script>

<style scoped>
#menu {
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    z-index: 998;
  }
  .icon-menu {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #ffffff46;
    }
  }

  .menu-main {
    position: absolute;
    box-sizing: border-box;
    width: 360px;
    height: 360px;
    background: #6c6c6c84;
    backdrop-filter: blur(4px);
    bottom: 50px;
    margin-bottom: 5px;
    border-radius: 5%;
    padding: 10px;
    z-index: 999;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);

    .item {
      background-color: #353434d5;
      margin: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10%;
      transition: all 0.3s;

      &:hover {
        background-color: #35343463;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>