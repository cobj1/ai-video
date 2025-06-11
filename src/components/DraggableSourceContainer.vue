<template>
    <div draggable="true" @dragstart="draggableWizardStore.onDragstart($event, data)">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { useDraggableWizardStore } from '@/stores/draggable-wizard';

const draggableWizardStore = useDraggableWizardStore()

defineProps({
    data: Object
})
</script>

<style scoped></style>