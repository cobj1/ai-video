<template>
    <div class="d-flex justify-space-between mt-2">
        <div class="w-100">
            <v-btn variant="plain">00:00:00:15 / 00:00:11:16</v-btn>
        </div>

        <div class="w-100 text-center">
            <v-btn icon="mdi-play" density="comfortable"></v-btn>
        </div>

        <div class="w-100 text-right">
            <v-btn icon="mdi-fullscreen" density="comfortable" @click="viewportStore.fullscreenControl.enter()"></v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useViewportStore } from '@/stores/editor/viewport';
import { onMounted } from 'vue';

const viewportStore = useViewportStore()

onMounted(() => console.log(viewportStore.fullscreenControl))
</script>

<style scoped></style>