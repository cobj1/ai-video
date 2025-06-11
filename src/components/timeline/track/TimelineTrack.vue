<template>
    <v-sheet class="timeline-track" :min-height="65" :height="65" width="100%">
        <div class="timeline-track-top opacity-50" :class="{ 'bg-amber': moveableStore.dragging && !isOutside }"
            ref="topRef"></div>

        <v-sheet class="timeline-track-container" color="#9E9E9E10">
            <slot></slot>
        </v-sheet>
    </v-sheet>
</template>

<script setup lang="ts">
/**
 * 组件作用记录资源所在图层，资源拖拽至至此处将规划到该图层
 */
import { useMoveableStore } from '@/stores/moveable';
import { useMouseInElement } from '@vueuse/core'
import { useTemplateRef } from 'vue';

const moveableStore = useMoveableStore()

const topRef = useTemplateRef<HTMLDivElement>('topRef')

const { isOutside } = useMouseInElement(topRef)

</script>

<style scoped>
.timeline-track {
    display: flex;
    flex-direction: column;
}

.timeline-track-top {
    width: 100%;
    height: 5px;
    flex-shrink: 0;
}

.timeline-track-container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>