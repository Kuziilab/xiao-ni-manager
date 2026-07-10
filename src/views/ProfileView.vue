<template>
  <div class="page">
    <SectionHeader>日历</SectionHeader>
    <DiaryCalendar />
    <SectionHeader>今日日记</SectionHeader>
    <DiaryEditor />
  </div>
</template>

<script setup>
import DiaryCalendar from '../components/profile/DiaryCalendar.vue'
import DiaryEditor from '../components/profile/DiaryEditor.vue'
import SectionHeader from '../components/layout/SectionHeader.vue'
</script>
