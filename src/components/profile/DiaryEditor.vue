<template>
  <div style="padding: 0 16px 16px">
    <textarea
      class="form-textarea"
      v-model="content"
      placeholder="记录今天的想法..."
      style="margin-bottom: 8px; min-height: 120px"
    />

    <div v-if="images.length" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px">
      <div v-for="(img, i) in images" :key="i" style="width: 80px; height: 80px; border-radius: 8px; overflow: hidden; position: relative">
        <img :src="img" style="width: 100%; height: 100%; object-fit: cover" />
        <button
          style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.5); color: #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px"
          @click="images.splice(i, 1)"
        >
          ✕
        </button>
      </div>
    </div>

    <div style="display: flex; gap: 8px">
      <button class="btn btn--ghost" style="flex: 1" @click="addImage">
        <IconCamera :size="16" />
        <span style="margin-left: 4px; font-size: 13px">添加图片</span>
      </button>
      <button class="btn btn--primary" style="flex: 1" @click="save" :disabled="saving">
        {{ saving ? '保存中...' : '保存日记' }}
      </button>
    </div>

    <!-- View past entries -->
    <div v-if="pastEntries.length" style="margin-top: 16px">
      <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 8px">
        历史日记
      </div>
      <div
        v-for="entry in pastEntries"
        :key="entry.id"
        style="padding: 8px 0; border-bottom: 0.5px solid var(--color-separator); cursor: pointer"
        @click="$emit('view', entry)"
      >
        <div style="font-size: 14px; font-weight: 500">{{ entry.date }}</div>
        <div style="font-size: 13px; color: var(--color-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
          {{ entry.content?.slice(0, 50) || '（无文字）' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { IconCamera } from '../../icons/index.js'
import { useProfileStore } from '../../stores/profile.js'
import { compressDiaryImage } from '../../utils/image.js'
import { today } from '../../utils/date.js'

const props = defineProps({
  date: { type: String, default: () => today() }
})

const emit = defineEmits(['view', 'saved'])
const store = useProfileStore()
const content = ref('')
const images = ref([])
const saving = ref(false)

onMounted(async () => {
  await store.init()
  await loadDiary()
})

watch(() => props.date, async () => {
  await loadDiary()
})

const pastEntries = computed(() =>
  store.diaries
    .filter(d => d.date < today())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)
)

async function loadDiary() {
  const entry = await store.getDiary(props.date)
  content.value = entry?.content || ''
  images.value = entry?.images || []
}

async function save() {
  saving.value = true
  try {
    await store.saveDiary(props.date, content.value, images.value)
    emit('saved')
  } finally {
    saving.value = false
  }
}

function addImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = async (e) => {
    for (const file of e.target.files) {
      const base64 = await compressDiaryImage(file)
      if (base64) images.value.push(base64)
    }
  }
  input.click()
}
</script>
