// 先进先出成本核算
import { dbGetAllByIndex, dbBatchWrite } from './db.js'

/**
 * FIFO cost allocation for selling N units of a product.
 * Consumes batch remainingQuantity from oldest (entryTime ASC).
 *
 * @param {string} productId
 * @param {number} sellQuantity - number of units sold
 * @param {number} actualPrice - actual price per unit sold
 * @returns {{ totalCost: number, totalRevenue: number, totalProfit: number, consumedBatches: array }}
 */
export async function calculateFIFO(productId, sellQuantity, actualPrice) {
  const batches = await dbGetAllByIndex('batches', 'productId', productId)
  // Sort oldest first
  batches.sort((a, b) => a.entryTime - b.entryTime)

  let remaining = sellQuantity
  let totalCost = 0
  const consumedBatches = []
  const updatedBatches = []

  for (const batch of batches) {
    if (remaining <= 0) break
    if (batch.remainingQuantity <= 0) continue

    const consume = Math.min(batch.remainingQuantity, remaining)
    totalCost += consume * batch.unitCost

    consumedBatches.push({
      batchId: batch.id,
      unitCost: batch.unitCost,
      quantity: consume,
      cost: consume * batch.unitCost
    })

    batch.remainingQuantity -= consume
    updatedBatches.push(batch)
    remaining -= consume
  }

  if (remaining > 0) {
    throw new Error(`库存不足：缺少 ${remaining} 件`)
  }

  // 更新批次数据
  if (updatedBatches.length > 0) {
    await dbBatchWrite('batches', updatedBatches)
  }

  const totalRevenue = actualPrice * sellQuantity
  const totalProfit = totalRevenue - totalCost

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    consumedBatches
  }
}
