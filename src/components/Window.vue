<template>
  <Transition>
    <div class="window-app" :id="'window' + props.windowName" v-bind:style="{width: windowSize.width - windowContext.right - windowContext.left + 'px', height: windowSize.height - windowContext.bottom - windowContext.top + 'px', top: windowContext.top + 'px', left: windowContext.left + 'px', minHeight: windowContext.minHeight + 'px', minWidth: windowContext.minWidth + 'px', zIndex: windowContext.zIndex}" @mousedown="toggleWindowIndexToTop" v-show="windowContext.isShow" v-if="windowContext.isActive">
      <div class="header" @mousedown="beforeWindowMove"></div>
      <slot :windowName="props.windowName"></slot>

      <div class="window-resize window-resize-top" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-bottom" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-left" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-right" @mousedown="beforeResize"></div>

      <div class="window-resize window-resize-topleft" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-topright" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-bottomleft" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-bottomright" @mousedown="beforeResize"></div>

      <div class="window-control">
        <span class="btn btn-max" @click="enlargeWindow"></span>
        <span class="btn btn-min" @click="miniWindow"></span>
        <span class="btn btn-close" @click="closeWindow"></span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue'
import { useAppsStore } from '../stores/appsStore'
const props = defineProps({
  windowName: String
})

const appsStore = useAppsStore()
const windowSize = {
  width: 1920,
  height: 1080
}

const windowContext = appsStore[props.windowName?.toLowerCase() + 'Context']

const windowSizeBeforeMax = {
  top: windowContext.top,
  left: windowContext.left,
  right: windowContext.right,
  bottom: windowContext.bottom
}

function enlargeWindow(e: MouseEvent) {
  if (windowContext.top !== 0 || windowContext.left !== 0 || windowContext.right !== 0 || windowContext.bottom !== 50) {
    windowSizeBeforeMax.top = windowContext.top
    windowSizeBeforeMax.left = windowContext.left
    windowSizeBeforeMax.right = windowContext.right
    windowSizeBeforeMax.bottom = windowContext.bottom

    windowContext.top = 0
    windowContext.left = 0
    windowContext.right = 0
    windowContext.bottom = 50
  } else {
    windowContext.top = windowSizeBeforeMax.top
    windowContext.left = windowSizeBeforeMax.left
    windowContext.right = windowSizeBeforeMax.right
    windowContext.bottom = windowSizeBeforeMax.bottom
  }
}

function miniWindow(e: MouseEvent) {
  appsStore.showAppsNum--
  windowContext.isShow = !windowContext.isShow
}

function closeWindow(e: MouseEvent) {
  appsStore.showAppsNum--
  const index = appsStore.currentApps.findIndex(val => val === props.windowName)
  // console.log(windowContext.zIndex)
  // windowContext.isActive = false
  for (const windowName of appsStore.currentApps) {
    if (appsStore[windowName.toLowerCase() + 'Context'].zIndex > windowContext.zIndex) {
      appsStore[windowName.toLowerCase() + 'Context'].zIndex--
    }
  }
  appsStore.currentApps.splice(index, 1)
  windowContext.isActive = false
}

function toggleWindowIndexToTop(e: MouseEvent) {
  if (/btn-close/.test((e.target as HTMLDivElement).classList.value) || /btn-min/.test((e.target as HTMLDivElement).classList.value)) {
    return
  }
  appsStore.toggleWindowIndexToTop(props.windowName!.toLowerCase() + 'Context')
}

function beforeWindowMove(e: MouseEvent) {
  // document.body.style.userSelect = 'none'
  const onClickMousePos = {
    x: e.offsetX + (windowContext.windowBox as HTMLDivElement).offsetLeft,
    y: e.offsetY + (windowContext.windowBox as HTMLDivElement).offsetTop
  }

  // const mousePos

  const initRange = {
    top: windowContext.top,
    left: windowContext.left,
    bottom: windowContext.bottom,
    right: windowContext.right
  }

  const currentMousePos = {
    x: onClickMousePos.x,
    y: onClickMousePos.y
  }

  function windowMoving(e: MouseEvent) {
    // console.log(e.target)

    console.log(e.movementX, e.movementY)
    currentMousePos.x = e.offsetX + (windowContext.windowBox as HTMLDivElement).offsetLeft
    currentMousePos.y = e.offsetY + (windowContext.windowBox as HTMLDivElement).offsetTop

    const offsetPos = { offsetX: currentMousePos.x - onClickMousePos.x, offsetY: currentMousePos.y - onClickMousePos.y }

    const newTop = initRange.top + offsetPos.offsetY
    const newLeft = initRange.left + offsetPos.offsetX
    const newRight = initRange.right - offsetPos.offsetX
    const newBottom = initRange.bottom - offsetPos.offsetY

    if (newBottom > 50) {
      windowContext.top = Math.max(0, newTop)
    }
    if (newRight > 0) {
      windowContext.left = Math.max(0, newLeft)
    }
    if (newTop > 0) {
      windowContext.bottom = Math.max(50, newBottom)
    }
    if (newLeft > 0) {
      windowContext.right = Math.max(0, newRight)
    }
  }

  function windowMoved() {
    appsStore.windowAll.style.userSelect = 'auto'
    appsStore.css3DRenderer.removeEventListener('mousemove', windowMoving)
    appsStore.windowAll.removeEventListener('mouseup', windowMoved)
  }

  document.addEventListener('mousemove', windowMoving)
  appsStore.windowAll.addEventListener('mouseup', windowMoved)
}

function beforeResize(e: MouseEvent) {
  appsStore.windowAll.body.style.userSelect = 'none'
  const onClickMousePos = {
    x: e.clientX,
    y: e.clientY
  }
  const mainClass = (e.target as HTMLDivElement).classList.value

  const initRange = {
    top: windowContext.top,
    left: windowContext.left,
    bottom: windowContext.bottom,
    right: windowContext.right,
    maxTop: windowSize.height - windowContext.minHeight - windowContext.bottom,
    maxLeft: windowSize.width - windowContext.minWidth - windowContext.right
  }

  function mouseMoving(e: MouseEvent) {
    const currentMousePos = {
      x: e.clientX,
      y: e.clientY
    }
    const offsetPos = { offsetX: currentMousePos.x - onClickMousePos.x, offsetY: currentMousePos.y - onClickMousePos.y }

    if (/top/.test(mainClass)) {
      const newTop = initRange.top + offsetPos.offsetY
      windowContext.top = newTop < 0 ? 0 : newTop > initRange.maxTop ? initRange.maxTop : newTop
    }
    if (/left/.test(mainClass)) {
      const newLeft = initRange.left + offsetPos.offsetX
      windowContext.left = newLeft < 0 ? 0 : newLeft > initRange.maxLeft ? initRange.maxLeft : newLeft
    }
    if (/right/.test(mainClass)) {
      const newRight = initRange.right - offsetPos.offsetX
      windowContext.right = newRight < 0 ? 0 : newRight
    }
    if (/bottom/.test(mainClass)) {
      const newBottom = initRange.bottom - offsetPos.offsetY
      windowContext.bottom = newBottom < 50 ? 50 : newBottom
    }
  }

  function mouseMoved() {
    appsStore.windowAll.style.userSelect = 'auto'
    appsStore.windowAll.removeEventListener('mousemove', mouseMoving)
    appsStore.windowAll.removeEventListener('mouseup', mouseMoved)
  }

  appsStore.windowAll.addEventListener('mousemove', mouseMoving)
  appsStore.windowAll.addEventListener('mouseup', mouseMoved)
}

onMounted(() => {
  windowContext.windowBox = appsStore.windowAll.querySelector('#window' + props.windowName)
})

onUpdated(() => {})
</script>

<style lang="scss" scoped>
.window-app {
  position: absolute;

  .header {
    position: absolute;
    top: 3;
    left: 3;
    right: 3;
    width: 100%;
    height: 30px;
    background-color: transparent;
    // position: absolute;
    z-index: 2;
  }

  .window-control {
    height: 30px;
    position: absolute;
    top: 0;
    right: 6px;
    display: flex;
    align-items: center;
    z-index: 4;

    &:hover .btn::before {
      animation: 0.3s btn-border-color forwards;
    }

    &:hover .btn::after {
      animation: 0.3s btn-border-color forwards;
    }

    .btn {
      position: relative;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      border-radius: 50%;
    }

    .btn-max {
      background-color: rgba(19, 238, 19, 0.955);
    }

    .btn-max::before {
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      position: absolute;
      left: 5px;
      top: 5px;
      border: transparent 3.5px solid;
      border-bottom-color: transparent !important;
      border-right-color: transparent !important;
      // animation: 2s btn-border-color forwards;
    }

    .btn-max::after {
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      position: absolute;
      right: 5px;
      bottom: 5px;
      border: transparent 3.5px solid;
      border-top-color: transparent !important;
      border-left-color: transparent !important;
      // animation: 2s btn-border-color forwards;
    }

    .btn-min {
      background: yellow;
      &::before {
        content: '';
        display: block;
        width: 7px;
        height: 0;
        position: absolute;
        left: 5px;
        top: 8.5px;
        border: transparent 1.5px solid;
        // animation: 2s btn-border-color forwards;
      }
    }

    .btn-close {
      background-color: red;

      &::before {
        content: '';
        display: block;
        width: 7px;
        height: 0;
        position: absolute;
        left: 6px;
        top: 8.5px;
        border: transparent 1.5px solid;
        transform: rotate(45deg);
        // animation: 2s btn-border-color forwards;
      }

      &::after {
        content: '';
        display: block;
        width: 7px;
        height: 0;
        position: absolute;
        left: 6px;
        top: 8.5px;
        border: transparent 1.5px solid;
        transform: rotate(-45deg);
        // animation: 2s btn-border-color forwards;
      }
    }
  }

  .window-resize {
    z-index: 3;
  }

  .window-resize-top {
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    width: 100%;
    cursor: n-resize;
  }

  .window-resize-left {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 3px;
    cursor: w-resize;
  }

  .window-resize-right {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 3px;
    cursor: e-resize;
  }

  .window-resize-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    cursor: s-resize;
  }

  .window-resize-topleft {
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    cursor: nw-resize;
  }

  .window-resize-topright {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 6px;
    cursor: ne-resize;
  }

  .window-resize-bottomleft {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 6px;
    height: 6px;
    cursor: sw-resize;
  }

  .window-resize-bottomright {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 6px;
    height: 6px;
    cursor: se-resize;
  }

  @keyframes btn-border-color {
    0% {
      border-color: transparent;
    }
    100% {
      border-color: #424242cc;
    }
  }
}
</style>