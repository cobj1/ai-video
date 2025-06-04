<template>
    <v-sheet class="timeline-layer" height="100%" :width="timelineScaleStore.width">
        <timeline-layer-item :layer="layer" v-for="layer in list" :key="layer.id">
        </timeline-layer-item>
    </v-sheet>

</template>

<script setup lang="ts">
/**
 * 组件用于层级中元素的变更
 */
import { useTimelineScaleStore } from '@/stores/editor/timeline-scale';

const timelineScaleStore = useTimelineScaleStore()

defineProps({
    list: {
        type: Object
    }
})
</script>

<style scoped></style>