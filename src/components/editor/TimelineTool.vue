<template>
    <div class="d-flex justify-space-between w-100" style="height: 30px; border-bottom: 1px solid #000;">
        <div>
            {{ timelineScaleStore.zoom }}
        </div>
        <v-slider v-model="timelineScaleStore.zoom" thumb-label :max="100" :min="1" :step="1" max-width="1000px"
            density="compact" size="small" hide-details></v-slider>
    </div>
</template>

<script setup lang="ts">
import { useTimelineScaleStore } from '@/stores/editor/timeline-scale';

const timelineScaleStore = useTimelineScaleStore()

</script>

<style scoped></style>