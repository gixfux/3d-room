<template>
  <div class="window-all" id="window-all">
    <div class="window-main">
      <Window v-for="windowName in appsStore.currentApps" :window-name="windowName" :key="windowName">
        <template v-slot="slotProps">
          <component :is="componentRef[slotProps.windowName as string]" :window-name="slotProps.windowName"></component>
        </template>
      </Window>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import Window from '../components/Window.vue'
import { useAppsStore } from '../stores/appsStore'
import Browser from '../views/Browser.vue'
import Terminal from '../views/Terminal.vue'
import Blob from '../views/BlobApp.vue'
import Footer from '../components/Footer.vue'
import { onMounted } from 'vue'

const appsStore = useAppsStore()

appsStore.terminalContext = {
  top: 100,
  left: 400,
  bottom: 50,
  right: 20,
  isActive: true,
  isShow: true,
  windowName: 'terminal',
  windowBox: null,
  minHeight: 200,
  minWidth: 250,
  zIndex: 2
}

appsStore.browserContext = {
  top: 50,
  left: 200,
  bottom: 100,
  right: 100,
  isActive: false,
  isShow: true,
  windowName: 'terminal',
  windowBox: null,
  minHeight: 120,
  minWidth: 250,
  zIndex: 1
}

appsStore.blobContext = {
  top: 30,
  left: 100,
  bottom: 200,
  right: 400,
  isActive: false,
  isShow: true,
  windowName: 'blob',
  windowBox: null,
  minHeight: 120,
  minWidth: 250,
  zIndex: 3
}

appsStore.currentApps = ['Terminal']

const componentRef = {
  Terminal,
  Browser,
  Blob
}
</script>

<style lang="scss" scoped>
.window-all {
  width: 1920px;
  height: 1080px;

  .window-main {
    height: calc(100% - 50px);
  }

  .runApps {
    position: absolute;
    z-index: 5;
  }
}
</style>