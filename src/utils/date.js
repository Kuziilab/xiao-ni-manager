// 日期工具函数

export function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDateTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDateCN(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function today() {
  return formatDate(Date.now())
}

export function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function todayEnd() {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

export function weekStart() {
  const d = new Date()
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function monthStart() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function yearStart() {
  const d = new Date()
  d.setMonth(0, 1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function daysBetween(a, b) {
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24))
}

export function countdownDays(endDate) {
  if (!endDate) return null
  const end = new Date(endDate).getTime()
  const now = Date.now()
  return Math.max(0, daysBetween(now, end))
}

export function getMonthDays(year, month) {
  // month: 0-indexed
  const d = new Date(year, month + 1, 0)
  return d.getDate()
}

export function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1)
  return d.getDay() // 0=Sunday
}

export function buildCalendarMonth(year, month) {
  // Returns 6 rows × 7 cols for calendar grid
  const daysInMonth = getMonthDays(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const prevMonthDays = getMonthDays(year, month - 1)

  const cells = []
  // Previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      date: `${year}-${pad(month)}-${pad(prevMonthDays - i)}`,
      isCurrentMonth: false
    })
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      date: `${year}-${pad(month + 1)}-${pad(i)}`,
      isCurrentMonth: true,
      isToday: formatDate(Date.now()) === `${year}-${pad(month + 1)}-${pad(i)}`
    })
  }
  // Next month
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      day: i,
      date: `${year}-${pad(month + 2 > 12 ? 1 : month + 2)}-${pad(i)}`,
      isCurrentMonth: false
    })
  }
  return cells
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export { pad }
