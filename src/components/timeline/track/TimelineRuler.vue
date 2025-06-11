<template>
    <div ref="timelineRulerRef" class="timeline-ruler" :style="{ width: totalTimelineWidth + 'px' }"
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
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import { useTimelineStore } from '@/stores/timeline';
import { useElementSize, useParentElement } from '@vueuse/core';

const timelineStore = useTimelineStore();


// 可滚动容器的引用和宽度
const timelineRulerRef = shallowRef<HTMLElement | null>(null);
const parentEl = useParentElement(timelineRulerRef)
const { width: wrapperWidth } = useElementSize(parentEl);
const parentElScrollLeft = ref(0)


// 计算时间轴的总像素宽度
const totalTimelineWidth = computed(() => {
    return timelineStore.contentDurationFrames * timelineStore.pixelsPerFrame;
});


// --- 鼠标滚轮缩放 ---
const handleMouseWheel = (e: WheelEvent) => {
    e.preventDefault(); // 阻止页面默认滚动行为

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // 向上滚放大，向下滚缩小

    // 计算鼠标位置对应的帧数，用于“缩放到鼠标位置”
    const timelineEl = timelineRulerRef.value;
    if (!timelineEl) return;

    const rect = timelineEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // 鼠标在容器内的X坐标
    const scrollLeft = timelineEl.scrollLeft; // 当前滚动位置

    const frameAtMouse = (scrollLeft + mouseX) / timelineStore.pixelsPerFrame;

    // 更新 pixelsPerFrame
    timelineStore.setPixelsPerFrame(timelineStore.pixelsPerFrame * zoomFactor);

    // 调整滚动位置，保持鼠标位置不变
    const newScrollLeft = frameAtMouse * timelineStore.pixelsPerFrame - mouseX;

    // 使用 requestAnimationFrame 确保在下一帧渲染前设置滚动位置
    requestAnimationFrame(() => {
        timelineEl.scrollLeft = newScrollLeft;
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

// 监听滚动事件，确保刻度线重新计算
const handleScroll = () => {
    // 简单触发刻度线重新计算，因为其依赖的 scrollLeft 变了
    // 理想情况下，scrollLeft 应该也是一个响应式变量，这样 visibleRulerMarks 会自动响应
    // 但目前这种调用 store setter 的方式也能触发更新
    timelineStore.setPixelsPerFrame(timelineStore.pixelsPerFrame);

    parentElScrollLeft.value = parentEl.value?.scrollLeft || 0
};

onMounted(() => {
    parentEl.value?.addEventListener('scroll', handleScroll);
    // 初始化时间轴内容，例如设置总帧数和帧率
    timelineStore.setContentDuration(1000); // 示例：总共 1000 帧
    timelineStore.setFrameRate(30);       // 示例：30 FPS
});

onUnmounted(() => {
    parentEl.value?.removeEventListener('scroll', handleScroll);
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