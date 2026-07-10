<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal">
        <div class="modal__body">
          <slot />
        </div>
        <div class="modal__actions">
          <button v-if="showCancel" @click="$emit('cancel')" style="color: var(--color-text-secondary)">
            {{ cancelText }}
          </button>
          <button
            v-if="showConfirm"
            @click="$emit('confirm')"
            :style="{ color: confirmColor }"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  showCancel: { type: Boolean, default: true },
  showConfirm: { type: Boolean, default: true },
  cancelText: { type: String, default: '取消' },
  confirmText: { type: String, default: '确定' },
  confirmColor: { type: String, default: 'var(--color-pink)' }
})

defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>
