<template>
    <div class="timeline h-100 d-flex flex-column position-relative">
        <timeline-tool></timeline-tool>
        <div class="d-flex h-100 overflow-hidden">
            <div class="h-100" style="min-width: 200px;">
                <timeline-layer-control></timeline-layer-control>
            </div>
            <div class="h-100 w-100 overflow-x-auto d-flex flex-column">
                <timeline-scale class="mt-1 flex-grow-0	"></timeline-scale>
                <timeline-layer-list :items="dataStore.layers"></timeline-layer-list>
            </div>
        </div>
        <draggable-target-container v-if="draggableWizardStore.target"></draggable-target-container>
    </div>
</template>

<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useDraggableWizardStore } from '@/stores/editor/draggable-wizard';

const draggableWizardStore = useDraggableWizardStore()

const dataStore = useDataStore()

</script>

<style scoped></style>