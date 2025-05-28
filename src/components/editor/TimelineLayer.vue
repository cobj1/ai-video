<template>
    <v-sheet height="100%" :width="timelineScaleStore.width">
        <slot></slot>
    </v-sheet>

</template>

<script setup lang="ts">
import { useTimelineScaleStore } from '@/stores/editor/timeline-scale';

const timelineScaleStore = useTimelineScaleStore()

</script>

<style scoped></style>