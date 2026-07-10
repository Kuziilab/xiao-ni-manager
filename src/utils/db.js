import { DB_NAME, DB_VERSION } from './constants.js'

// IndexedDB 封装：openDB、CRUD、索引、迁移

let db = null

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call openDB() first.')
  }
  return db
}

export function openDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db)
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const currentVersion = event.oldVersion

      // 仅在版本 1 时创建所有 store
      if (currentVersion < 1) {
        createStoresV1(db)
      }
      // 后续版本迁移在此处添加
    }

    request.onsuccess = (event) => {
      db = event.target.result
      db.onerror = (e) => {
        console.error('IndexedDB error:', e.target.error)
      }
      resolve(db)
    }

    request.onerror = (event) => {
      reject(new Error(`Failed to open database: ${event.target.error?.message}`))
    }

    request.onblocked = () => {
      reject(new Error('Database upgrade blocked. Please close other tabs.'))
    }
  })
}

function createStoresV1(db) {
  // 1. categories
  const categories = db.createObjectStore('categories', { keyPath: 'id' })
  categories.createIndex('name', 'name', { unique: true })
  categories.createIndex('updatedAt', 'updatedAt', { unique: false })

  // 2. products
  const products = db.createObjectStore('products', { keyPath: 'id' })
  products.createIndex('status', 'status', { unique: false })
  products.createIndex('categoryId', 'categoryId', { unique: false })
  products.createIndex('updatedAt', 'updatedAt', { unique: false })
  products.createIndex('name', 'name', { unique: false })
  products.createIndex('sellingPrice', 'sellingPrice', { unique: false })

  // 3. batches
  const batches = db.createObjectStore('batches', { keyPath: 'id' })
  batches.createIndex('productId', 'productId', { unique: false })
  batches.createIndex('entryTime', 'entryTime', { unique: false })

  // 4. sales
  const sales = db.createObjectStore('sales', { keyPath: 'id' })
  sales.createIndex('saleTime', 'saleTime', { unique: false })
  sales.createIndex('productId', 'productId', { unique: false })

  // 5. consignmentOrders
  const consignment = db.createObjectStore('consignmentOrders', { keyPath: 'id' })
  consignment.createIndex('createdAt', 'createdAt', { unique: false })
  consignment.createIndex('status', 'status', { unique: false })

  // 6. goals
  const goals = db.createObjectStore('goals', { keyPath: 'id' })
  goals.createIndex('type', 'type', { unique: false })
  goals.createIndex('date', 'date', { unique: false })
  goals.createIndex('completed', 'completed', { unique: false })

  // 7. customTransactions
  const transactions = db.createObjectStore('customTransactions', { keyPath: 'id' })
  transactions.createIndex('date', 'date', { unique: false })
  transactions.createIndex('type', 'type', { unique: false })

  // 8. diaryEntries
  const diary = db.createObjectStore('diaryEntries', { keyPath: 'id' })
  diary.createIndex('date', 'date', { unique: false })

  // 9. settings — key-value store
  db.createObjectStore('settings', { keyPath: 'key' })
}

// ----- CRUD Helpers -----

export function dbAdd(storeName, item) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.add(item)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function dbPut(storeName, item) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.put(item)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function dbGet(storeName, id) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export function dbDelete(storeName, id) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export function dbGetAll(storeName) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export function dbGetAllByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export function dbGetAllByRange(storeName, indexName, lower, upper) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const index = store.index(indexName)
    const range = IDBKeyRange.bound(lower, upper)
    const request = index.getAll(range)
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export function dbCount(storeName) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.count()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 按索引计数
export function dbCountByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.count(value)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 批量写入 — 同一事务
export function dbBatchWrite(storeName, items) {
  return new Promise((resolve, reject) => {
    const d = getDB()
    const tx = d.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    for (const item of items) {
      store.put(item)
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// 多 store 事务 — 用于原子操作
export function dbTransaction(storeNames, mode = 'readwrite') {
  const d = getDB()
  return d.transaction(storeNames, mode)
}

// 获取设置
export async function dbGetSetting(key, defaultValue = null) {
  const val = await dbGet('settings', key)
  return val ? val.value : defaultValue
}

// 保存设置
export async function dbSetSetting(key, value) {
  await dbPut('settings', { key, value })
}
