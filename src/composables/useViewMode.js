// 列表/网格视图模式，持久化到 localStorage
import { ref, watch } from 'vue'

const KEY = 'xiao-ni-view-mode'

// 全局共享状态
const saved = localStorage.getItem(KEY)
const viewMode = ref(saved || 'grid')

watch(viewMode, (val) => {
  localStorage.setItem(KEY, val)
})

export function useViewMode() {
  return { viewMode }
}
