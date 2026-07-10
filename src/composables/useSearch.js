// 搜索 composable
import { ref, computed } from 'vue'

export function useSearch(items, keys = ['name']) {
  const query = ref('')

  const results = computed(() => {
    if (!query.value.trim()) return items.value || []
    const q = query.value.toLowerCase().trim()
    return (items.value || []).filter(item => {
      return keys.some(key => {
        const val = item[key]
        return val && String(val).toLowerCase().includes(q)
      })
    })
  })

  const suggestions = computed(() => {
    if (!query.value.trim()) return []
    const q = query.value.toLowerCase().trim()
    const names = new Set()
    return (items.value || [])
      .filter(item => {
        const name = item.name || item.productName || ''
        const match = name.toLowerCase().includes(q)
        if (match && !names.has(name)) {
          names.add(name)
          return true
        }
        return false
      })
      .map(item => item.name || item.productName || '')
      .slice(0, 5)
  })

  function setQuery(val) {
    query.value = val
  }

  function clearSearch() {
    query.value = ''
  }

  return { query, results, suggestions, setQuery, clearSearch }
}
