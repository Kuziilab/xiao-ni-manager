<template>
  <div class="page">
    <SearchBar v-model="searchQuery" placeholder="🔍 搜索商品" />

    <!-- 录入方框 -->
    <div class="module-box">
      <button class="list-item--card" style="width:100%;border:none;margin:0" @click="showAddMenu = true">
        <img :src="img5" class="entry-icon" alt="录入" />
        <div class="list-item__content">
          <div class="list-item__title">录入商品</div>
          <div class="list-item__subtitle">添加新商品或新分类</div>
        </div>
        <IconArrowRight class="list-item__arrow" />
      </button>
    </div>

    <!-- 状态筛选方框 -->
    <div class="module-box">
      <div class="module-box__body--no-padding">
        <StatusFilter v-model="activeStatus" />
      </div>
    </div>

    <!-- 排序 -->
    <SortFilterBar v-model="sortOptions" @toggle="toggleSort" />

    <!-- 商品列表方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <img :src="img6" class="list-deco-icon" alt="" />
        商品列表
        <button style="margin-left:8px;font-size:11px;color:var(--color-pink);padding:4px 10px;border-radius:var(--radius-xs);background:var(--color-pink-light);min-height:30px" @click.stop="openStats" @touchend.prevent.stop="openStats">统计</button>
        <span v-if="activeCategory" class="cute-badge cute-badge--pink" style="margin-left:4px">
          {{ activeCategoryName }}
          <button style="margin-left:2px;font-size:11px;line-height:1" @click.stop="activeCategory = ''">✕</button>
        </span>
        <span style="margin-left:auto;display:flex;align-items:center;gap:8px">
          <span class="mode-toggle">
            <button class="mode-toggle__btn" :class="{ 'mode-toggle__btn--active': viewMode === 'grid' }" @click.stop="viewMode = 'grid'" title="大图">▦</button>
            <button class="mode-toggle__btn" :class="{ 'mode-toggle__btn--active': viewMode === 'list' }" @click.stop="viewMode = 'list'" title="列表">☰</button>
          </span>
          <button style="display:flex;align-items:center;gap:2px;font-size:12px;color:var(--color-text-secondary)" @click.stop="showCategoryPicker = true">
            <IconFolder :size="14" />
            分类
          </button>
          <span style="font-size:12px;color:var(--color-text-hint)">{{ filteredProducts.length }}件</span>
        </span>
      </div>
      <div class="module-box__body--no-padding">
        <!-- 网格模式 -->
        <div v-if="filteredProducts.length && viewMode === 'grid'" class="product-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="openEdit(product)"
          />
        </div>
        <!-- 列表模式 -->
        <div v-else-if="filteredProducts.length && viewMode === 'list'">
          <div v-for="product in filteredProducts" :key="product.id" class="product-list-item" @click="openEdit(product)">
            <img v-if="product.imageBase64" :src="product.imageBase64" class="product-list-item__thumb" />
            <div v-else class="product-list-item__thumb" style="display:flex;align-items:center;justify-content:center;color:var(--color-text-hint)">
              <IconImage :size="24" />
            </div>
            <div class="product-list-item__info">
              <div class="product-list-item__name">{{ product.name }}</div>
              <div class="product-list-item__meta">
                成本¥{{ getAvgCost(product.id) }} · 库存{{ getStock(product.id) }}件 · <span class="cute-badge cute-badge--pink" style="font-size:10px">{{ statusLabel(product.status) }}</span>
              </div>
            </div>
            <div class="product-list-item__price">¥{{ product.sellingPrice }}</div>
          </div>
        </div>
        <EmptyState v-else message="还没有商品哦～" action="点击录入" @action="showAddMenu = true" />
      </div>
    </div>

    <!-- 商品详情面板 -->
    <BottomSheet v-model="showProductActions" :title="selectedProduct?.name" maxHeight="90vh">
      <!-- 操作按钮 -->
      <div style="display:flex;gap:8px;padding:0 16px 12px">
        <button class="btn btn--cute" style="flex:1;font-size:13px" @click="openEditBatch">
          <IconEdit :size="14" /> 本批信息更改
        </button>
        <button class="btn btn--cute" style="flex:1;font-size:13px" @click="openNewBatch">
          <IconAdd :size="14" /> 新批次录入
        </button>
      </div>

      <!-- 商品属性 -->
      <div v-if="selectedProduct" style="padding:0 16px">
        <div v-if="selectedProduct.imageBase64" style="text-align:center;margin-bottom:12px">
          <img :src="selectedProduct.imageBase64" style="width:120px;height:120px;border-radius:var(--radius-sm);object-fit:cover" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:14px">
          <div style="color:var(--color-text-secondary)">名称</div><div style="font-weight:500">{{ selectedProduct.name }}</div>
          <div style="color:var(--color-text-secondary)">售价</div><div style="font-weight:500">¥{{ selectedProduct.sellingPrice }}</div>
          <div style="color:var(--color-text-secondary)">库存</div><div style="font-weight:500">{{ detailStock }} 件</div>
          <div style="color:var(--color-text-secondary)">状态</div>
          <div><span class="cute-badge" :class="'cute-badge--' + detailBadgeColor">{{ detailStatus }}</span></div>
          <div style="color:var(--color-text-secondary)">分类</div><div style="font-weight:500">{{ detailCategory }}</div>
          <div style="color:var(--color-text-secondary)">上架时间</div><div style="font-weight:500">{{ detailListingTime }}</div>
          <div style="color:var(--color-text-secondary)">售出时间</div><div style="font-weight:500">{{ detailSoldTime }}</div>
        </div>

        <!-- 批次记录 -->
        <div v-if="detailBatches.length" style="margin-top:16px;border-top:1px solid var(--color-separator);padding-top:12px">
          <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:8px">📦 入库批次记录</div>
          <div v-for="b in detailBatches" :key="b.id" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:0.5px solid var(--color-separator)">
            <span>{{ formatDate(b.entryTime) }}</span>
            <span>成本 ¥{{ b.unitCost }} × {{ b.quantity }}</span>
            <span :style="{color: b.remainingQuantity > 0 ? 'var(--color-success)' : 'var(--color-text-hint)'}">剩 {{ b.remainingQuantity }}</span>
          </div>
        </div>
      </div>
    </BottomSheet>

    <AddMenu v-model="showAddMenu" @new-product="openNewProduct" @new-category="openNewCategory" />
    <ProductForm v-model="showProductForm" :product="editingProduct" :mode="formMode" @save="handleSave" />
    <CategoryForm v-model="showCategoryForm" @save="handleCategorySave" />

    <!-- 分类筛选弹窗 -->
    <BottomSheet v-model="showCategoryPicker" title="筛选分类">
      <button class="list-item" @click="selectCategory('')">
        <div class="list-item__content">
          <span class="list-item__title" :style="!activeCategory ? {color:'var(--color-pink)',fontWeight:'600'} : {}">全部商品</span>
        </div>
        <IconCheck v-if="!activeCategory" :size="18" style="color:var(--color-pink)" />
      </button>
      <button v-for="cat in store.categories" :key="cat.id" class="list-item" @click="selectCategory(cat.id)">
        <div class="list-item__icon" style="background:var(--color-pink-light);border-radius:var(--radius-full)">
          <IconTag :size="16" />
        </div>
        <div class="list-item__content">
          <span class="list-item__title" :style="activeCategory===cat.id ? {color:'var(--color-pink)',fontWeight:'600'} : {}">{{ cat.name }}</span>
        </div>
        <IconCheck v-if="activeCategory===cat.id" :size="18" style="color:var(--color-pink)" />
      </button>
    </BottomSheet>

    <!-- 统计弹窗 -->
    <BottomSheet v-model="showStats" title="仓库统计">
      <div style="padding:0 16px">
        <div v-for="(stat, status) in store.statsByStatus" :key="status" style="padding:10px 0;border-bottom:0.5px solid var(--color-separator)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="cute-badge" :class="'cute-badge--' + statBadgeColor(status)">{{ statusLabel(status) }}</span>
            <span style="font-size:13px;font-weight:600">{{ stat.count }}种 · 库存{{ stat.totalStock }}件</span>
          </div>
          <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">总成本 ¥{{ stat.totalCost.toFixed(2) }} · 总售价 ¥{{ stat.totalSellingPrice.toFixed(2) }}</div>
        </div>
        <div v-if="store.supplies.length" style="padding:10px 0;border-top:2px solid var(--color-pink);margin-top:4px;font-size:13px;font-weight:600">🧷 物资总开销: ¥{{ store.suppliesTotalCost.toFixed(2) }}</div>
      </div>
    </BottomSheet>

    <!-- 物资清单 -->
    <div class="module-box">
      <div class="module-box__header">🧷 物资清单 <span style="margin-left:auto;font-size:12px;color:var(--color-text-hint)">总 ¥{{ store.suppliesTotalCost.toFixed(2) }}</span></div>
      <div class="module-box__body--no-padding">
        <div v-if="store.supplies.length===0" style="padding:16px;text-align:center;color:var(--color-text-hint);font-size:13px">暂无物资</div>
        <div v-for="s in store.supplies" :key="s.id" class="product-list-item">
          <img v-if="s.imageBase64" :src="s.imageBase64" class="product-list-item__thumb" />
          <div v-else class="product-list-item__thumb" style="display:flex;align-items:center;justify-content:center;color:var(--color-text-hint);background:var(--color-bg)">🧷</div>
          <div class="product-list-item__info"><div class="product-list-item__name">{{ s.name }}</div><div class="product-list-item__meta">¥{{ s.unitPrice }} × {{ s.quantity }} = ¥{{ s.totalPrice }}</div></div>
          <button style="color:var(--color-text-hint);font-size:11px" @click="store.deleteSupply(s.id)">删</button>
        </div>
        <div style="padding:8px 16px"><button class="btn-icon" style="color:var(--color-pink);font-size:13px" @click="showSupplyForm=!showSupplyForm"><IconAdd :size="16"/> 添加物资</button></div>
        <div v-if="showSupplyForm" style="padding:0 16px 12px">
          <ImagePicker :modelValue="supplyForm.imageBase64" @select="onSupplyImage" placeholder="物资图片" />
          <input class="form-input" v-model="supplyForm.name" placeholder="物资名称" style="margin-top:8px" />
          <div style="display:flex;gap:8px;margin-top:8px"><input class="form-input" v-model.number="supplyForm.quantity" type="number" placeholder="数量" style="flex:1" /><div class="price-input-wrapper" style="flex:1"><input class="form-input" v-model.number="supplyForm.unitPrice" type="number" step="0.01" placeholder="单价" /></div></div>
          <button class="btn btn--cute" style="width:100%;margin-top:8px" @click="addSupply">记录物资</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useWarehouseStore } from '../stores/warehouse.js'
import SearchBar from '../components/warehouse/SearchBar.vue'
import StatusFilter from '../components/warehouse/StatusFilter.vue'
import SortFilterBar from '../components/warehouse/SortFilterBar.vue'
import ProductCard from '../components/warehouse/ProductCard.vue'
import AddMenu from '../components/warehouse/AddMenu.vue'
import ProductForm from '../components/warehouse/ProductForm.vue'
import CategoryForm from '../components/warehouse/CategoryForm.vue'
import EmptyState from '../components/shared/EmptyState.vue'
import BottomSheet from '../components/shared/BottomSheet.vue'
import ImagePicker from '../components/shared/ImagePicker.vue'
import { IconAdd, IconArrowRight, IconFolder, IconTag, IconCheck, IconEdit, IconImage } from '../icons/index.js'
import { PRODUCT_STATUS } from '../utils/constants.js'
import { formatDate } from '../utils/date.js'
import { compressImage } from '../utils/image.js'

const BASE = import.meta.env.BASE_URL
const img5 = `${BASE}images/5.jpg`
const img6 = `${BASE}images/6.jpg`

const store = useWarehouseStore()
const searchQuery = ref('')
const activeStatus = ref('')
const activeCategory = ref('')
const showCategoryPicker = ref(false)
const sortOptions = ref({ field: 'updatedAt', order: 'desc' })
const showAddMenu = ref(false)
const showProductForm = ref(false)
const showProductActions = ref(false)
const showCategoryForm = ref(false)
const editingProduct = ref(null)
const selectedProduct = ref(null)
import { useViewMode } from '../composables/useViewMode.js'

const formMode = ref('edit') // 'edit' | 'new-batch'
const { viewMode } = useViewMode()

function getStock(productId) { return store.getBatchTotal(productId) }
function getAvgCost(productId) {
  const bs = store.batches.filter(b => b.productId === productId)
  if (!bs.length) return 0
  const total = bs.reduce((s, b) => s + b.unitCost * b.remainingQuantity, 0)
  const stock = getStock(productId)
  return stock > 0 ? Math.round(total / stock * 100) / 100 : 0
}
function statusLabel(s) { return PRODUCT_STATUS[s]?.label || '未知' }
function statBadgeColor(s) { if (s==='sold') return 'green'; if (s==='pending-listing') return 'orange'; return 'pink' }

// 统计
const showStats = ref(false)
function openStats() { showStats.value = true }

// 物资
const showSupplyForm = ref(false)
const supplyForm = reactive({ name:'', imageBase64:'', quantity:1, unitPrice:0 })
async function onSupplyImage(file) { const b = await compressImage(file); if (b) supplyForm.imageBase64 = b }
async function addSupply() {
  if (!supplyForm.name.trim()) return
  await store.addSupply({...supplyForm})
  supplyForm.name = ''; supplyForm.imageBase64 = ''; supplyForm.quantity = 1; supplyForm.unitPrice = 0
  showSupplyForm.value = false
}

onMounted(async () => {
  await store.init()
})

const activeCategoryName = computed(() => {
  if (!activeCategory.value) return ''
  const cat = store.categories.find(c => c.id === activeCategory.value)
  return cat ? cat.name : ''
})

const filteredProducts = computed(() => {
  let result = store.filteredProducts(activeStatus.value, searchQuery.value, sortOptions.value)
  if (activeCategory.value) {
    result = result.filter(p => p.categoryId === activeCategory.value)
  }
  return result
})

function selectCategory(id) {
  activeCategory.value = id
  showCategoryPicker.value = false
}

async function openEdit(product) {
  selectedProduct.value = product
  detailBatches.value = await store.getProductBatches(product.id)
  detailStock.value = store.getBatchTotal(product.id)
  showProductActions.value = true
}

// 商品详情计算属性
const detailBatches = ref([])
const detailStock = ref(0)
const detailStatus = computed(() => selectedProduct.value ? (PRODUCT_STATUS[selectedProduct.value.status]?.label || '未知') : '')
const detailBadgeColor = computed(() => {
  const s = selectedProduct.value?.status
  if (s === 'sold') return 'green'
  if (s === 'pending-listing') return 'orange'
  return 'pink'
})
const detailCategory = computed(() => {
  if (!selectedProduct.value?.categoryId) return '无'
  const cat = store.categories.find(c => c.id === selectedProduct.value.categoryId)
  return cat?.name || '无'
})
const detailListingTime = computed(() => selectedProduct.value?.listingTime ? formatDate(selectedProduct.value.listingTime) : '未上架')
const detailSoldTime = computed(() => selectedProduct.value?.soldTime ? formatDate(selectedProduct.value.soldTime) : '待售')

function toggleSort(field) {
  if (sortOptions.value.field === field) {
    sortOptions.value = { field, order: sortOptions.value.order === 'asc' ? 'desc' : 'asc' }
  } else {
    sortOptions.value = { field, order: 'desc' }
  }
}

function openNewProduct() {
  editingProduct.value = null
  showProductForm.value = true
  showAddMenu.value = false
}

function openEditBatch() {
  editingProduct.value = { ...selectedProduct.value }
  formMode.value = 'edit'
  showProductActions.value = false
  showProductForm.value = true
}

function openNewBatch() {
  editingProduct.value = { ...selectedProduct.value }
  formMode.value = 'new-batch'
  showProductActions.value = false
  showProductForm.value = true
}

function openNewCategory() {
  showCategoryForm.value = true
  showAddMenu.value = false
}

async function handleSave(formData) {
  if (formMode.value === 'new-batch') {
    // 新批次录入：创建全新的独立商品，不关联原商品
    await store.addProduct(formData)
  } else if (editingProduct.value?.id) {
    // 本批更改：更新原商品信息
    await store.updateProduct(editingProduct.value.id, formData)
    const qty = Number(formData.quantity)
    const cost = Number(formData.unitCost)
    if (qty > 0 && cost >= 0) {
      await store.addBatch(editingProduct.value.id, { quantity: qty, unitCost: cost })
    }
  } else {
    // 新建商品
    await store.addProduct(formData)
  }
  showProductForm.value = false
  editingProduct.value = null
  selectedProduct.value = null
}

async function handleCategorySave(name) {
  await store.addCategory(name)
  showCategoryForm.value = false
}
</script>
