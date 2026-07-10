// 图片处理 composable
import { ref } from 'vue'
import { compressImage, compressDiaryImage } from '../utils/image.js'

export function useImage() {
  const uploading = ref(false)

  async function pickAndCompress(file, isDiary = false) {
    if (!file) return null
    uploading.value = true
    try {
      const base64 = isDiary
        ? await compressDiaryImage(file)
        : await compressImage(file)
      return base64
    } catch (err) {
      console.error('Image compression failed:', err)
      return null
    } finally {
      uploading.value = false
    }
  }

  function createFileInput(accept = 'image/*') {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = accept
      input.onchange = (e) => {
        const file = e.target.files[0]
        resolve(file || null)
      }
      input.click()
    })
  }

  return { uploading, pickAndCompress, createFileInput }
}
