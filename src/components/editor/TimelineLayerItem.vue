<template>
    <v-sheet class="timeline-layer-item" :min-height="65" :height="65" width="100%">
        <div class="timeline-layer-item-top opacity-50" :class="{ 'bg-amber': moveableStore.dragging && !isOutside }"
            ref="topRef"></div>

        <v-sheet class="timeline-layer-item-container" color="#9E9E9E10">
            <slot></slot>
        </v-sheet>
    </v-sheet>
</template>

<script setup lang="ts">
/**
 * 组件作用记录资源所在图层，资源拖拽至至此处将规划到该图层
 */
import { useMoveableStore } from '@/stores/editor/moveable';
import { useMouseInElement } from '@vueuse/core'
import { useTemplateRef } from 'vue';

const moveableStore = useMoveableStore()

const topRef = useTemplateRef<HTMLDivElement>('topRef')

const { isOutside } = useMouseInElement(topRef)

</script>

<style scoped>
.timeline-layer-item {
    display: flex;
    flex-direction: column;
}

.timeline-layer-item-top {
    width: 100%;
    height: 5px;
    flex-shrink: 0;
}

.timeline-layer-item-container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>