<template>
  <div class="page">
    <PeriodStats />
    <SectionHeader>售出明细</SectionHeader>
    <SalesBreakdown />
    <SectionHeader>自定义收支</SectionHeader>
    <TransactionForm />
  </div>
</template>

<script setup>
import PeriodStats from '../components/accounting/PeriodStats.vue'
import SalesBreakdown from '../components/accounting/SalesBreakdown.vue'
import TransactionForm from '../components/accounting/TransactionForm.vue'
import SectionHeader from '../components/layout/SectionHeader.vue'
</script>
