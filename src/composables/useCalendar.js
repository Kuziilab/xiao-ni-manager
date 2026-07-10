// 日历 composable
import { ref, computed } from 'vue'
import { buildCalendarMonth, today, formatDate } from '../utils/date.js'

export function useCalendar() {
  const currentDate = ref(new Date())
  const selectedDate = ref(today())

  const year = computed(() => currentDate.value.getFullYear())
  const month = computed(() => currentDate.value.getMonth())

  const cells = computed(() => {
    return buildCalendarMonth(year.value, month.value)
  })

  const monthLabel = computed(() => {
    return `${year.value}年${month.value + 1}月`
  })

  function prevMonth() {
    const d = new Date(currentDate.value)
    d.setMonth(d.getMonth() - 1)
    currentDate.value = d
  }

  function nextMonth() {
    const d = new Date(currentDate.value)
    d.setMonth(d.getMonth() + 1)
    currentDate.value = d
  }

  function goToToday() {
    currentDate.value = new Date()
    selectedDate.value = today()
  }

  function selectDate(dateStr) {
    selectedDate.value = dateStr
  }

  return {
    year,
    month,
    cells,
    monthLabel,
    selectedDate,
    prevMonth,
    nextMonth,
    goToToday,
    selectDate
  }
}
