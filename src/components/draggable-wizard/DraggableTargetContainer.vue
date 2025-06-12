<template>
    <div class="draggable-target-container position-absolute fill-height w-100 align-center d-flex justify-center text-h5"
        @mouseenter="draggableWizardStore.onDragenter" @mousemove="draggableWizardStore.onDragover"
        @mouseleave="draggableWizardStore.onDragleave">
        Add assets to the timeline
    </div>
</template>

<script setup lang="ts">
import { useDraggableWizardStore } from '@/stores/draggable-wizard';

const draggableWizardStore = useDraggableWizardStore()
</script>

<style scoped>
.draggable-target-container {
    background-color: #fff5;
    border: 4px dashed #2266;
    box-sizing: border-box;
    z-index: 3;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>