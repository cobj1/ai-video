<template>
    <div class="timeline h-100 d-flex flex-column position-relative">
        <timeline-tool></timeline-tool>
        <div class="d-flex h-100">
            <div class="h-100" style="min-width: 200px;">
                <timeline-layer-control></timeline-layer-control>
            </div>
            <div class="h-100 w-100 overflow-x-auto d-flex flex-column">
                <timeline-scale class="mt-1"></timeline-scale>
                <timeline-layer :list="data"></timeline-layer>
            </div>
        </div>
        <draggable-target-container v-if="draggableWizardStore.target"></draggable-target-container>
    </div>
</template>

<script setup lang="ts">
import { useDraggableWizardStore } from '@/stores/editor/draggable-wizard';

const draggableWizardStore = useDraggableWizardStore()

const data = [
    {
        id: 0,
        media: [
            {
                id: `medium_0`,
                title: `medium_target_0`,
                start: 100,
                end: 300
            },
            {
                id: `medium_1`,
                title: `medium_target_1`,
                start: 500,
                end: 600
            },
            {
                id: `medium_2`,
                title: `medium_target_2`,
                start: 800,
                end: 1100
            }
        ]
    },
    {
        id: 1,
        media: [
            {
                id: `medium_0`,
                title: `medium_target_1`,
                start: 100,
                end: 300
            },
            {
                id: `medium_1`,
                title: `medium_target_1`,
                start: 500,
                end: 600
            },
            {
                id: `medium_2`,
                title: `medium_target_1`,
                start: 900,
                end: 1500
            }
        ]
    }
]


</script>

<style scoped></style>