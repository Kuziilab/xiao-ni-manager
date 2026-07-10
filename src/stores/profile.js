import { defineStore } from 'pinia'
import { ref } from 'vue'
import { openDB, dbAdd, dbPut, dbDelete, dbGetAll, dbGetAllByIndex, dbGet } from '../utils/db.js'
import { generateId } from '../utils/id.js'
import { today } from '../utils/date.js'
import { useToast } from '../composables/useToast.js'

export const useProfileStore = defineStore('profile', () => {
  const diaries = ref([])
  const loading = ref(false)
  const toast = useToast()

  async function init() {
    loading.value = true
    try {
      await openDB()
      diaries.value = await dbGetAll('diaryEntries')
    } catch (err) {
      console.error('Failed to init profile:', err)
    } finally {
      loading.value = false
    }
  }

  // Get diary for a specific date
  async function getDiary(date) {
    // Search in local state first
    let entry = diaries.value.find(d => d.date === date)
    if (!entry) {
      // Try DB
      const results = await dbGetAllByIndex('diaryEntries', 'date', date)
      entry = results[0] || null
      if (entry && !diaries.value.find(d => d.id === entry.id)) {
        diaries.value.push(entry)
      }
    }
    return entry
  }

  // Save diary
  async function saveDiary(date, content, images = []) {
    let entry = diaries.value.find(d => d.date === date)
    const now = Date.now()

    if (entry) {
      entry.content = content
      entry.images = images
      entry.updatedAt = now
      await dbPut('diaryEntries', entry)
    } else {
      entry = {
        id: generateId(),
        date,
        content,
        images,
        createdAt: now,
        updatedAt: now
      }
      await dbAdd('diaryEntries', entry)
      diaries.value.push(entry)
    }
    toast.showToast('日记已保存')
    return entry
  }

  return {
    diaries, loading,
    init, getDiary, saveDiary
  }
})
