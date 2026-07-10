<template>
  <div class="page">
    <SectionHeader>今日小目标</SectionHeader>
    <DailyGoalSection />
    <SectionHeader>今日正售</SectionHeader>
    <TodaySellingSection />
    <SectionHeader>长期目标</SectionHeader>
    <LongTermGoalSection />
  </div>
</template>

<script setup>
import DailyGoalSection from '../components/notes/DailyGoalSection.vue'
import LongTermGoalSection from '../components/notes/LongTermGoalSection.vue'
import TodaySellingSection from '../components/notes/TodaySellingSection.vue'
import SectionHeader from '../components/layout/SectionHeader.vue'
</script>
