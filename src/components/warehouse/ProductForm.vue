<template>
  <BottomSheet :modelValue="modelValue" :title="isEdit ? '编辑商品' : '新商品'" maxHeight="90vh" @update:modelValue="$emit('update:modelValue', $event)">
    <div class="form-group">
      <label class="form-label">商品图片</label>
      <ImagePicker :modelValue="form.imageBase64" @select="onImageSelect" />
    </div>

    <div class="form-group">
      <label class="form-label">商品名称 *</label>
      <input class="form-input" v-model="form.name" placeholder="输入商品名称" />
    </div>

    <div style="display: flex; gap: 12px">
      <div class="form-group" style="flex: 1">
        <label class="form-label">成本价 (元)</label>
        <div class="price-input-wrapper">
          <input class="form-input" v-model="form.unitCost" type="number" step="0.01" min="0" placeholder="0.00" />
        </div>
      </div>
      <div class="form-group" style="flex: 1">
        <label class="form-label">售价 * (元)</label>
        <div class="price-input-wrapper">
          <input class="form-input" v-model="form.sellingPrice" type="number" step="0.01" min="0" placeholder="0.00" />
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">入库数量</label>
      <input class="form-input" v-model="form.quantity" type="number" min="1" placeholder="输入入库数量" />
    </div>

    <div class="form-group">
      <label class="form-label">状态</label>
      <select class="form-select" v-model="form.status">
        <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">分类</label>
      <select class="form-select" v-model="form.categoryId">
        <option value="">-- 无分类 --</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </div>

    <button class="btn btn--primary" style="width: 100%; margin-top: 16px" @click="submit">
      {{ isEdit ? '保存修改' : '录入商品' }}
    </button>

    <button
      v-if="isEdit"
      class="btn btn--danger"
      style="width: 100%; margin-top: 12px"
      @click="showDelete = true"
    >
      删除商品
    </button>
  </BottomSheet>

  <ConfirmDialog
    v-model="showDelete"
    message="确定要删除这个商品吗？此操作不可撤销。"
    danger
    @confirm="doDelete"
  />
</template>

<script setup>
import { ref, reactive, watch, inject } from 'vue'
import BottomSheet from '../shared/BottomSheet.vue'
import ImagePicker from '../shared/ImagePicker.vue'
import ConfirmDialog from '../shared/ConfirmDialog.vue'
import { PRODUCT_STATUS_LIST } from '../../utils/constants.js'
import { compressImage } from '../../utils/image.js'
import { useWarehouseStore } from '../../stores/warehouse.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  product: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'save'])
const store = useWarehouseStore()

const isEdit = ref(false)
const showDelete = ref(false)
const statuses = PRODUCT_STATUS_LIST
const categories = ref([])
const form = reactive({
  name: '',
  imageBase64: '',
  unitCost: '',
  sellingPrice: '',
  quantity: '1',
  status: 'unsold',
  categoryId: ''
})

watch(() => props.modelValue, async (val) => {
  if (val) {
    categories.value = store.categories
    if (props.product) {
      isEdit.value = true
      form.name = props.product.name || ''
      form.imageBase64 = props.product.imageBase64 || ''
      form.sellingPrice = props.product.sellingPrice || ''
      form.status = props.product.status || 'unsold'
      form.categoryId = props.product.categoryId || ''
      form.unitCost = ''
      form.quantity = '0'
    } else {
      isEdit.value = false
      resetForm()
    }
  }
})

function resetForm() {
  form.name = ''
  form.imageBase64 = ''
  form.unitCost = ''
  form.sellingPrice = ''
  form.quantity = '1'
  form.status = 'unsold'
  form.categoryId = ''
}

async function onImageSelect(file) {
  const base64 = await compressImage(file)
  if (base64) {
    form.imageBase64 = base64
  }
}

function submit() {
  if (!form.name.trim()) {
    alert('请输入商品名称')
    return
  }
  emit('save', { ...form })
  emit('update:modelValue', false)
}

async function doDelete() {
  await store.deleteProduct(props.product.id)
  showDelete.value = false
  emit('update:modelValue', false)
}
</script>
