<template>
    <div class="d-flex justify-space-between w-100" style="height: 30px; border-bottom: 1px solid #000;">
        <div>
            {{ timelineToolStore.timelineScaleZoom }}
        </div>
        <v-slider v-model="timelineToolStore.timelineScaleZoom" thumb-label :max="100" :min="1" :step="1" max-width="200px"
            density="compact" size="small" hide-details></v-slider>
    </div>
</template>

<script setup lang="ts">
import { useTimelineToolStore } from '@/stores/editor/timeline-tool';

const timelineToolStore = useTimelineToolStore()

</script>

<style scoped></style>