<template>
  <ModalDialog
    :modelValue="modelValue"
    title="确认售出"
    confirmText="确定售出"
    confirmColor="var(--color-success)"
    @update:modelValue="$emit('update:modelValue', $event)"
    @confirm="submit"
    @cancel="$emit('update:modelValue', false)"
  >
    <div style="text-align: left" v-if="product">
      <p style="font-size:14px;margin-bottom:12px;color:var(--color-text-secondary)">
        {{ product.name }}
        <span style="margin-left:8px">库存: {{ stock }}</span>
      </p>
      <div class="form-group">
        <label class="form-label">实际售出价 (元)</label>
        <div class="price-input-wrapper">
          <input class="form-input" v-model.number="form.actualPrice" type="number" step="0.01" min="0" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">售出数量</label>
        <input class="form-input" v-model.number="form.quantity" type="number" min="1" :max="stock" />
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import ModalDialog from '../shared/ModalDialog.vue'
import { useWarehouseStore } from '../../stores/warehouse.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  product: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'confirm'])
const warehouse = useWarehouseStore()
const stock = ref(0)
const form = reactive({ actualPrice: 0, quantity: 1 })

watch(() => props.modelValue, (val) => {
  if (val && props.product) {
    form.actualPrice = props.product.sellingPrice || 0
    form.quantity = 1
    stock.value = warehouse.getBatchTotal(props.product.id)
  }
})

function submit() {
  if (form.quantity <= 0) return
  if (form.quantity > stock.value) {
    alert(`库存不足（库存: ${stock.value}件）`)
    return
  }
  emit('confirm', { actualPrice: form.actualPrice, quantity: form.quantity })
}
</script>
