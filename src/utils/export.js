// 停止数据导出/导入
import { dbGetAll, dbPut, dbDelete, openDB } from './db.js'

const STORES = [
  'categories', 'products', 'batches', 'sales',
  'consignmentOrders', 'goals', 'customTransactions', 'diaryEntries', 'settings'
]

export async function exportAllData() {
  await openDB()
  const data = {}
  for (const store of STORES) {
    data[store] = await dbGetAll(store)
  }
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data
  }
}

export function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (err) {
        reject(new Error('文件格式错误'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}

export async function importAllData(backupData) {
  await openDB()
  const { data } = backupData

  for (const store of STORES) {
    if (!data[store]) continue
    // 清空原有数据
    const existing = await dbGetAll(store)
    for (const item of existing) {
      await dbDelete(store, item.id)
    }
    // 导入备份数据
    for (const item of data[store]) {
      await dbPut(store, item)
    }
  }
}

export async function estimateStorageUsage() {
  if ('storage' in navigator && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      total: estimate.quota || 0
    }
  }
  return null
}
