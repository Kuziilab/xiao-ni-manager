<template>
  <ModalDialog
    :modelValue="modelValue"
    title="新分类"
    confirmText="添加"
    @update:modelValue="$emit('update:modelValue', $event)"
    @confirm="submit"
    @cancel="$emit('update:modelValue', false)"
  >
    <div style="text-align: left">
      <label class="form-label">分类名称</label>
      <input
        class="form-input"
        v-model="name"
        placeholder="例如：手链、项链、耳饰"
        style="margin-bottom: 0"
        ref="inputRef"
      />
    </div>
  </ModalDialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalDialog from '../shared/ModalDialog.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'save'])
const name = ref('')
const inputRef = ref(null)

watch(() => props.modelValue, (val) => {
  if (val) {
    name.value = ''
    setTimeout(() => inputRef.value?.focus(), 100)
  }
})

function submit() {
  if (!name.value.trim()) return
  emit('save', name.value.trim())
  emit('update:modelValue', false)
}
</script>
