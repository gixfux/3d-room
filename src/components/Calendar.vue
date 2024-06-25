<template>
  <div class="time">
    <div class="clock" @click="toggleCalendarPanel">
      <div class="hourToMinute">{{ hourNow }}:{{ minuteNow }}</div>
      <div class="yearToDay">{{ yearNow }}/{{ mouthNow + 1}}/{{ dayNow }}</div>
    </div>
    <div class="mask" v-show="panelIsShow" @click="toggleCalendarPanel"></div>
    <Transition>
      <div id="calendar" v-show="panelIsShow">

        <div class="calendar-operate-box">
          <div class="calendar-title">
            {{ showYear }}年{{ showMouth + 1 }}月
          </div>
          <div class="calendar-operate">
            <div class="toggle-current-mouth" @click="toggleToCurrent">
              今
            </div>
            <div class="prev-btn" @click="showMouth--">
              <svg width="12px" height="12px" viewBox="0 -0.5 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-triangle-up">
                <title>1236</title>
                <defs>
                </defs>
                <g stroke="none" stroke-width="1" fill="none">
                  <path d="M7.96,2.392 C8.541,1.812 9.482,1.812 10.064,2.392 L16.506,8.836 C17.088,9.417 17.345,10.939 15.506,10.939 L2.518,10.939 C0.616,10.939 0.936,9.418 1.517,8.836 L7.96,2.392 L7.96,2.392 Z" fill="#3c3c3cc9" class="si-glyph-fill">
                  </path>
                </g>
              </svg>
            </div>
            <div class="next-btn" @click="showMouth++">
              <svg width="12px" height="12px" viewBox="0 -0.5 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-triangle-down">
                <title>1237</title>
                <defs>
                </defs>
                <g stroke="none" stroke-width="1" fill="none">
                  <path d="M10.106,12.69 C9.525,13.27 8.584,13.27 8.002,12.69 L1.561,6.246 C0.979,5.665 0.722,4.143 2.561,4.143 L15.549,4.143 C17.45,4.143 17.131,5.664 16.549,6.246 L10.106,12.69 L10.106,12.69 Z" fill="#3c3c3cc9" class="si-glyph-fill">

                  </path>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div class="calendar-header">
          <span class="calendar-header-item">日</span>
          <span class="calendar-header-item">一</span>
          <span class="calendar-header-item">二</span>
          <span class="calendar-header-item">三</span>
          <span class="calendar-header-item">四</span>
          <span class="calendar-header-item">五</span>
          <span class="calendar-header-item">六</span>
        </div>

        <div class="calender-main">
          <div class="calender-main-day" v-for="(date, index) of daysofCurrentMouth" :key="index" :class="{'prev-day': index < daysInLastMouth, 'last-day': index > indexOfDaysInNextMouth - 1, 'current-day': date === dayNow && index < indexOfDaysInNextMouth && showMouth === mouthNow&& showYear === yearNow}">{{ date }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

let panelIsShow = ref(false)

const dayofMouth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const dataNow = new Date()
let yearNow = ref(dataNow.getFullYear())
let mouthNow = ref(dataNow.getMonth())
let dayNow = ref(dataNow.getDate())
let hourNow = ref(dataNow.getHours())
let minuteNow = ref(`${dataNow.getMinutes()}`)
let secondNow = ref(dataNow.getSeconds())

// 当前显示的月份
let showMouth = ref(mouthNow.value)
let showYear = ref(yearNow.value)

let weekNow = ref(dataNow.getDay())

let daysInLastMouth = 0 // 上个月日期的天数

let indexOfDaysInNextMouth = 0 // 下个月日期开始的下标

let daysofCurrentMouth = getMouthInCalender(showYear.value, showMouth.value)

watch(showMouth, (newVal, oldVal) => {
  if (newVal === 12) {
    showMouth.value = 0
    showYear.value++
  } else if (newVal === -1) {
    showMouth.value = 11
    showYear.value--
  }

  daysofCurrentMouth = getMouthInCalender(showYear.value, showMouth.value)
})

function toggleCalendarPanel() {
  panelIsShow.value = !panelIsShow.value
}

function toggleToCurrent() {
  showYear.value = yearNow.value
  showMouth.value = mouthNow.value
}

function getMouthInCalender(yearNow: number, mouthNow: number) {
  if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
    dayofMouth[1] = 29
  } else {
    dayofMouth[1] = 28
  }
  const firstDayofMouth = getWeekofFirstDay(yearNow, mouthNow) // 这个月一号的星期数

  const lastMouthIndex = mouthNow === 0 ? 11 : mouthNow - 1

  const indeedDay = new Array(42)
  // 获取每月开始的日期（从上个月的星期日开始）
  let dayofMouthStart = 0
  if (mouthNow === 0) {
    dayofMouthStart = dayofMouth[11] - (firstDayofMouth === 0 ? 6 : firstDayofMouth - 1)
  } else {
    dayofMouthStart = dayofMouth[lastMouthIndex] - (firstDayofMouth === 0 ? 6 : firstDayofMouth - 1)
  }
  // 填充上个月的日期
  for (let i = dayofMouthStart; i <= dayofMouth[lastMouthIndex]; i++) {
    indeedDay[i - dayofMouthStart] = i
  }

  daysInLastMouth = dayofMouth[lastMouthIndex] - dayofMouthStart + 1

  // 填充当前月的日期
  for (let i = 0; i < dayofMouth[mouthNow]; i++) {
    indeedDay[daysInLastMouth + i] = i + 1
  }
  // 填充下个月的日期
  indexOfDaysInNextMouth = dayofMouth[mouthNow] + daysInLastMouth
  for (let i = 0; i < 42 - indexOfDaysInNextMouth; i++) {
    indeedDay[indexOfDaysInNextMouth + i] = i + 1
  }
  return indeedDay
}

function getWeekofFirstDay(yearNow: number, mouthNow: number) {
  var tmpDate = new Date(yearNow, mouthNow, 1)
  return tmpDate.getDay()
}

function getNowDate() {
  const dataNow = new Date()
  return {
    yearNow: dataNow.getFullYear(),
    mouthNow: dataNow.getMonth(),
    dayNow: dataNow.getDate(),
    hourNow: dataNow.getHours(),
    minuteNow: dataNow.getMinutes() < 10 ? '0' + dataNow.getMinutes() : `${dataNow.getMinutes()}`,
    secondNow: dataNow.getSeconds()
  }
}

setInterval(() => {
  const newDate = getNowDate()
  yearNow.value = newDate.yearNow
  mouthNow.value = newDate.mouthNow
  dayNow.value = newDate.dayNow
  hourNow.value = newDate.hourNow
  minuteNow.value = newDate.minuteNow
  secondNow.value = newDate.secondNow
}, 1000)
</script>

<style lang="scss" scoped>
.time {
  user-select: none;
  position: absolute;
  right: 20px;
  color: white;
  width: auto;
  display: flex;
  flex-direction: column;

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    z-index: 998;
  }

  .clock {
    cursor: default;
    padding: 0 10px;
    border-radius: 5px;
    &:hover {
      background-color: rgba(179, 178, 178, 0.801);
    }
  }

  #calendar {
    cursor: default;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: 50px;
    width: 300px;
    height: 300px;
    background: #fefefec9;
    backdrop-filter: blur(8px);
    // background: #3c3c3cc9;
    border-radius: 0.5rem;
    z-index: 999;
    padding: 10px;
    color: black;
    .calendar-operate-box {
      display: flex;
      font-weight: 800;
      font-size: large;

      .calendar-operate {
        display: flex;
        position: absolute;
        margin-right: 20px;
        right: 0;
        width: 96px;
        height: 24px;

        .toggle-current-mouth {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          width: 24px;
          height: 24px;
          font-weight: 400;
          margin-right: 12px;

          &:hover {
            background-color: #ffffffb8;
          }
        }

        .prev-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          width: 24px;
          height: 24px;
          margin-right: 12px;
          padding-top: 2px;

          &:hover {
            background-color: rgba(128, 128, 128, 0.342);
          }
        }
        .next-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          width: 24px;
          height: 24px;

          &:hover {
            background-color: rgba(128, 128, 128, 0.342);
          }
        }
      }
    }

    .calendar-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);

      .calendar-header-item {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .calender-main {
      display: grid;
      height: calc(100% - 64px);
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(6, 1fr);

      .calender-main-day {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        &:hover {
          background-color: rgba(128, 128, 128, 0.127);
        }
      }

      .current-day {
        background-color: rgba(25, 69, 180, 0.999);
        color: white;

        &:hover {
          background-color: rgba(25, 69, 180, 0.767);
        }
      }

      .prev-day {
        color: rgba(0, 0, 0, 0.348);
      }
      .last-day {
        color: rgba(0, 0, 0, 0.348);
      }
      // gap: 5px;
    }
  }

  .hourToMinute {
    display: flex;
    flex-direction: row-reverse;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>