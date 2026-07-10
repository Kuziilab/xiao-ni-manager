<template>
  <div class="page">
    <!-- 今日小目标方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">⭐</span>
        今日小目标
      </div>
      <div class="module-box__body--no-padding">
        <DailyGoalSection />
      </div>
    </div>

    <!-- 今日正售方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">🛍️</span>
        今日正售
      </div>
      <div class="module-box__body--no-padding">
        <TodaySellingSection />
      </div>
    </div>

    <!-- 长期目标方框 -->
    <div class="module-box">
      <div class="module-box__header">
        <span class="kawaii-deco">🎯</span>
        长期目标
      </div>
      <div class="module-box__body--no-padding">
        <LongTermGoalSection />
      </div>
    </div>
  </div>
</template>

<script setup>
import DailyGoalSection from '../components/notes/DailyGoalSection.vue'
import LongTermGoalSection from '../components/notes/LongTermGoalSection.vue'
import TodaySellingSection from '../components/notes/TodaySellingSection.vue'
</script>
