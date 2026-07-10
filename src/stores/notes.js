import { defineStore } from 'pinia'
import { ref } from 'vue'
import { openDB, dbAdd, dbPut, dbDelete, dbGetAll, dbGetAllByIndex } from '../utils/db.js'
import { generateId } from '../utils/id.js'
import { today } from '../utils/date.js'
import { useToast } from '../composables/useToast.js'

export const useNotesStore = defineStore('notes', () => {
  const goals = ref([])
  const loading = ref(false)
  const toast = useToast()

  async function init() {
    loading.value = true
    try {
      await openDB()
      goals.value = await dbGetAll('goals')
    } catch (err) {
      console.error('Failed to init notes:', err)
    } finally {
      loading.value = false
    }
  }

  // Daily goals for today
  async function getTodayGoals() {
    const t = today()
    return await dbGetAllByIndex('goals', 'date', t)
  }

  // Long-term goals
  async function getLongTermGoals() {
    return await dbGetAllByIndex('goals', 'type', 'long-term')
  }

  // Add goal
  async function addGoal(form) {
    const goal = {
      id: generateId(),
      type: form.type || 'daily',
      name: form.name.trim(),
      time: form.time || null,
      location: form.location || null,
      date: form.date || today(),
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      completed: false,
      cancelled: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    await dbAdd('goals', goal)
    goals.value.push(goal)
    toast.showToast('目标已添加')
    return goal
  }

  // Toggle complete
  async function toggleGoal(id) {
    const idx = goals.value.findIndex(g => g.id === id)
    if (idx === -1) return
    const goal = { ...goals.value[idx] }
    goal.completed = !goal.completed
    goal.updatedAt = Date.now()
    await dbPut('goals', goal)
    goals.value[idx] = goal
  }

  // Cancel goal
  async function cancelGoal(id) {
    const idx = goals.value.findIndex(g => g.id === id)
    if (idx === -1) return
    const goal = { ...goals.value[idx] }
    goal.cancelled = true
    goal.updatedAt = Date.now()
    await dbPut('goals', goal)
    goals.value[idx] = goal
  }

  // Delete goal
  async function deleteGoal(id) {
    await dbDelete('goals', id)
    goals.value = goals.value.filter(g => g.id !== id)
    toast.showToast('目标已删除')
  }

  return {
    goals, loading,
    init, getTodayGoals, getLongTermGoals,
    addGoal, toggleGoal, cancelGoal, deleteGoal
  }
})
