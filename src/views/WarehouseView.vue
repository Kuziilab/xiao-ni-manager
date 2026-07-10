<template>
  <div class="page">
    <SearchBar v-model="searchQuery" placeholder="🔍 搜索商品" />

    <!-- 录入方框 -->
    <div class="module-box">
      <button class="list-item--card" style="width:100%;border:none;margin:0" @click="showAddMenu = true">
        <div class="list-item__icon" style="background: var(--color-pink-gradient); color: #fff; border-radius: var(--radius-full)">
          <IconAdd :size="22" />
        </div>
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
        <span class="kawaii-deco">🧸</span>
        商品列表
        <span style="margin-left:auto;font-size:12px;color:var(--color-text-hint)">{{ filteredProducts.length }}件</span>
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

    <AddMenu v-model="showAddMenu" @new-product="openNewProduct" @new-category="openNewCategory" />
    <ProductForm v-model="showProductForm" :product="editingProduct" @save="handleSave" />
    <CategoryForm v-model="showCategoryForm" @save="handleCategorySave" />
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
import { IconAdd, IconArrowRight } from '../icons/index.js'

const store = useWarehouseStore()
const searchQuery = ref('')
const activeStatus = ref('')
const sortOptions = ref({ field: 'updatedAt', order: 'desc' })
const showAddMenu = ref(false)
const showProductForm = ref(false)
const showCategoryForm = ref(false)
const editingProduct = ref(null)

onMounted(async () => {
  await store.init()
})

const filteredProducts = computed(() => {
  return store.filteredProducts(activeStatus.value, searchQuery.value, sortOptions.value)
})

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
  editingProduct.value = { ...product }
  showProductForm.value = true
}

function openNewCategory() {
  showCategoryForm.value = true
  showAddMenu.value = false
}

async function handleSave(formData) {
  if (editingProduct.value?.id) {
    await store.updateProduct(editingProduct.value.id, formData)
  } else {
    await store.addProduct(formData)
  }
  showProductForm.value = false
  editingProduct.value = null
}

async function handleCategorySave(name) {
  await store.addCategory(name)
  showCategoryForm.value = false
}
</script>
