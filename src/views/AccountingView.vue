<template>
  <div class="page">
    <PeriodStats />

    <!-- 利润柱状图 -->
    <div class="chart-container">
      <div class="chart-container__title">
        <span class="kawaii-deco">📊</span>
        利润趋势
        <span style="margin-left:auto;font-size:12px;color:var(--color-text-hint);font-weight:400">本月</span>
      </div>
      <canvas ref="chartCanvas" />
    </div>

    <!-- 日历 — 按日查看 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">📅</span>
        {{ monthLabel }}
        <span style="margin-left:auto;font-size:11px;color:var(--color-text-hint)">点击日期查看详情</span>
      </div>
      <div class="module-box__body--no-padding">
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

    <!-- 选中日期详情 -->
    <div class="module-box" v-if="selectedDate">
      <div class="module-box__header">
        <span class="kawaii-deco">📋</span>
        {{ selectedDate }} 详情
      </div>
      <div class="module-box__body--no-padding">
        <!-- Sales for selected date -->
        <div v-if="daySales.length === 0 && dayTxs.length === 0" style="padding:16px;text-align:center;color:var(--color-text-hint);font-size:14px">
          💤 当日无记录
        </div>

        <div v-if="daySales.length">
          <div style="font-size:12px;color:var(--color-text-secondary);padding:8px 16px">💰 售出记录</div>
          <div v-for="s in daySales" :key="s.id" style="display:flex;justify-content:space-between;padding:8px 16px;font-size:14px;border-bottom:0.5px solid var(--color-separator)">
            <span>{{ s.productName }} ×{{ s.quantity }}</span>
            <div style="text-align:right">
              <span style="font-weight:600">¥{{ s.totalRevenue }}</span>
              <span style="font-size:12px;margin-left:6px" :style="{color: s.totalProfit>=0?'var(--color-success)':'var(--color-danger)'}">利润¥{{ s.totalProfit }}</span>
            </div>
          </div>
        </div>

        <div v-if="dayTxs.length" style="margin-top:4px">
          <div style="font-size:12px;color:var(--color-text-secondary);padding:8px 16px">📝 其他收支</div>
          <div v-for="t in dayTxs" :key="t.id" style="display:flex;justify-content:space-between;padding:8px 16px;font-size:14px;border-bottom:0.5px solid var(--color-separator)">
            <span>{{ t.categoryName }}</span>
            <span :style="{color:t.type==='income'?'var(--color-success)':'var(--color-danger)',fontWeight:'600'}">
              {{ t.type==='income'?'+':'-' }}¥{{ t.amount }}
            </span>
          </div>
        </div>

        <div v-if="daySales.length || dayTxs.length" style="padding:8px 16px;font-size:13px;text-align:right">
          <span v-if="dayTotal.revenue > 0" style="margin-right:12px">收入 <b style="color:var(--color-success)">¥{{ dayTotal.revenue }}</b></span>
          <span v-if="dayTotal.expense > 0" style="margin-right:12px">支出 <b style="color:var(--color-danger)">¥{{ dayTotal.expense }}</b></span>
          <span v-if="dayTotal.profit !== 0">利润 <b :style="{color:dayTotal.profit>=0?'var(--color-success)':'var(--color-danger)'}">¥{{ dayTotal.profit }}</b></span>
        </div>
      </div>
    </div>

    <!-- 售出明细方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">📜</span>
        全部售出明细
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
import { useCalendar } from '../composables/useCalendar.js'

const store = useAccountingStore()
const chartCanvas = ref(null)

const {
  cells, monthLabel, selectedDate,
  prevMonth, nextMonth, goToToday, selectDate
} = useCalendar()

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

onMounted(async () => {
  await store.init()
  await nextTick()
  drawChart()
})

watch(() => store.sales.length, async () => {
  await nextTick()
  drawChart()
})

// Day-specific data
const daySales = computed(() =>
  store.sales.filter(s => {
    const d = new Date(s.saleTime)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === selectedDate.value
  })
)

const dayTxs = computed(() =>
  store.transactions.filter(t => t.date === selectedDate.value)
)

const dayTotal = computed(() => {
  const saleRevenue = daySales.value.reduce((s, x) => s + x.totalRevenue, 0)
  const saleProfit = daySales.value.reduce((s, x) => s + x.totalProfit, 0)
  const txIncome = dayTxs.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const txExpense = dayTxs.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return {
    revenue: Math.round((saleRevenue + txIncome) * 100) / 100,
    expense: Math.round(txExpense * 100) / 100,
    profit: Math.round((saleProfit + txIncome - txExpense) * 100) / 100
  }
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

  const maxVal = Math.max(...entries.map(e => e[1]), 1)
  const yMax = Math.ceil(maxVal * 1.2)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = '#F5E8EC'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(canvas.width - padding.right, y)
    ctx.stroke()

    const val = Math.round(yMax - (yMax / 4) * i)
    ctx.fillStyle = '#B5A0A8'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('¥' + val, padding.left - 6, y + 4)
  }

  const barWidth = Math.min(28, (chartW / entries.length) * 0.6)
  const gap = chartW / entries.length

  entries.forEach((entry, i) => {
    const [label, value] = entry
    const barH = (value / yMax) * chartH
    const x = padding.left + gap * i + (gap - barWidth) / 2
    const y = padding.top + chartH - barH

    const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH)
    gradient.addColorStop(0, '#FCCDD3')
    gradient.addColorStop(1, '#F4A7BB')
    ctx.fillStyle = gradient

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

    if (entries.length <= 15 || i % Math.ceil(entries.length / 10) === 0) {
      ctx.fillStyle = '#B5A0A8'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + barWidth / 2, padding.top + chartH + 16)
    }
  })
}
</script>
