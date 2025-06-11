<template>
    <div class="draggable-wizard" ref="draggableWizardRef" :style="{'padding':`${draggableWizardStore.wizardConfig.padding}px`}"  v-if="draggableWizardStore.target">
        <v-card>
            <v-img :src="draggableWizardStore.data.cover" class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" :width="draggableWizardStore.wizardConfig.width" :height="draggableWizardStore.wizardConfig.height" cover>
                <v-card-title class="text-white" v-text="draggableWizardStore.data.title"></v-card-title>
            </v-img>
        </v-card>
    </div>
    <div class="draggable-wizard-shade" ref="draggableWizardShadeRef" v-if="draggableWizardStore.target"
        @mousemove="draggableWizardStore.onDrag" @mouseup="draggableWizardStore.onDragend">
    </div>
</template>

<script setup lang="ts">
/**
 * 拖拽精灵，实例数据委托给 draggableWizardStore
 */
import { useDraggableWizardStore } from '@/stores/editor/draggable-wizard'
import { ref } from 'vue'

const draggableWizardStore = useDraggableWizardStore()

const draggableWizardRef = ref()

const draggableWizardShadeRef = ref()

draggableWizardStore.setDraggableWizardRef(draggableWizardRef)

draggableWizardStore.setDraggableWizardShadeRef(draggableWizardShadeRef)
</script>

<style scoped>
.draggable-wizard {
    position: absolute;
    z-index: 4;
    background-color: #6663;
    border-radius: 10px;
    pointer-events: none;
    cursor: all-scroll;
    top: -500px;
}

.draggable-wizard-shade {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #0003;
    z-index: 2;
}
</style>