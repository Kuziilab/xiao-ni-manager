<template>
  <div>
    <!-- Today mode: show currently-selling products -->
    <template v-if="isToday">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 16px">
        <div v-if="sellingProducts.length" style="font-size:12px;color:var(--color-text-hint)">{{ sellingProducts.length }}件</div>
        <div v-else />
        <span style="display:flex;align-items:center;gap:6px">
          <button style="font-size:18px;line-height:1;padding:2px 6px;border-radius:var(--radius-xs);transition:all 0.15s"
            :style="cartMode ? {background:'var(--color-pink-light)',color:'var(--color-pink)'} : {color:'var(--color-text-hint)'}"
            @click="toggleCart" title="批量结算">
            🛒
          </button>
          <span class="mode-toggle">
            <button class="mode-toggle__btn" :class="{ 'mode-toggle__btn--active': viewMode === 'grid' }" @click="viewMode = 'grid'" title="大图">▦</button>
            <button class="mode-toggle__btn" :class="{ 'mode-toggle__btn--active': viewMode === 'list' }" @click="viewMode = 'list'" title="列表">☰</button>
          </span>
        </span>
      </div>
      <div v-if="sellingProducts.length === 0" style="padding:20px;text-align:center;color:var(--color-text-hint);font-size:14px">
        🏪 暂无正在售出的商品
      </div>
      <!-- 网格模式 -->
      <div v-else-if="viewMode === 'grid'" class="product-grid" style="padding-top:0">
        <div v-for="product in sellingProducts" :key="product.id" class="product-card">
          <div class="product-card__image">
            <img v-if="product.imageBase64" :src="product.imageBase64" style="width:100%;height:100%;object-fit:cover" alt="" />
            <IconImage v-else :size="40" style="opacity:0.3; color: var(--color-text-hint)" />
          </div>
          <div class="product-card__body">
            <div class="product-card__name">{{ product.name }}</div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">💰 ¥{{ product.sellingPrice }} · 库存 {{ getStock(product.id) }}</div>
            <!-- Cart mode: quantity controls -->
            <div v-if="cartMode" style="display:flex;align-items:center;gap:4px;margin-top:8px">
              <button class="btn btn--ghost" style="width:28px;height:28px;padding:0;font-size:18px;line-height:1;border-radius:50%;background:var(--color-bg)"
                @click.stop="decQty(product.id)">−</button>
              <input class="form-input" type="number" min="0" :max="getStock(product.id)"
                :value="cartQty[product.id] || 0"
                @input="setQty(product.id, $event.target.value)"
                style="width:40px;height:28px;text-align:center;font-size:13px;padding:0" />
              <button class="btn btn--ghost" style="width:28px;height:28px;padding:0;font-size:18px;line-height:1;border-radius:50%;background:var(--color-bg)"
                @click.stop="incQty(product.id)">+</button>
            </div>
            <!-- Normal mode: action buttons -->
            <div v-else style="display:flex;gap:4px;margin-top:6px">
              <button class="btn btn--cute" style="flex:1;font-size:11px;padding:4px 0" @click.stop="openSell(product)">💰 售出</button>
              <button class="btn btn--ghost" style="flex:1;font-size:11px;padding:4px 0" @click.stop="openManage(product)">✎ 管理</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 列表模式 -->
      <div v-else>
        <div v-for="product in sellingProducts" :key="product.id" class="product-list-item">
          <img v-if="product.imageBase64" :src="product.imageBase64" class="product-list-item__thumb" />
          <div v-else class="product-list-item__thumb" style="display:flex;align-items:center;justify-content:center;color:var(--color-text-hint)"><IconImage :size="24" /></div>
          <div class="product-list-item__info">
            <div class="product-list-item__name">{{ product.name }}</div>
            <div class="product-list-item__meta">💰 ¥{{ product.sellingPrice }} · 库存 {{ getStock(product.id) }}</div>
          </div>
          <!-- Cart mode -->
          <div v-if="cartMode" style="display:flex;align-items:center;gap:4px;flex-shrink:0">
            <button class="btn btn--ghost" style="width:24px;height:24px;padding:0;font-size:14px;border-radius:50%;background:var(--color-bg)" @click.stop="decQty(product.id)">−</button>
            <input class="form-input" type="number" min="0" :max="getStock(product.id)" :value="cartQty[product.id] || 0" @input="setQty(product.id, $event.target.value)" style="width:36px;height:24px;text-align:center;font-size:12px;padding:0" />
            <button class="btn btn--ghost" style="width:24px;height:24px;padding:0;font-size:14px;border-radius:50%;background:var(--color-bg)" @click.stop="incQty(product.id)">+</button>
          </div>
          <div v-else class="product-list-item__actions">
            <button class="btn btn--cute" style="font-size:11px;padding:3px 8px" @click.stop="openSell(product)">售出</button>
            <button class="btn btn--ghost" style="font-size:11px;padding:3px 8px" @click.stop="openManage(product)">管理</button>
          </div>
        </div>
      </div>

      <!-- Cart checkout bar -->
      <div v-if="cartMode && cartTotalItems > 0" style="position:sticky;bottom:0;background:var(--color-surface);border-top:2px solid var(--color-pink);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;z-index:10">
        <div>
          <div style="font-size:12px;color:var(--color-text-secondary)">共 {{ cartTotalItems }} 件</div>
          <div style="font-size:18px;font-weight:700;color:var(--color-pink-dark)">¥{{ cartTotalAmount }}</div>
        </div>
        <button class="btn btn--cute" style="font-size:15px;padding:10px 24px" @click="checkout">结算</button>
      </div>

      <div style="padding:8px 16px">
        <button class="btn-icon" style="color:var(--color-pink);font-size:13px" @click="showAddUnsold = true">
          <IconAdd :size="16" />
          <span>添加未售出商品</span>
        </button>
      </div>
    </template>

    <!-- Past date mode: show sales from that day -->
    <template v-else>
      <div v-if="daySales.length === 0" style="padding:20px;text-align:center;color:var(--color-text-hint);font-size:14px">
        📭 这天没有售出记录
      </div>
      <div v-else>
        <div v-for="sale in daySales" :key="sale.id" class="list-item--card" style="margin:8px 12px">
          <div class="list-item__icon" style="background:var(--color-pink-light);border-radius:var(--radius-full)">
            <IconMoney :size="18" />
          </div>
          <div class="list-item__content">
            <div class="list-item__title">{{ sale.productName }}</div>
            <div class="list-item__subtitle">售出 {{ sale.quantity }}件</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:14px;font-weight:600">¥{{ sale.totalRevenue }}</div>
            <div style="font-size:12px" :style="{color:sale.totalProfit>=0?'var(--color-success)':'var(--color-danger)'}">
              利润 ¥{{ sale.totalProfit }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <SellDialog v-model="showSell" :product="sellingTarget" @confirm="handleSell" />

    <!-- 管理面板 -->
    <BottomSheet v-model="showManage" :title="'管理 - ' + (manageTarget?.name || '')">
      <!-- 下架部分库存 -->
      <div style="padding:0 16px 12px;border-bottom:1px solid var(--color-separator);margin-bottom:12px">
        <div style="font-size:14px;font-weight:600;margin-bottom:8px">📦 下架部分库存</div>
        <div style="display:flex;gap:8px;align-items:flex-end">
          <div style="flex:1">
            <label class="form-label">下架数量</label>
            <input class="form-input" v-model.number="delistQty" type="number" min="1" :max="manageStock" />
          </div>
          <button class="btn btn--cute" style="flex-shrink:0" @click="doDelist">下架</button>
        </div>
        <div style="font-size:11px;color:var(--color-text-hint);margin-top:4px">当前库存：{{ manageStock }} 件，下架后变为待上架</div>
      </div>

      <!-- 变更并分裂 -->
      <div style="padding:0 16px 12px">
        <div style="font-size:14px;font-weight:600;margin-bottom:8px">✂️ 变更并分裂为新商品</div>
        <div class="form-group">
          <label class="form-label">分裂数量</label>
          <input class="form-input" v-model.number="splitQty" type="number" min="1" :max="manageStock" />
        </div>
        <div class="form-group">
          <label class="form-label">新成本价 (元)</label>
          <div class="price-input-wrapper"><input class="form-input" v-model="splitCost" type="number" step="0.01" min="0" /></div>
        </div>
        <div class="form-group">
          <label class="form-label">新售价 (元)</label>
          <div class="price-input-wrapper"><input class="form-input" v-model="splitPrice" type="number" step="0.01" min="0" /></div>
        </div>
        <button class="btn btn--cute" style="width:100%" @click="doSplit">分裂为独立商品</button>
      </div>
    </BottomSheet>

    <ModalDialog
      :modelValue="showAddUnsold"
      title="添加到今日正售"
      confirmText="添加"
      @update:modelValue="showAddUnsold = $event"
      @confirm="handleAddUnsold"
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
import BottomSheet from '../shared/BottomSheet.vue'
import SellDialog from './SellDialog.vue'
import { IconImage, IconAdd, IconMoney, IconEdit } from '../../icons/index.js'
import { useWarehouseStore } from '../../stores/warehouse.js'
import { useAccountingStore } from '../../stores/accounting.js'
import { today } from '../../utils/date.js'

const props = defineProps({
  date: { type: String, default: () => today() },
  sellingType: { type: String, default: 'personal' } // 'personal' | 'consignment'
})

const targetStatus = computed(() => props.sellingType === 'consignment' ? 'consignment' : 'personal-selling')

import { useViewMode } from '../../composables/useViewMode.js'

const warehouse = useWarehouseStore()
const accounting = useAccountingStore()
const { viewMode } = useViewMode()
const showSell = ref(false)
const showManage = ref(false)
const showAddUnsold = ref(false)
const sellingTarget = ref(null)
const manageTarget = ref(null)
const manageStock = ref(0)
const delistQty = ref(1)
const splitQty = ref(1)
const splitCost = ref(0)
const splitPrice = ref(0)
const selectedUnsold = ref([])

// Cart mode
const cartMode = ref(false)
const cartQty = reactive({})

const cartTotalItems = computed(() =>
  Object.values(cartQty).reduce((s, v) => s + (Number(v) || 0), 0)
)
const cartTotalAmount = computed(() =>
  sellingProducts.value.reduce((sum, p) => sum + (p.sellingPrice * (Number(cartQty[p.id]) || 0)), 0)
)

function toggleCart() {
  cartMode.value = !cartMode.value
  if (!cartMode.value) {
    for (const key of Object.keys(cartQty)) delete cartQty[key]
  }
}
function getCartQty(productId) { return Number(cartQty[productId]) || 0 }
function setQty(productId, val) {
  const v = parseInt(val) || 0
  const max = getStock(productId)
  cartQty[productId] = Math.max(0, Math.min(v, max))
}
function incQty(productId) {
  const max = getStock(productId)
  cartQty[productId] = Math.min((Number(cartQty[productId]) || 0) + 1, max)
}
function decQty(productId) {
  cartQty[productId] = Math.max((Number(cartQty[productId]) || 0) - 1, 0)
}

async function checkout() {
  const items = sellingProducts.value.filter(p => (Number(cartQty[p.id]) || 0) > 0)
  if (!items.length) return
  if (!confirm(`确认结算 ${cartTotalItems.value} 件商品，总计 ¥${cartTotalAmount.value}？`)) return
  for (const product of items) {
    try {
      await warehouse.sellProduct(product.id, product.sellingPrice, Number(cartQty[product.id]) || 0)
    } catch (err) {
      alert(`${product.name}: ${err.message}`)
    }
  }
  for (const key of Object.keys(cartQty)) delete cartQty[key]
  cartMode.value = false
  await warehouse.init()
}

const isToday = computed(() => props.date === today())

onMounted(async () => {
  await warehouse.init()
  await accounting.init()
})

const sellingProducts = computed(() =>
  warehouse.products.filter(p => p.status === targetStatus.value)
)
const unsoldList = computed(() => warehouse.unsoldProducts)

// Sales for a specific day
const daySales = computed(() =>
  accounting.sales.filter(s => {
    const d = new Date(s.saleTime)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` === props.date
  })
)

function getStock(productId) {
  return warehouse.getBatchTotal(productId)
}

function openSell(product) {
  sellingTarget.value = product
  showSell.value = true
}

function openManage(product) {
  manageTarget.value = product
  manageStock.value = warehouse.getBatchTotal(product.id)
  delistQty.value = 1
  splitQty.value = 1
  splitCost.value = 0
  splitPrice.value = product.sellingPrice || 0
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

async function doDelist() {
  const qty = delistQty.value
  if (qty <= 0 || qty > manageStock.value) return
  await warehouse.reduceProductStock(manageTarget.value.id, qty)
  await warehouse.init()
  showManage.value = false
  manageTarget.value = null
}

async function doSplit() {
  const qty = splitQty.value
  if (qty <= 0 || qty > manageStock.value) return
  await warehouse.splitProduct(manageTarget.value.id, qty, Number(splitCost.value), Number(splitPrice.value))
  await warehouse.init()
  showManage.value = false
  manageTarget.value = null
}

async function handleAddUnsold() {
  if (selectedUnsold.value.length === 0) return
  for (const productId of selectedUnsold.value) {
    await warehouse.updateProduct(productId, { status: targetStatus.value })
  }
  selectedUnsold.value = []
  showAddUnsold.value = false
  // Force refresh products to update selling list
  await warehouse.init()
}
</script>
