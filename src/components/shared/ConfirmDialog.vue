<template>
  <ModalDialog
    :modelValue="modelValue"
    :confirmText="confirmText"
    :cancelText="cancelText"
    :confirmColor="danger ? 'var(--color-danger)' : 'var(--color-pink)'"
    @update:modelValue="$emit('update:modelValue', $event)"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
  >
    <p>{{ message }}</p>
  </ModalDialog>
</template>

<script setup>
import ModalDialog from './ModalDialog.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: '确定要执行此操作吗？' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  danger: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>
