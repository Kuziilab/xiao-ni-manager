<template>
  <div>
    <!-- Existing batches -->
    <div v-if="batches.length" style="margin-bottom: 16px">
      <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px">
        入库批次记录
      </div>
      <div v-for="b in batches" :key="b.id" style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;border-bottom:0.5px solid var(--color-separator)">
        <span>{{ formatDate(b.entryTime) }}</span>
        <span>成本 ¥{{ b.unitCost }} × {{ b.quantity }}</span>
        <span style="color: var(--color-text-secondary)">剩余 {{ b.remainingQuantity }}</span>
      </div>
    </div>

    <!-- Add new batch -->
    <div>
      <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px">
        {{ batches.length ? '追加入库' : '入库' }}
      </div>
      <div style="display: flex; gap: 8px">
        <input class="form-input" v-model="newBatch.quantity" type="number" min="1" placeholder="数量" style="flex: 1" />
        <div class="price-input-wrapper" style="flex: 1">
          <input class="form-input" v-model="newBatch.unitCost" type="number" step="0.01" min="0" placeholder="成本" />
        </div>
        <button class="btn btn--primary" style="flex-shrink: 0" @click="add">入库</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { formatDate } from '../../utils/date.js'
import { useWarehouseStore } from '../../stores/warehouse.js'

const props = defineProps({
  productId: { type: String, required: true }
})

const store = useWarehouseStore()
const batches = ref([])
const newBatch = reactive({ quantity: 1, unitCost: 0 })

onMounted(async () => {
  batches.value = await store.getProductBatches(props.productId)
})

async function add() {
  if (newBatch.quantity <= 0) return
  await store.addBatch(props.productId, newBatch)
  batches.value = await store.getProductBatches(props.productId)
  newBatch.quantity = 1
  newBatch.unitCost = 0
}
</script>
