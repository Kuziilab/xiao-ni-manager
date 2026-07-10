<template>
  <div class="page">
    <PeriodStats />

    <!-- 利润柱状图 -->
    <div class="chart-container">
      <div class="chart-container__title">
        <span class="kawaii-deco">📊</span>
        利润趋势
        <span style="margin-left:auto;font-size:12px;color:var(--color-text-hint);font-weight:400">{{ chartLabel }}</span>
      </div>
      <canvas ref="chartCanvas" />
    </div>

    <!-- 售出明细方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">💰</span>
        售出明细
      </div>
      <div class="module-box__body--no-padding">
        <SalesBreakdown />
      </div>
    </div>

    <!-- 自定义收支方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">📝</span>
        其他收支
      </div>
      <div class="module-box__body--no-padding">
        <TransactionForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import PeriodStats from '../components/accounting/PeriodStats.vue'
import SalesBreakdown from '../components/accounting/SalesBreakdown.vue'
import TransactionForm from '../components/accounting/TransactionForm.vue'
import { useAccountingStore } from '../stores/accounting.js'
import { todayStart, todayEnd, weekStart, monthStart, yearStart } from '../utils/date.js'

const store = useAccountingStore()
const chartCanvas = ref(null)
const chartLabel = ref('本月')

onMounted(async () => {
  await store.init()
  await nextTick()
  drawChart()
})

// Redraw when store.sales changes
watch(() => store.sales.length, async () => {
  await nextTick()
  drawChart()
})

function getDailyProfits(period) {
  const sales = store.getSalesByPeriod(period)
  const byDay = {}
  for (const s of sales) {
    const d = new Date(s.saleTime)
    const key = `${d.getMonth() + 1}/${d.getDate()}`
    byDay[key] = (byDay[key] || 0) + s.totalProfit
  }
  return byDay
}

function drawChart() {
  if (!chartCanvas.value) return
  const ctx = chartCanvas.value.getContext('2d')
  const canvas = chartCanvas.value

  // Set canvas size
  const container = canvas.parentElement
  canvas.width = container.offsetWidth - 32
  canvas.height = 200

  const data = getDailyProfits('month')
  const entries = Object.entries(data)

  if (entries.length === 0) {
    ctx.fillStyle = '#D4C5CC'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('暂无销售数据', canvas.width / 2, canvas.height / 2)
    return
  }

  const padding = { top: 20, right: 16, bottom: 30, left: 50 }
  const chartW = canvas.width - padding.left - padding.right
  const chartH = canvas.height - padding.top - padding.bottom

  // Find max value
  const maxVal = Math.max(...entries.map(e => e[1]), 1)
  const yMax = Math.ceil(maxVal * 1.2)

  // Draw background
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Grid lines
  ctx.strokeStyle = '#F5E8EC'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(canvas.width - padding.right, y)
    ctx.stroke()

    // Y labels
    const val = Math.round(yMax - (yMax / 4) * i)
    ctx.fillStyle = '#B5A0A8'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('¥' + val, padding.left - 6, y + 4)
  }

  // Bars
  const barWidth = Math.min(28, (chartW / entries.length) * 0.6)
  const gap = chartW / entries.length

  entries.forEach((entry, i) => {
    const [label, value] = entry
    const barH = (value / yMax) * chartH
    const x = padding.left + gap * i + (gap - barWidth) / 2
    const y = padding.top + chartH - barH

    // Gradient bar
    const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH)
    gradient.addColorStop(0, '#FCCDD3')
    gradient.addColorStop(1, '#F4A7BB')
    ctx.fillStyle = gradient

    // Rounded top bar
    const radius = Math.min(4, barWidth / 2)
    ctx.beginPath()
    ctx.moveTo(x, padding.top + chartH)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.lineTo(x + barWidth - radius, y)
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
    ctx.lineTo(x + barWidth, padding.top + chartH)
    ctx.closePath()
    ctx.fill()

    // X label (only show every few if too many)
    if (entries.length <= 15 || i % Math.ceil(entries.length / 10) === 0) {
      ctx.fillStyle = '#B5A0A8'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + barWidth / 2, padding.top + chartH + 16)
    }
  })
}
</script>
