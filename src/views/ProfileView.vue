<template>
  <div class="page">
    <!-- 日历方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">📅</span>
        日历
      </div>
      <div class="module-box__body--no-padding">
        <DiaryCalendar @select-date="selectDate" />
      </div>
    </div>

    <!-- 今日日记方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">✏️</span>
        日记 · {{ selectedDate }}
      </div>
      <div class="module-box__body--no-padding">
        <DiaryEditor :date="selectedDate" @view="viewDiary" @saved="onSaved" />
      </div>
    </div>

    <!-- 数据管理方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">💾</span>
        数据管理
      </div>
      <div class="module-box__body">
        <div style="display:flex;gap:8px">
          <button class="btn btn--cute" style="flex:1" @click="backupData">
            <IconDownload :size="16" />
            <span style="margin-left:4px">备份</span>
          </button>
          <button class="btn btn--ghost" style="flex:1" @click="triggerRestore">
            <IconUpload :size="16" />
            <span style="margin-left:4px">恢复</span>
          </button>
        </div>
        <div v-if="storageInfo" style="text-align:center;margin-top:8px;font-size:12px;color:var(--color-text-hint);line-height:1.8">
          📦 已用 <b style="color:var(--color-pink)">{{ storageInfo.usedFormatted }}</b> / 可用 <b>{{ storageInfo.totalFormatted }}</b>
          <br v-if="storageInfo.isPWA" />{{ storageInfo.tip }}
        </div>
      </div>
    </div>

    <DiaryViewer v-model="showViewer" :entry="viewingEntry" />
    <input ref="restoreInput" type="file" accept=".json" style="display:none" @change="restoreData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DiaryCalendar from '../components/profile/DiaryCalendar.vue'
import DiaryEditor from '../components/profile/DiaryEditor.vue'
import DiaryViewer from '../components/profile/DiaryViewer.vue'
import { IconDownload, IconUpload } from '../icons/index.js'
import { useProfileStore } from '../stores/profile.js'
import { today } from '../utils/date.js'
import { exportAllData, downloadJSON, readJSONFile, importAllData, estimateStorageUsage } from '../utils/export.js'
import { formatStorageSize } from '../utils/image.js'

const store = useProfileStore()
const selectedDate = ref(today())
const showViewer = ref(false)
const viewingEntry = ref(null)
const restoreInput = ref(null)
const storageInfo = ref(null)

onMounted(async () => {
  await store.init()
  const usage = await estimateStorageUsage()
  if (usage) {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone
    storageInfo.value = {
      usedFormatted: formatStorageSize(usage.used),
      totalFormatted: formatStorageSize(usage.total),
      isPWA,
      tip: isPWA ? '✅ PWA模式，存储空间充裕' : '💡 添加到主屏幕可获得更大存储空间'
    }
  }
})

function selectDate(date) {
  selectedDate.value = date
}

function viewDiary(entry) {
  viewingEntry.value = entry
  showViewer.value = true
}

async function onSaved() {
  const usage = await estimateStorageUsage()
  if (usage) {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone
    storageInfo.value = {
      usedFormatted: formatStorageSize(usage.used),
      totalFormatted: formatStorageSize(usage.total),
      isPWA,
      tip: isPWA ? '✅ PWA模式，存储空间充裕' : '💡 添加到主屏幕可获得更大存储空间'
    }
  }
}

async function backupData() {
  const data = await exportAllData()
  downloadJSON(data, `小妮管家备份_${today()}.json`)
}

function triggerRestore() {
  restoreInput.value?.click()
}

async function restoreData(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    const data = await readJSONFile(file)
    if (!confirm('恢复数据将覆盖当前所有数据，确定继续？')) return
    await importAllData(data)
    alert('数据恢复成功！请刷新页面。')
    location.reload()
  } catch (err) {
    alert('恢复失败：' + err.message)
  }
}
</script>
