// Toast 全局状态
import { reactive } from 'vue'

const state = reactive({
  show: false,
  message: '',
  type: 'info', // 'info' | 'success' | 'error'
  timer: null
})

export function useToast() {
  function showToast(message, type = 'info', duration = 2000) {
    clearTimeout(state.timer)
    state.message = message
    state.type = type
    state.show = true
    state.timer = setTimeout(() => {
      state.show = false
    }, duration)
  }

  return {
    ...state,
    show: state.show,
    message: state.message,
    type: state.type,
    showToast
  }
}
