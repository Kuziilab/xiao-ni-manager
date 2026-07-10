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
        <span v-if="activeCategory" class="cute-badge cute-badge--pink" style="margin-left:4px">
          {{ activeCategoryName }}
          <button style="margin-left:2px;font-size:11px;line-height:1" @click.stop="activeCategory = ''">✕</button>
        </span>
        <span style="margin-left:auto;display:flex;align-items:center;gap:8px">
          <button style="display:flex;align-items:center;gap:2px;font-size:12px;color:var(--color-text-secondary)" @click.stop="showCategoryPicker = true">
            <IconFolder :size="14" />
            分类
          </button>
          <span style="font-size:12px;color:var(--color-text-hint)">{{ filteredProducts.length }}件</span>
        </span>
      </div>
      <div class="module-box__body--no-padding">
        <div v-if="filteredProducts.length" class="product-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="openEdit(product)"
          />
        </div>
        <EmptyState v-else message="还没有商品哦～" action="点击录入" @action="showAddMenu = true" />
      </div>
    </div>

    <!-- 点击商品后的操作选择 -->
    <BottomSheet v-model="showProductActions" :title="selectedProduct?.name">
      <button class="list-item" @click="openEditBatch">
        <div class="list-item__icon" style="background: var(--color-pink-light); border-radius: var(--radius-full)">
          <IconEdit :size="20" />
        </div>
        <div class="list-item__content">
          <div class="list-item__title">本批信息更改</div>
          <div class="list-item__subtitle">更改名称、售价、成本、数量、状态、分类</div>
        </div>
        <IconArrowRight class="list-item__arrow" />
      </button>
      <button class="list-item" @click="openNewBatch">
        <div class="list-item__icon" style="background: var(--color-pink-light); border-radius: var(--radius-full)">
          <IconAdd :size="20" />
        </div>
        <div class="list-item__content">
          <div class="list-item__title">新批次录入</div>
          <div class="list-item__subtitle">为同一商品追加入库，生成新批次</div>
        </div>
        <IconArrowRight class="list-item__arrow" />
      </button>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
import { IconAdd, IconArrowRight, IconFolder, IconTag, IconCheck, IconEdit } from '../icons/index.js'

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
const formMode = ref('edit') // 'edit' | 'new-batch'

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

function openEdit(product) {
  selectedProduct.value = product
  showProductActions.value = true
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
  if (editingProduct.value?.id) {
    // 先更新产品基本信息
    await store.updateProduct(editingProduct.value.id, formData)

    const qty = Number(formData.quantity)
    const cost = Number(formData.unitCost)

    if (formMode.value === 'new-batch') {
      // 新批次录入：必须有数量和成本
      if (qty > 0 && cost >= 0) {
        await store.addBatch(editingProduct.value.id, { quantity: qty, unitCost: cost })
      }
    } else {
      // 本批更改：如果填了数量和成本也追加入库
      if (qty > 0 && cost >= 0) {
        await store.addBatch(editingProduct.value.id, { quantity: qty, unitCost: cost })
      }
    }
  } else {
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
