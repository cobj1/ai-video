<template>
    <div>
        <timeline-tool></timeline-tool>
        <div class="ml-10" style="overflow: auto;">
            <timeline-scale class="mt-1" :zoom="timelineToolStore.timelineScaleZoomThrottled"></timeline-scale>
            <v-container max-width="100%" min-height="300px">
            </v-container>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTimelineToolStore } from '@/stores/editor/timeline-tool';

const timelineToolStore = useTimelineToolStore()
</script>

<style scoped></style>