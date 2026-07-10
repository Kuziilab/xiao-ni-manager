<template>
  <div style="padding: 8px 16px 16px">
    <!-- Existing transactions -->
    <div v-if="recentTxs.length" style="margin-bottom: 12px">
      <div v-for="tx in recentTxs" :key="tx.id" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;font-size:14px;border-bottom:0.5px solid var(--color-separator)">
        <span>
          <span :style="{ color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)', marginRight: '8px' }">
            {{ tx.type === 'income' ? '+' : '-' }}¥{{ tx.amount }}
          </span>
          {{ tx.categoryName }}
        </span>
        <button style="color:var(--color-text-hint);font-size:12px" @click="store.deleteTransaction(tx.id)">删除</button>
      </div>
    </div>

    <!-- Add form toggle -->
    <button class="btn-icon" style="color: var(--color-text-secondary)" @click="showForm = !showForm">
      <IconAdd :size="16" />
      <span style="font-size: 13px">添加收支</span>
    </button>

    <div v-if="showForm" style="margin-top: 8px">
      <div style="display: flex; gap: 8px; margin-bottom: 8px">
        <button
          class="pill"
          :class="{ 'pill--active': newTx.type === 'income' }"
          @click="newTx.type = 'income'"
          style="flex: 1; text-align: center"
        >
          <IconIncome :size="14" style="display:inline;vertical-align:middle" />
          收入
        </button>
        <button
          class="pill"
          :class="{ 'pill--active': newTx.type === 'expense' }"
          @click="newTx.type = 'expense'"
          style="flex: 1; text-align: center"
        >
          <IconExpense :size="14" style="display:inline;vertical-align:middle" />
          支出
        </button>
      </div>
      <input class="form-input" v-model="newTx.amount" type="number" step="0.01" placeholder="金额" style="margin-bottom:8px" />
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <select class="form-select" v-model="newTx.categoryName" style="flex:1">
          <option value="">选择类别</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <input class="form-input" v-model="newTx.customCategory" placeholder="自定义" style="flex:1" />
      </div>
      <input class="form-input" v-model="newTx.description" placeholder="备注（可选）" style="margin-bottom:8px" />
      <button class="btn btn--primary" style="width:100%" @click="submit">记录</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { IconAdd, IconIncome, IconExpense } from '../../icons/index.js'
import { useAccountingStore } from '../../stores/accounting.js'

const store = useAccountingStore()
const showForm = ref(false)
const newTx = reactive({
  type: 'income',
  amount: '',
  categoryName: '',
  customCategory: '',
  description: ''
})

const categories = computed(() =>
  newTx.type === 'income' ? store.incomeCategories : store.expenseCategories
)

const recentTxs = computed(() =>
  [...store.transactions].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 20)
)

async function submit() {
  const amount = Number(newTx.amount)
  if (!amount || amount <= 0) return

  const category = newTx.customCategory.trim() || newTx.categoryName
  if (!category) {
    alert('请选择或输入类别')
    return
  }

  await store.addTransaction({
    type: newTx.type,
    amount,
    categoryName: category,
    description: newTx.description
  })

  newTx.amount = ''
  newTx.categoryName = ''
  newTx.customCategory = ''
  newTx.description = ''
  showForm.value = false
}
</script>
