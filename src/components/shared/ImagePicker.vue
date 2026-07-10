<template>
  <div class="image-picker" @click="pickImage">
    <img v-if="modelValue" :src="modelValue" class="image-picker__preview" alt="preview" />
    <div v-else class="image-picker__placeholder">
      <component :is="IconCamera" :size="32" />
      <span style="font-size: 12px">{{ placeholder }}</span>
    </div>
  </div>
</template>

<script setup>
import { IconCamera } from '../../icons/index.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '点击上传图片' }
})

const emit = defineEmits(['update:modelValue'])

function pickImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    emit('select', file)
  }
  input.click()
}
</script>
