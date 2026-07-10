<template>
  <div style="padding: 0 16px">
    <!-- Month navigation -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0">
      <button class="btn btn--ghost" style="padding: 4px 8px" @click="prevMonth">
        <IconArrowLeft :size="18" />
      </button>
      <span style="font-size: 16px; font-weight: 600">{{ monthLabel }}</span>
      <button class="btn btn--ghost" style="padding: 4px 8px" @click="nextMonth">
        <IconArrowRight :size="18" />
      </button>
    </div>

    <!-- Day headers -->
    <div class="calendar-grid">
      <div v-for="d in ['日','一','二','三','四','五','六']" :key="d" class="calendar-grid__header">
        {{ d }}
      </div>
    </div>

    <!-- Day cells -->
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
        @click="select(cell.date)"
      >
        {{ cell.day }}
      </div>
    </div>

    <div style="text-align:center;padding:8px 0">
      <button class="btn btn--text" style="font-size:13px" @click="goToToday">回到今天</button>
    </div>
  </div>
</template>

<script setup>
import { IconArrowLeft, IconArrowRight } from '../../icons/index.js'
import { useCalendar } from '../../composables/useCalendar.js'

const {
  cells, monthLabel, selectedDate,
  prevMonth, nextMonth, goToToday, selectDate
} = useCalendar()

const emit = defineEmits(['select-date'])

function select(date) {
  selectDate(date)
  emit('select-date', date)
}
</script>
