<template>
    <div class="timeline-ruler overflow-hidden" :style="{ width: timelineStore.totalTimelineWidth + 'px' }"
        @wheel="handleMouseWheel">
        <div class="ruler-marks-container">
            <div v-for="mark in visibleRulerMarks" :key="mark.frame"
                :style="{ left: (mark.frame * timelineStore.pixelsPerFrame) + 'px' }"
                :class="['ruler-mark', `mark-level-${mark.level}`]">
                <span class="mark-value">{{ formatMarkLabel(mark.frame, mark.level) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, shallowRef, watch } from 'vue';
import { useTimelineStore } from '@/stores/timeline';
import { useElementSize } from '@vueuse/core';

const props = defineProps<{
    scrollContainer: HTMLElement | null; // 接收滚动容器的引用
}>();

const timelineStore = useTimelineStore();

// 使用传入的 scrollContainer 作为父元素
const scrollParentEl = computed(() => props.scrollContainer);

// 监听滚动容器的宽度
const { width: wrapperWidth } = useElementSize(scrollParentEl);

// 存储滚动容器的 scrollLeft
const parentElScrollLeft = ref(0)


// --- 鼠标滚轮缩放 ---
const handleMouseWheel = (e: WheelEvent) => {
    e.preventDefault(); // 阻止页面默认滚动行为

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // 向上滚放大，向下滚缩小

    const parentScrollEl = scrollParentEl.value; // 使用统一的滚动容器
    if (!parentScrollEl) return;

    const rect = parentScrollEl.getBoundingClientRect();

    const mouseX = e.clientX - rect.left; // 鼠标在 rulerWrapper 内的X坐标

    const scrollLeft = parentScrollEl.scrollLeft; // 从父元素获取滚动位置

    const frameAtMouse = (scrollLeft + mouseX) / timelineStore.pixelsPerFrame;

    // 更新 pixelsPerFrame
    timelineStore.setPixelsPerFrame(timelineStore.pixelsPerFrame * zoomFactor);

    // 调整滚动位置，保持鼠标位置不变
    const newScrollLeft = frameAtMouse * timelineStore.pixelsPerFrame - mouseX;

    // 使用 requestAnimationFrame 确保在下一帧渲染前设置滚动位置
    requestAnimationFrame(() => {
        parentScrollEl.scrollLeft = newScrollLeft; // 更新父元素的滚动位置
    });
};

// --- 刻度线渲染逻辑 ---

// 定义刻度线级别类型
interface RulerMark {
    frame: number;
    level: 1 | 2 | 3 | 4 | 5 | 6; // 定义不同级别的刻度线
}


// 计算当前可见的刻度线
const visibleRulerMarks = computed<RulerMark[]>(() => {
    const marks: RulerMark[] = [];
    const projectFPS = timelineStore.frameRate;
    const currentPixelsPerFrame = timelineStore.pixelsPerFrame;
    const projectTotalFrames = timelineStore.contentDurationFrames;
    
    // 获取当前可见区域的帧范围 (基于滚动位置)
    const viewportWidth = wrapperWidth.value || window.innerWidth;

    const visibleStartFrame = Math.floor(parentElScrollLeft.value / currentPixelsPerFrame);
    const visibleEndFrame = Math.ceil((parentElScrollLeft.value + viewportWidth) / currentPixelsPerFrame);

    // 额外渲染一些缓冲帧，防止快速滚动时空白
    const bufferFrames = Math.max(projectFPS * 10, 300);

    const renderStartFrame = Math.max(0, visibleStartFrame - bufferFrames);
    const renderEndFrame = Math.min(projectTotalFrames, visibleEndFrame + bufferFrames);

    // 定义不同时间间隔对应的帧数 (基于项目FPS)
    const frameInterval = 1;
    const ms100IntervalFrames = Math.round(projectFPS * 0.1);
    const ms500IntervalFrames = Math.round(projectFPS * 0.5);
    const sec1IntervalFrames = projectFPS;
    const sec5IntervalFrames = projectFPS * 5;
    const sec10IntervalFrames = projectFPS * 10;
    const min1IntervalFrames = projectFPS * 60;

    // 根据当前 pixelsPerFrame 动态选择要显示的最小刻度间隔和级别
    let minLevelToShow = 1;
    if (currentPixelsPerFrame >= 60) { minLevelToShow = 1; }
    else if (currentPixelsPerFrame >= 20) { minLevelToShow = 2; }
    else if (currentPixelsPerFrame >= 5) { minLevelToShow = 3; }
    else if (currentPixelsPerFrame >= 2) { minLevelToShow = 4; }
    else if (currentPixelsPerFrame >= 0.5) { minLevelToShow = 5; }
    else { minLevelToShow = 6; }

    // 遍历计算刻度线
    for (let frame = renderStartFrame; frame <= renderEndFrame; frame++) {
        const roundedFrame = Math.round(frame);
        let level: RulerMark['level'] | null = null;

        if (roundedFrame % min1IntervalFrames === 0 && minLevelToShow <= 6) { level = 6; }
        else if (roundedFrame % sec10IntervalFrames === 0 && minLevelToShow <= 6) { level = 6; }
        else if (roundedFrame % sec5IntervalFrames === 0 && minLevelToShow <= 5) { level = 5; }
        else if (roundedFrame % sec1IntervalFrames === 0 && minLevelToShow <= 4) { level = 4; }
        else if (roundedFrame % ms500IntervalFrames === 0 && minLevelToShow <= 3) { level = 3; }
        else if (roundedFrame % ms100IntervalFrames === 0 && minLevelToShow <= 2) { level = 2; }
        else if (roundedFrame % frameInterval === 0 && minLevelToShow <= 1) { level = 1; }

        if (level !== null && roundedFrame >= 0) {
            const existingMarkIndex = marks.findIndex(m => m.frame === roundedFrame);
            if (existingMarkIndex !== -1) {
                if (marks[existingMarkIndex].level < level) {
                    marks[existingMarkIndex].level = level;
                }
            } else {
                marks.push({ frame: roundedFrame, level: level });
            }
        }
    }
    return marks.sort((a, b) => a.frame - b.frame);
});

// 格式化刻度线标签
const formatMarkLabel = (frame: number, level: RulerMark['level']) => {
    const projectFPS = timelineStore.frameRate;
    const totalSeconds = frame / projectFPS;
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const currentSecondFrames = frame % projectFPS;
    const milliseconds = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const ff = String(currentSecondFrames).padStart(2, '0');
    const ms100 = String(Math.floor(milliseconds / 100));


    switch (level) {
        case 1: return `${ff} f`; // 帧级
        case 2: return `${mm}:${ss}.${ms100}`; // 0.1秒级
        case 3: return `${mm}:${ss}${milliseconds >= 500 ? '.5' : '.0'}`; // 0.5秒级
        case 4: return `${hh}:${mm}:${ss}`; // 1秒级
        case 5: return `${hh}:${mm}:${ss}`; // 5秒级
        case 6: return `${hh}:${mm}:${ss}`; // 10秒/分钟级
        default: return '';
    }
};

// 监听父容器的滚动，更新 parentElScrollLeft
const handleScroll = () => {
    if (scrollParentEl.value) {
        parentElScrollLeft.value = scrollParentEl.value.scrollLeft;
    }
};

onMounted(() => {
    if (scrollParentEl.value) {
        scrollParentEl.value.addEventListener('scroll', handleScroll);
        // 初始化时设置一次滚动位置
        parentElScrollLeft.value = scrollParentEl.value.scrollLeft;
    }
});

onUnmounted(() => {
    if (scrollParentEl.value) {
        scrollParentEl.value.removeEventListener('scroll', handleScroll);
    }
});

// 当 scrollContainer prop 变化时，重新绑定事件监听器
watch(() => props.scrollContainer, (newContainer, oldContainer) => {
    if (oldContainer) {
        oldContainer.removeEventListener('scroll', handleScroll);
    }
    if (newContainer) {
        newContainer.addEventListener('scroll', handleScroll);
        parentElScrollLeft.value = newContainer.scrollLeft; // 确保更新初始值
    }
});
</script>

<style scoped>
.timeline-ruler {
    height: 30px;
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%;
    user-select: none;
}

.ruler-marks-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
}

.ruler-mark {
    position: absolute;
    top: 0;
    height: 100%;
    border-left: 1px solid #555;
    font-size: 10px;
    line-height: 1;
    color: #999;
    box-sizing: border-box;
    transform: translateX(-0.5px);
}

.ruler-mark .mark-value {
    position: absolute;
    top: 2px;
    left: 3px;
    white-space: nowrap;
}

/* 刻度线样式分级 */
.ruler-mark.mark-level-1 {
    /* 帧级 */
    height: 50%;
    top: 0;
}

.ruler-mark.mark-level-2 {
    /* 0.1秒级 */
    height: 60%;
    top: 0;
}

.ruler-mark.mark-level-3 {
    /* 0.5秒级 */
    height: 70%;
    top: 0;
}

.ruler-mark.mark-level-4 {
    /* 1秒级 */
    height: 70%;
    top: 0;
    font-size: 11px;
}

.ruler-mark.mark-level-5 {
    /* 5秒级 */
    height: 80%;
    top: 0;
    font-size: 12px;
}

.ruler-mark.mark-level-6 {
    /* 10秒/分钟级 */
    height: 100%;
    top: 0;
    border-left-width: 2px;
    font-size: 13px;
    font-weight: bold;
}
</style>