<template>
    <component :is="assetsStore.view" />
</template>

<script setup lang="ts">
import { useAssetsStore } from '@/stores/assets';

const assetsStore = useAssetsStore()
</script>

<style scoped></style>