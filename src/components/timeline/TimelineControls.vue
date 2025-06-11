<template>
    <div class="d-flex justify-space-between align-center w-100 px-2"
        style="height: 32px; border-bottom: 1px solid #000;">
        <div>
            <v-btn icon="mdi-undo" variant="plain" size="small" density="comfortable"></v-btn>
            <v-btn icon="mdi-redo" variant="plain" size="small" density="comfortable"></v-btn>
            <v-btn icon="mdi-trash-can-outline" variant="plain" size="small" density="comfortable"></v-btn>
        </div>
        <v-slider v-model="timelineStore.pixelsPerFrame" thumb-label :max="100" :min="1" :step="0.1" max-width="200px"
            hide-details   append-icon="mdi-magnify-plus-outline" prepend-icon="mdi-magnify-minus-outline"
            @click:append="zoomOut" @click:prepend="zoomIn"></v-slider>
    </div>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/stores/timeline';

const timelineStore = useTimelineStore()

const zoomOut = () => {
    
    if (timelineStore.pixelsPerFrame+10 > 100) timelineStore.pixelsPerFrame = 100
    else timelineStore.pixelsPerFrame += 10

}
const zoomIn = () => {
    if (timelineStore.pixelsPerFrame-10 <= 0) timelineStore.pixelsPerFrame = 1
    else timelineStore.pixelsPerFrame -= 10
}

</script>

<style scoped></style>