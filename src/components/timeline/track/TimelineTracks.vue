<template>
    <v-sheet ref="container" class="timeline-tracks position-relative d-flex flex-column-reverse overflow-y-auto"
        :class="{ 'justify-center': justifyCenter }" height="100%" :width="timelineStore.totalTimelineWidth">
        <timeline-track v-for="track in timelineStore.tracks" :key="track.id" :id="track.id"
            :ref="(component: any) => { if (component) { track.el = markRaw(component.$el) } }">
            <timeline-clip v-for="clip in track.clips" :key="clip.id" :id="clip.id"
                :style="{ 'left': `${clip.startFrame * timelineStore.pixelsPerFrame}px`, 'width': `${clip.durationFrames * timelineStore.pixelsPerFrame}px` }"
                :data="clip" :ref="(component: any) => { if (component) { clip.el = markRaw(component.$el) } }"
                draggable="true" @click="moveableStore.onClickClip($event, clip)"
                @dragstart="moveableStore.onDragStartClip($event, clip)">
                <v-list-item-title> {{ `${clip.id}` }} </v-list-item-title>
            </timeline-clip>
        </timeline-track>

        <Moveable ref="moveableRef" v-bind="moveableStore.attributes" :target="moveableStore.target"
            :elementGuidelines="moveableStore.elementGuidelines"
            :scrollOptions="({ container: '.timeline-tracks', threshold: 30, checkScrollEvent: false, throttleTime: 0 })"
            :bounds="{ left: 0, top: justifyCenter ? 0 : undefined, bottom: 0, position: 'css' }"
            @scroll="moveableStore.onScroll" @drag="moveableStore.onDrag" @dragStart="moveableStore.onDragStart"
            @dragEnd="moveableStore.onDragEnd" @resizeEnd="moveableStore.onResizeEnd"
            @render="moveableStore.onRender" />
    </v-sheet>
</template>

<script setup lang="ts">
/**
 * 组件用于层级中资源交互，显示各个图层
 */
import Moveable from "vue3-moveable";
import '@/styles/moveable.scss'
import { useTimelineStore } from '@/stores/timeline';
import { markRaw, ref, watch, onMounted, nextTick } from "vue";
import { useMoveableStore } from "@/stores/moveable";
import { useElementSize } from '@vueuse/core'

const timelineStore = useTimelineStore()

const moveableStore = useMoveableStore()

const moveableRef = ref()

moveableStore.setMoveableRef(moveableRef)

const container = ref()

const justifyCenter = ref(true)

const { height } = useElementSize(container)

// 监听轨道数量和容器高度，决定是否垂直居中
watch(() => [container.value, timelineStore.tracks?.length, height.value], () => {
    if (container.value && timelineStore.tracks && height.value) {
        // 假设每个轨道高度大约是 65px
        justifyCenter.value = timelineStore.tracks.length * 65 < height.value
    }

    if (moveableStore.target && moveableRef.value) {
        nextTick(() => {
            moveableRef.value.updateTarget();
        });
    }
}, {
    immediate: true
})

onMounted(() => {
    const track = timelineStore.insertTrack(0, "video", "视频");
    const track2 = timelineStore.insertTrack(1, "video", "视频");

    timelineStore.addClip(track.id, {
        mediaType: 'video',
        name: 'video@123',
        startFrame: 10,
        durationFrames: 30,
        mediaSourcePath: '',
        x: 100,
        y: 100,
        width: 500,
        height: 500,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1
    });
});

</script>

<style scoped></style>