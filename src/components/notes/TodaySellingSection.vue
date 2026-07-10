<template>
  <div>
    <div v-if="sellingProducts.length === 0" style="padding:20px;text-align:center;color:var(--color-text-hint);font-size:14px">
      🏪 暂无正在售出的商品
    </div>
    <div class="product-grid" style="padding-top:0">
      <div
        v-for="product in sellingProducts"
        :key="product.id"
        class="product-card"
      >
        <div class="product-card__image">
          <img v-if="product.imageBase64" :src="product.imageBase64" style="width:100%;height:100%;object-fit:cover" alt="" />
          <IconImage v-else :size="40" style="opacity:0.3; color: var(--color-text-hint)" />
        </div>
        <div class="product-card__body">
          <div class="product-card__name">{{ product.name }}</div>
          <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">
            💰 ¥{{ product.sellingPrice }} · 库存 {{ getStock(product.id) }}
          </div>
          <div style="display:flex;gap:4px;margin-top:6px">
            <button class="btn btn--cute" style="flex:1;font-size:11px;padding:4px 0" @click.stop="openSell(product)">
              <IconMoney :size="12" />
              售出
            </button>
            <button class="btn btn--ghost" style="flex:1;font-size:11px;padding:4px 0" @click.stop="openManage(product)">
              <IconEdit :size="12" />
              管理
            </button>
          </div>
        </div>
      </div>
    </div>

    <div style="padding:8px 16px">
      <button class="btn-icon" style="color:var(--color-pink);font-size:13px" @click="showAddUnsold = true">
        <IconAdd :size="16" />
        <span>添加未售出商品</span>
      </button>
    </div>

    <SellDialog v-model="showSell" :product="sellingTarget" @confirm="handleSell" />

    <ModalDialog
      :modelValue="showManage"
      title="管理商品状态"
      confirmText="保存"
      @update:modelValue="showManage = $event"
      @confirm="handleManage"
      @cancel="showManage = false"
    >
      <div style="text-align:left">
        <label class="form-label">更改状态</label>
        <select class="form-select" v-model="manageStatus">
          <option value="unsold">未售出</option>
          <option value="pending-listing">待上架（下架）</option>
        </select>
      </div>
    </ModalDialog>

    <ModalDialog
      :modelValue="showAddUnsold"
      title="添加到今日正售"
      confirmText="添加"
      @update:modelValue="showAddUnsold = $event"
      @confirm="handleAddUnsold"
      @cancel="showAddUnsold = false"
    >
      <div v-if="unsoldList.length === 0" style="text-align:center;color:var(--color-text-hint);padding:16px">
        没有未售出商品
      </div>
      <div v-else style="text-align:left;max-height:200px;overflow-y:auto">
        <div v-for="p in unsoldList" :key="p.id" style="display:flex;align-items:center;padding:8px 0;gap:8px;border-bottom:0.5px solid var(--color-separator)">
          <input type="checkbox" :value="p.id" v-model="selectedUnsold" />
          <span style="font-size:14px">{{ p.name }}</span>
          <span style="font-size:12px;color:var(--color-text-secondary);margin-left:auto">¥{{ p.sellingPrice }}</span>
        </div>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ModalDialog from '../shared/ModalDialog.vue'
import SellDialog from './SellDialog.vue'
import { IconImage, IconAdd, IconMoney, IconEdit } from '../../icons/index.js'
import { useWarehouseStore } from '../../stores/warehouse.js'

const warehouse = useWarehouseStore()
const showSell = ref(false)
const showManage = ref(false)
const showAddUnsold = ref(false)
const sellingTarget = ref(null)
const manageTarget = ref(null)
const manageStatus = ref('unsold')
const selectedUnsold = ref([])

onMounted(async () => {
  await warehouse.init()
})

const sellingProducts = computed(() => warehouse.sellingProducts)
const unsoldList = computed(() => warehouse.unsoldProducts)

function getStock(productId) {
  return warehouse.getBatchTotal(productId)
}

function openSell(product) {
  sellingTarget.value = product
  showSell.value = true
}

function openManage(product) {
  manageTarget.value = product
  manageStatus.value = 'unsold'
  showManage.value = true
}

async function handleSell(data) {
  try {
    await warehouse.sellProduct(sellingTarget.value.id, data.actualPrice, data.quantity)
    showSell.value = false
    sellingTarget.value = null
  } catch (err) {
    alert(err.message)
  }
}

async function handleManage() {
  await warehouse.updateProduct(manageTarget.value.id, { status: manageStatus.value })
  showManage.value = false
  manageTarget.value = null
}

async function handleAddUnsold() {
  for (const productId of selectedUnsold.value) {
    await warehouse.updateProduct(productId, { status: 'currently-selling' })
  }
  selectedUnsold.value = []
  showAddUnsold.value = false
}
</script>
