<template>
  <div class="page">
    <SearchBar v-model="searchQuery" placeholder="搜索商品" />
    <StatusFilter v-model="activeStatus" />
    <SortFilterBar v-model="sortOptions" />
    <SectionHeader>商品列表</SectionHeader>
    <div v-if="filteredProducts.length" class="product-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @click="openEdit(product)"
      />
    </div>
    <EmptyState v-else message="还没有商品，点击录入开始吧" action="录入商品" @action="showAddMenu = true" />
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
import SectionHeader from '../components/layout/SectionHeader.vue'
import EmptyState from '../components/shared/EmptyState.vue'

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
