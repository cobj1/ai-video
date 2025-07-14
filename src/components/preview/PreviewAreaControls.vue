<template>
    <div class="d-flex justify-space-between mt-2">
        <div class="w-100">
            <v-btn variant="plain">
                {{ formatTime(timelineStore.currentPlayheadFrame) }} /
                {{ formatTime(timelineStore.contentDurationFrames) }}
            </v-btn>
        </div>

        <div class="w-100 text-center">
            <v-btn icon="mdi-play" density="comfortable"></v-btn>
        </div>

        <div class="w-100 text-right">
            <v-btn icon="mdi-fullscreen" density="comfortable" @click="previewAreaStore.fullscreenControl.enter()"></v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePreviewAreaStore } from '@/stores/preview-area';
import { useTimelineStore } from '@/stores/timeline';

const previewAreaStore = usePreviewAreaStore()
const timelineStore = useTimelineStore();



// 将帧数格式化为 HH:MM:SS:FF 或 MM:SS.ms
const formatTime = (frames: number): string => {
    if (isNaN(frames) || frames < 0) return '00:00:00:00';
    const totalSeconds = frames / timelineStore.frameRate;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const remainingFrames = frames % timelineStore.frameRate; // 获取当前秒内的帧数

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const ff = String(remainingFrames).padStart(2, '0'); // 帧数

    return `${hh}:${mm}:${ss}:${ff}`;
};
</script>

<style scoped></style>