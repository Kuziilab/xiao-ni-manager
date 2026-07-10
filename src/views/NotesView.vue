<template>
  <div class="page">
    <!-- 日历（默认收起） -->
    <div class="module-box">
      <div class="module-box__header" style="cursor:pointer" @click="showCalendar = !showCalendar">
        <span class="kawaii-deco">📅</span>
        {{ selectedDate }}
        <span style="margin-left:auto;display:flex;align-items:center;gap:4px;font-size:12px;color:var(--color-pink)">
          <IconCalendar :size="16" />
          {{ showCalendar ? '收起' : '日历' }}
        </span>
      </div>
      <div class="module-box__body--no-padding" v-if="showCalendar">
        <div style="padding: 0 12px 8px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0">
            <button class="btn btn--ghost" style="padding:2px 8px;font-size:12px" @click="prevMonth">◀</button>
            <button class="btn btn--text" style="font-size:12px;color:var(--color-pink)" @click="goToToday">今天</button>
            <button class="btn btn--ghost" style="padding:2px 8px;font-size:12px" @click="nextMonth">▶</button>
          </div>
          <div class="calendar-grid">
            <div v-for="d in weekDays" :key="d" class="calendar-grid__header">{{ d }}</div>
          </div>
          <div class="calendar-grid">
            <div
              v-for="(cell, i) in cells"
              :key="i"
              class="calendar-grid__day"
              :class="{
                'calendar-grid__day--today': cell.isToday,
                'calendar-grid__day--selected': cell.date === selectedDate,
                'calendar-grid__day--other-month': !cell.isCurrentMonth
              }"
              @click="selectDate(cell.date)"
            >
              {{ cell.day }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日小目标方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">⭐</span>
        小目标 · {{ selectedDate }}
      </div>
      <div class="module-box__body--no-padding">
        <DailyGoalSection :date="selectedDate" />
      </div>
    </div>

    <!-- 个人正售方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">🛍️</span>
        个人正售 · {{ selectedDate }}
      </div>
      <div class="module-box__body--no-padding">
        <TodaySellingSection :date="selectedDate" selling-type="personal" />
      </div>
    </div>

    <!-- 商家寄售方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">🏪</span>
        商家寄售 · {{ selectedDate }}
      </div>
      <div class="module-box__body--no-padding">
        <TodaySellingSection :date="selectedDate" selling-type="consignment" />
      </div>
    </div>

    <!-- 长期目标方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">🎯</span>
        长期目标
      </div>
      <div class="module-box__body--no-padding">
        <LongTermGoalSection />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DailyGoalSection from '../components/notes/DailyGoalSection.vue'
import LongTermGoalSection from '../components/notes/LongTermGoalSection.vue'
import TodaySellingSection from '../components/notes/TodaySellingSection.vue'
import { useCalendar } from '../composables/useCalendar.js'
import { IconCalendar } from '../icons/index.js'

const {
  cells, monthLabel, selectedDate,
  prevMonth, nextMonth, goToToday, selectDate
} = useCalendar()

const showCalendar = ref(false)
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
</script>
