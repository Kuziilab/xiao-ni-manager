// NanoID 风格 ID 生成器
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateId(length = 12) {
  let result = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }
  return result
}

export function generateProductCode() {
  // 商品编号: P + 时间戳 + 随机字符
  const ts = Date.now().toString(36).toUpperCase().slice(-6)
  const rand = generateId(4).toUpperCase()
  return `P${ts}${rand}`
}
