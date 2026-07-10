<template>
  <div class="list-group">
    <div style="padding: 8px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between" @click="expanded = !expanded">
      <span style="font-size: 14px; color: var(--color-text-secondary)">长期目标 ({{ longTermGoals.length }})</span>
      <span style="font-size: 12px; color: var(--color-text-hint)">{{ expanded ? '收起' : '展开' }}</span>
    </div>

    <div v-if="expanded">
      <GoalItem
        v-for="goal in longTermGoals"
        :key="goal.id"
        :goal="goal"
        @toggle="store.toggleGoal(goal.id)"
        @cancel="store.cancelGoal(goal.id)"
      />

      <!-- Add form -->
      <div style="padding: 8px 16px">
        <button class="btn-icon" style="color: var(--color-text-secondary)" @click="showAdd = !showAdd">
          <IconAdd :size="16" />
          <span style="font-size: 13px">添加长期目标</span>
        </button>
      </div>

      <div v-if="showAdd" style="padding: 0 16px 12px">
        <input class="form-input" v-model="newName" placeholder="目标名称" style="margin-bottom:8px" />
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <input class="form-input" type="date" v-model="newStart" style="flex:1" />
          <input class="form-input" type="date" v-model="newEnd" style="flex:1" />
        </div>
        <button class="btn btn--primary" style="width:100%" @click="add">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GoalItem from './GoalItem.vue'
import { IconAdd } from '../../icons/index.js'
import { useNotesStore } from '../../stores/notes.js'

const store = useNotesStore()
const expanded = ref(false)
const showAdd = ref(false)
const newName = ref('')
const newStart = ref('')
const newEnd = ref('')

const longTermGoals = computed(() =>
  store.goals.filter(g => g.type === 'long-term' && !g.cancelled)
)

async function add() {
  if (!newName.value.trim()) return
  await store.addGoal({
    type: 'long-term',
    name: newName.value,
    startDate: newStart.value || null,
    endDate: newEnd.value || null
  })
  newName.value = ''
  newStart.value = ''
  newEnd.value = ''
  showAdd.value = false
}
</script>
