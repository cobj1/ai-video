<template>
    <div class="d-flex justify-space-between w-100" style="height: 30px; border-bottom: 1px solid #000;">
        <div>
            {{ timelineScaleStore.zoom }}
        </div>
        <v-slider v-model="timelineScaleStore.zoom" thumb-label :max="100" :min="1" :step="1" max-width="200px"
            density="compact" size="small" hide-details reverse append-icon="mdi-magnify-plus-outline"
            prepend-icon="mdi-magnify-minus-outline" @click:append="zoomIn" @click:prepend="zoomOut"></v-slider>
    </div>
</template>

<script setup lang="ts">
import { useTimelineScaleStore } from '@/stores/editor/timeline-scale';

const timelineScaleStore = useTimelineScaleStore()

const zoomOut = () => {
    timelineScaleStore.zoom += 10
    if (timelineScaleStore.zoom > 100) timelineScaleStore.zoom = 100

}
const zoomIn = () => {
    timelineScaleStore.zoom -= 10
    if (timelineScaleStore.zoom < 0) timelineScaleStore.zoom = 0
}

</script>

<style scoped></style>