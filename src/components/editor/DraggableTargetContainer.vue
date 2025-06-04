<template>
    <div class="draggable-target-container position-absolute fill-height w-100 align-center d-flex justify-center text-h5"
        @mouseenter="draggableWizardStore.onDragenter" @mousemove="draggableWizardStore.onDragover"
        @mouseleave="draggableWizardStore.onDragleave">
        Add assets to the timeline
    </div>
</template>

<script setup lang="ts">
import { useDraggableWizardStore } from '@/stores/editor/draggable-wizard';

const draggableWizardStore = useDraggableWizardStore()
</script>

<style scoped>
.draggable-target-container {
    background-color: #fff5;
    border: 4px dashed #2266;
    box-sizing: border-box;
    z-index: 3;
}
</style>