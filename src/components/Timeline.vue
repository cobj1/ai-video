<template>
    <div class="timeline h-100 d-flex flex-column position-relative">
        <timeline-controls></timeline-controls>
        <div class="d-flex h-100 overflow-hidden">
            <div class="h-100" style="min-width: 200px;">
                <timeline-track-controls></timeline-track-controls>
            </div>
            <div class="h-100 w-100 overflow-x-auto d-flex flex-column timeline-scroll-container"
                ref="timelineScrollContainerRef">
                <timeline-ruler class="mt-1 flex-grow-0"
                    :scroll-container="timelineScrollContainerRef"></timeline-ruler>
                <timeline-tracks :scroll-container="timelineScrollContainerRef"></timeline-tracks>
            </div>
        </div>
        <draggable-target-container v-if="draggableWizardStore.target"></draggable-target-container>
    </div>
</template>

<script setup lang="ts">
import { useDraggableWizardStore } from '@/stores/draggable-wizard';
import { ref } from 'vue';

const draggableWizardStore = useDraggableWizardStore()

const timelineScrollContainerRef = ref<HTMLElement | null>(null); // 创建滚动容器的引用
</script>

<style scoped></style>