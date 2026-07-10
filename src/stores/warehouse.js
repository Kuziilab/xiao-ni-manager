import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  openDB, dbAdd, dbPut, dbDelete, dbGetAll, dbGetAllByIndex, dbGetAllByRange,
  dbCountByIndex, dbTransaction
} from '../utils/db.js'
import { generateId, generateProductCode } from '../utils/id.js'
import { calculateFIFO } from '../utils/fifo.js'
import { useToast } from '../composables/useToast.js'

export const useWarehouseStore = defineStore('warehouse', () => {
  // State
  const products = ref([])
  const categories = ref([])
  const batches = ref([])
  const loading = ref(false)
  const toast = useToast()

  // Init
  async function init() {
    loading.value = true
    try {
      await openDB()
      products.value = await dbGetAll('products')
      categories.value = await dbGetAll('categories')
      batches.value = await dbGetAll('batches')
    } catch (err) {
      console.error('Failed to init warehouse:', err)
    } finally {
      loading.value = false
    }
  }

  // ----- Categories -----
  async function addCategory(name) {
    const existing = await dbGetAllByIndex('categories', 'name', name)
    if (existing.length) {
      toast.showToast('该分类已存在', 'error')
      return null
    }
    const cat = {
      id: generateId(),
      name: name.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    await dbAdd('categories', cat)
    categories.value.push(cat)
    toast.showToast('分类已添加')
    return cat
  }

  async function deleteCategory(id) {
    // Check if any products use this category
    const prods = await dbGetAllByIndex('products', 'categoryId', id)
    if (prods.length) {
      toast.showToast(`该分类下有 ${prods.length} 个商品，无法删除`, 'error')
      return
    }
    await dbDelete('categories', id)
    categories.value = categories.value.filter(c => c.id !== id)
    toast.showToast('分类已删除')
  }

  // ----- Products -----
  async function addProduct(form) {
    const now = Date.now()
    const product = {
      id: generateId(),
      name: form.name.trim(),
      imageBase64: form.imageBase64 || '',
      categoryId: form.categoryId || null,
      status: form.status || 'unsold',
      sellingPrice: Number(form.sellingPrice) || 0,
      listingTime: form.status === 'currently-selling' ? now : null,
      soldTime: form.status === 'sold' ? now : null,
      createdAt: now,
      updatedAt: now
    }

    await dbAdd('products', product)
    products.value.unshift(product)

    // If batch info provided, add initial batch
    if (form.quantity && Number(form.quantity) > 0) {
      await addBatch(product.id, {
        quantity: Number(form.quantity),
        unitCost: Number(form.unitCost) || 0
      })
    }

    toast.showToast('商品已录入')
    return product
  }

  async function updateProduct(id, form) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx === -1) return

    const product = { ...products.value[idx] }
    product.name = form.name?.trim() || product.name
    product.imageBase64 = form.imageBase64 !== undefined ? form.imageBase64 : product.imageBase64
    product.categoryId = form.categoryId !== undefined ? form.categoryId : product.categoryId
    product.status = form.status || product.status
    product.sellingPrice = Number(form.sellingPrice) ?? product.sellingPrice
    product.updatedAt = Date.now()

    // Update status timestamps
    if (form.status === 'currently-selling' && !product.listingTime) {
      product.listingTime = Date.now()
    }
    if (form.status === 'sold') {
      product.soldTime = Date.now()
    }

    await dbPut('products', product)
    products.value[idx] = product
    toast.showToast('商品已更新')
    return product
  }

  async function deleteProduct(id, quantity) {
    const product = products.value.find(p => p.id === id)
    if (!product) return

    // Delete all batches or reduce quantity
    const productBatches = await dbGetAllByIndex('batches', 'productId', id)

    if (quantity && productBatches.length > 0) {
      // Reduce from batches (FIFO order)
      let remaining = quantity
      const sortedBatches = [...productBatches].sort((a, b) => a.entryTime - b.entryTime)
      for (const batch of sortedBatches) {
        if (remaining <= 0) break
        const consume = Math.min(batch.remainingQuantity, remaining)
        batch.remainingQuantity -= consume
        remaining -= consume
        await dbPut('batches', batch)
      }
      // Update local state
      batches.value = await dbGetAll('batches')
      toast.showToast(`已删除 ${quantity - remaining} 件`)
    } else {
      // Full delete
      for (const batch of productBatches) {
        await dbDelete('batches', batch.id)
      }
      await dbDelete('products', id)
      products.value = products.value.filter(p => p.id !== id)
      batches.value = batches.value.filter(b => b.productId !== id)
      toast.showToast('商品已删除')
    }
  }

  // ----- Batches -----
  async function addBatch(productId, form) {
    const batch = {
      id: generateId(),
      productId,
      quantity: Number(form.quantity),
      remainingQuantity: Number(form.quantity),
      unitCost: Number(form.unitCost) || 0,
      entryTime: Date.now(),
      createdAt: Date.now()
    }
    await dbAdd('batches', batch)
    batches.value.push(batch)
    return batch
  }

  async function getProductBatches(productId) {
    const result = await dbGetAllByIndex('batches', 'productId', productId)
    return result.sort((a, b) => a.entryTime - b.entryTime)
  }

  function getBatchTotal(productId) {
    return batches.value
      .filter(b => b.productId === productId)
      .reduce((sum, b) => sum + b.remainingQuantity, 0)
  }

  // ----- FIFO Sale -----
  async function sellProduct(productId, actualPrice, sellQuantity) {
    const product = products.value.find(p => p.id === productId)
    if (!product) throw new Error('商品不存在')

    const totalInStock = getBatchTotal(productId)
    if (sellQuantity > totalInStock) {
      throw new Error(`库存不足（库存: ${totalInStock}件）`)
    }

    // Calculate FIFO
    const result = await calculateFIFO(productId, sellQuantity, actualPrice)

    // Create sale record
    const sale = {
      id: generateId(),
      productId,
      productName: product.name,
      actualPrice,
      quantity: sellQuantity,
      totalRevenue: result.totalRevenue,
      totalCost: result.totalCost,
      totalProfit: result.totalProfit,
      saleTime: Date.now()
    }
    await dbAdd('sales', sale)

    // Update product status if fully sold
    const remainingTotal = getBatchTotal(productId)
    if (remainingTotal <= 0) {
      await updateProduct(productId, { status: 'sold' })
    }

    // Refresh batches
    batches.value = await dbGetAll('batches')

    return { sale, ...result }
  }

  // ----- Filtering -----
  function filteredProducts(status, search, sort) {
    let result = [...products.value]

    // Filter by status
    if (status) {
      result = result.filter(p => p.status === status)
    }

    // Search
    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sort.field) {
      result.sort((a, b) => {
        let va = a[sort.field]
        let vb = b[sort.field]
        if (va == null) va = 0
        if (vb == null) vb = 0
        if (sort.order === 'asc') return va > vb ? 1 : -1
        return va < vb ? 1 : -1
      })
    }

    return result
  }

  // Getters
  const unsoldProducts = computed(() => products.value.filter(p => p.status === 'unsold'))
  const sellingProducts = computed(() => products.value.filter(p => p.status === 'currently-selling'))

  return {
    products, categories, batches, loading,
    init,
    addCategory, deleteCategory,
    addProduct, updateProduct, deleteProduct,
    addBatch, getProductBatches, getBatchTotal,
    sellProduct,
    filteredProducts,
    unsoldProducts, sellingProducts
  }
})
