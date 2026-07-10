<template>
  <div class="list-group">
    <div v-if="todayGoals.length === 0" style="padding:16px;text-align:center;color:var(--color-text-hint);font-size:14px">
      暂无今日目标
    </div>
    <GoalItem
      v-for="goal in todayGoals"
      :key="goal.id"
      :goal="goal"
      @toggle="store.toggleGoal(goal.id)"
      @cancel="store.cancelGoal(goal.id)"
    />
    <div style="padding: 8px 16px">
      <button class="btn-icon" style="color: var(--color-text-secondary)" @click="showAdd = !showAdd">
        <IconAdd :size="16" />
        <span style="font-size: 13px">添加目标</span>
      </button>
    </div>

    <div v-if="showAdd" style="padding: 0 16px 12px">
      <input class="form-input" v-model="newName" placeholder="目标名称" style="margin-bottom: 8px" />
      <div style="display:flex;gap:8px">
        <input class="form-input" v-model="newTime" placeholder="时间（可选）" style="flex:1" />
        <input class="form-input" v-model="newLocation" placeholder="地点（可选）" style="flex:1" />
      </div>
      <button class="btn btn--primary" style="width:100%;margin-top:8px" @click="add">确定</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GoalItem from './GoalItem.vue'
import { IconAdd } from '../../icons/index.js'
import { useNotesStore } from '../../stores/notes.js'
import { today } from '../../utils/date.js'

const store = useNotesStore()
const showAdd = ref(false)
const newName = ref('')
const newTime = ref('')
const newLocation = ref('')

const todayGoals = computed(() =>
  store.goals.filter(g => g.type === 'daily' && g.date === today() && !g.cancelled)
)

onMounted(async () => {
  await store.init()
})

async function add() {
  if (!newName.value.trim()) return
  await store.addGoal({
    type: 'daily',
    name: newName.value,
    time: newTime.value || null,
    location: newLocation.value || null,
    date: today()
  })
  newName.value = ''
  newTime.value = ''
  newLocation.value = ''
  showAdd.value = false
}
</script>
