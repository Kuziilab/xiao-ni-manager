// Canvas 图片压缩/调整大小
import { IMAGE_MAX_WIDTH, IMAGE_QUALITY, DIARY_IMAGE_MAX_WIDTH, DIARY_IMAGE_QUALITY } from './constants.js'

export function compressImage(file, maxWidth = IMAGE_MAX_WIDTH, quality = IMAGE_QUALITY) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // 如果图片已经小于目标尺寸，直接返回原图 base64
        if (img.width <= maxWidth) {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/jpeg', quality))
          return
        }

        // 缩放
        const ratio = maxWidth / img.width
        const width = maxWidth
        const height = Math.round(img.height * ratio)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function compressDiaryImage(file) {
  return compressImage(file, DIARY_IMAGE_MAX_WIDTH, DIARY_IMAGE_QUALITY)
}

// 从 base64 估算存储大小（字节）
export function estimateImageSize(base64) {
  if (!base64) return 0
  // base64 字符串长度 × 0.75 ≈ 原始字节数
  const base64Data = base64.split(',')[1] || base64
  return Math.round(base64Data.length * 0.75)
}

// 格式化显示存储大小
export function formatStorageSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
