<template>
    <div class="timelin-playhead"
        :style="{ left: `${timelineStore.currentPlayheadFrame * timelineStore.pixelsPerFrame}px` }"
        @mousedown="startPlayheadDrag"></div>

</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useTimelineStore } from '@/stores/timeline';

const timelineStore = useTimelineStore();

const props = defineProps<{
    scrollContainer: HTMLElement | null;
}>();

// 使用传入的 scrollContainer 作为父元素
const scrollParentEl = computed(() => props.scrollContainer);

// --- 播放头交互 ---

const startPlayheadDrag = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止剪辑拖动/选择

    timelineStore.isPlayheadDragging = true;
    document.addEventListener('mousemove', onPlayheadDrag);
    document.addEventListener('mouseup', stopPlayheadDrag);
};

const onPlayheadDrag = (e: MouseEvent) => {
    if (!timelineStore.isPlayheadDragging || !scrollParentEl.value) return;

    const containerRect = scrollParentEl.value.getBoundingClientRect();
    const mouseXInContainer = e.clientX - containerRect.left + scrollParentEl.value.scrollLeft; // 考虑滚动位置

    const newFrame = Math.round(mouseXInContainer / timelineStore.pixelsPerFrame);
    timelineStore.setPlayheadFrame(newFrame);
};

const stopPlayheadDrag = () => {
    timelineStore.isPlayheadDragging = false;
    document.removeEventListener('mousemove', onPlayheadDrag);
    document.removeEventListener('mouseup', stopPlayheadDrag);
};

onUnmounted(() => {
    document.removeEventListener('mousemove', onPlayheadDrag);
    document.removeEventListener('mouseup', stopPlayheadDrag);
});
</script>

<style scoped>
/* 新增：播放头样式 */
.timelin-playhead {
    position: absolute;
    top: 0;
    height: 100%;
    width: 2px;
    /* 播放头线的粗细 */
    background-color: #FF4081;
    /* 明亮的颜色，例如 Material Design 粉红色 A200 */
    z-index: 100;
    /* 确保它在所有元素之上 */
    cursor: ew-resize;
    /* 指示可拖动的光标 */
    pointer-events: auto;
    /* 允许鼠标事件在播放头上 */
    transform: translateX(-1px);
    /* 2px 线的视觉居中 */
}

/* 在顶部添加一个小圆圈或三角形以提高可见性 */
.timelin-playhead::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background-color: #FF4081;
    border-radius: 50%;
    /* 圆形 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>