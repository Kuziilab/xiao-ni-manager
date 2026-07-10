import { defineStore } from 'pinia'
import { ref } from 'vue'
import { openDB, dbAdd, dbPut, dbDelete, dbGetAll, dbGetAllByIndex, dbGetAllByRange } from '../utils/db.js'
import { generateId } from '../utils/id.js'
import { today, todayStart, todayEnd, weekStart, monthStart, yearStart } from '../utils/date.js'
import { DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '../utils/constants.js'
import { useToast } from '../composables/useToast.js'

export const useAccountingStore = defineStore('accounting', () => {
  const sales = ref([])
  const transactions = ref([])
  const incomeCategories = ref([...DEFAULT_INCOME_CATEGORIES])
  const expenseCategories = ref([...DEFAULT_EXPENSE_CATEGORIES])
  const loading = ref(false)
  const toast = useToast()

  async function init() {
    loading.value = true
    try {
      await openDB()
      sales.value = await dbGetAll('sales')
      transactions.value = await dbGetAll('customTransactions')
    } catch (err) {
      console.error('Failed to init accounting:', err)
    } finally {
      loading.value = false
    }
  }

  // ----- Period Statistics -----
  function getSalesByPeriod(period) {
    let start
    switch (period) {
      case 'today': start = todayStart(); break
      case 'week': start = weekStart(); break
      case 'month': start = monthStart(); break
      case 'year': start = yearStart(); break
      default: start = 0 // all
    }
    return sales.value.filter(s => s.saleTime >= start)
  }

  function getSalesSummary(period) {
    const filtered = getSalesByPeriod(period)
    return {
      count: filtered.length,
      totalRevenue: Math.round(filtered.reduce((sum, s) => sum + s.totalRevenue, 0) * 100) / 100,
      totalCost: Math.round(filtered.reduce((sum, s) => sum + s.totalCost, 0) * 100) / 100,
      totalProfit: Math.round(filtered.reduce((sum, s) => sum + s.totalProfit, 0) * 100) / 100
    }
  }

  function getTransactionsByDate(date) {
    return transactions.value.filter(t => t.date === date)
  }

  function getTransactionsSummary(date) {
    const filtered = date ? getTransactionsByDate(date) : transactions.value
    const income = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, net: income - expense }
  }

  // ----- Custom Transactions -----
  async function addTransaction(form) {
    const tx = {
      id: generateId(),
      type: form.type,
      categoryName: form.categoryName.trim(),
      amount: Number(form.amount),
      description: form.description || null,
      date: form.date || today()
    }
    await dbAdd('customTransactions', tx)
    transactions.value.push(tx)
    toast.showToast('已记录')
    return tx
  }

  async function deleteTransaction(id) {
    await dbDelete('customTransactions', id)
    transactions.value = transactions.value.filter(t => t.id !== id)
    toast.showToast('已删除')
  }

  // ----- Categories -----
  async function addIncomeCategory(name) {
    if (!incomeCategories.value.includes(name)) {
      incomeCategories.value.push(name)
    }
  }

  async function addExpenseCategory(name) {
    if (!expenseCategories.value.includes(name)) {
      expenseCategories.value.push(name)
    }
  }

  return {
    sales, transactions, incomeCategories, expenseCategories, loading,
    init,
    getSalesByPeriod, getSalesSummary, getTransactionsByDate, getTransactionsSummary,
    addTransaction, deleteTransaction,
    addIncomeCategory, addExpenseCategory
  }
})
