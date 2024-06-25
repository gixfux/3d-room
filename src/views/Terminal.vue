<template>
  <div id="terminal">
    <!-- {{ props.windowName }} -->

    <div class="header">
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <g id="System / Terminal">
          <path id="Vector" d="M17 15H12M7 10L10 12.5L7 15M3 15.8002V8.2002C3 7.08009 3 6.51962 3.21799 6.0918C3.40973 5.71547 3.71547 5.40973 4.0918 5.21799C4.51962 5 5.08009 5 6.2002 5H17.8002C18.9203 5 19.4796 5 19.9074 5.21799C20.2837 5.40973 20.5905 5.71547 20.7822 6.0918C21 6.5192 21 7.07899 21 8.19691V15.8031C21 16.921 21 17.48 20.7822 17.9074C20.5905 18.2837 20.2837 18.5905 19.9074 18.7822C19.48 19 18.921 19 17.8031 19H6.19691C5.07899 19 4.5192 19 4.0918 18.7822C3.71547 18.5905 3.40973 18.2837 3.21799 17.9074C3 17.4796 3 16.9203 3 15.8002Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
      <div class="title">终端</div>
    </div>
    <div class="content">
      <div id="history-info"></div>
      <div id="current-info"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps(['windowName'])

const context: TerminalBoxContext = {}
class Terminal {
  constructor(public context: TerminalBoxContext) {
    this.context = context
  }

  startCmd() {
    const p = document.createElement('p')
    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    span1.innerText = '[lxb ~]'
    this.context.currentInfoBox?.appendChild(p)
    p.classList.add('cmd-input-line')
    span1.classList.add('cmd-input-start')
    p.appendChild(span1)
    span2.contentEditable = 'true'
    span2.classList.add('cmd-input-span')
    span2.innerText = ''
    p.appendChild(span2)

    this.context.currentInfoBox?.appendChild(p)
    setTimeout(() => {
      span2.focus()
    }, 0)

    function cmdInputLineClick() {
      span2.focus()
    }

    const cmdInputEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        this.context.historyInfoBox?.appendChild(p)
        ;(e.target as HTMLSpanElement).contentEditable = 'false'
        this.context.currentInfoBox!.removeEventListener('click', cmdInputLineClick)
        span2.removeEventListener('keydown', cmdInputEvent)

        this.commendEnter((e.target as HTMLSpanElement).innerText)
      }
    }

    this.context.currentInfoBox?.addEventListener('click', cmdInputLineClick)

    span2.addEventListener('keydown', cmdInputEvent)
  }

  commendEnter(str: string) {
    const newStr = str.trim()
    if (newStr === 'help') {
      this.addLines('  app  -  应用列表以及对应操作 \n  time  - 输出当前时间 \n  help  - 显示所有可执行的命令 \n  clear - 清屏 \n  exit  - 退出终端')
    } else if (newStr === 'npm run start') {
      this.addLines('npm run start : 成功')
    } else if (newStr === 'clear') {
      this.clear()
    } else {
      this.wrongCommend(newStr)
      this.startCmd()
    }
  }

  addLines(str: string) {
    const p = document.createElement('p')
    p.classList.add('response-p')
    let index = 0
    const strLength = str.length
    const timer = setInterval(() => {
      p.innerText += str[index]
      index++
      context.currentInfoBox!.scrollIntoView()
      if (index >= strLength) {
        clearInterval(timer)
        this.startCmd()
      }
    }, 10)
    this.context.historyInfoBox?.appendChild(p)
  }

  wrongCommend(str: string) {
    const p = document.createElement('p')
    p.classList.add('response-wrong-p')
    p.innerText = `命令${str}未找到, 请输入help查看更多`
    this.context.historyInfoBox?.appendChild(p)
  }

  clear() {
    this.context.historyInfoBox!.replaceChildren()
    this.startCmd()
  }
}

const terminal = new Terminal(context)
onMounted(() => {
  const historyInfoBox = document.getElementById('history-info') as HTMLDivElement
  const currentInfoBox = document.getElementById('current-info') as HTMLDivElement
  const terminalDiv = document.getElementById('terminal') as HTMLDivElement
  context.terminal = terminalDiv
  context.currentInfoBox = currentInfoBox
  context.historyInfoBox = historyInfoBox
  terminal.startCmd()
})
</script>

<style lang="scss" scoped>
#terminal {
  color: white;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(32, 31, 31, 0.862);
  // background-color: rgba(255, 0, 0, 0.862);
  border-radius: 8px;
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

  .content {
    height: calc(100% - 30px);
    overflow: scroll;
    scrollbar-width: none;

    #current-info {
      height: 100px;
    }
  }
}
</style>