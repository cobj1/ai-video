<template>
    <div class="preview-editor-overlay position-absolute w-100 h-100 top-0 left-0" @mousedown="onOverlayMouseDown">
        <div v-for="clip in editableClips" :key="clip.id" :class="`preview-clip-target target_${clip.id}`"
            :data-clip-id="clip.id" :style="{
                position: 'absolute',
                // 这里的值需要是经过 viewportScale 缩放后的，因为它们是 DOM 元素的实际像素位置
                left: `${clip.x}px`,
                top: `${clip.y}px`,
                // Moveable 内部会操作 transform，这里设置初始 transform
                transform: `scale(${clip.scaleX}, ${clip.scaleY})`,
                // 这里的 width/height 也是设计分辨率下的原始像素值，它们也会被 viewportScale 影响
                // 如果你的 etro.js 图层源本身没有固定尺寸，可以这里设置一个参考尺寸让 Moveable 作用
                // 假设你的设计分辨率是 1920x1080，我们希望 clip.x/y/scaleX/Y 对应这个分辨率
                // 那么这里 width/height 应该是一个能让 scaleX=1, scaleY=1 时，覆盖原始内容尺寸的像素值
                // 暂时设置一个示例值，实际应与媒体尺寸或你期望的默认显示尺寸相关
                width: `${clip.width}px`, // 示例：在缩放后的容器中，它的实际 DOM 宽度
                height: `${clip.height}px`,// 示例
                border: selectedClipId === clip.id ? '2px solid #00FFFF' : '1px dashed rgba(255,255,255,0.5)',
                cursor: 'grab',
                zIndex: selectedClipId === clip.id ? 1001 : 1000,
                opacity: clip.opacity // 应用透明度到叠加层（可选，视觉反馈）
            }" draggable="true" @click="onClickClip($event, clip)" @dragstart="onDragStartClip($event, clip)">
            <div @click.stop>
                {{ clip.name }}
            </div>
        </div>

        <Moveable ref="moveableRef" class="moveable-instance" :target="target" :draggable="true" :resizable="true"
            :scalable="true" :keepRatio="true" :throttleResize="1" :throttleDrag="1" :throttleScale="0.01"
            :origin="false" @drag="onDrag" @resize="onResize" @scale="onScale" @dragEnd="onDragEnd"
            @resizeEnd="onResizeEnd" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import Moveable from 'vue3-moveable';
import { useTimelineStore } from '@/stores/timeline';
import type { Clip } from '@/types/timeline';
import { useFindClipByClipid, useFindClipindexByClipid } from '@/composables/useTimeline';

// 接收 viewportScale prop
const props = defineProps<{
    viewportScale: number;
}>();

const timelineStore = useTimelineStore();

const moveableRef = ref<any>(null);

const selectedClipId = ref<string | null>(null);

const target = ref()

const currentSelectedClip = computed<Clip | undefined>(() => {
    if (!selectedClipId.value) return undefined;

    for (const track of timelineStore.tracks) {
        const clip = track.clips.find(c => c.id === selectedClipId.value);
        if (clip) return clip;
    }
    return undefined;
});

const selectedClipTarget = computed<HTMLElement | null>(() => {
    if (!selectedClipId.value) return null;
    return document.querySelector(`.preview-clip-target.target_${selectedClipId.value}`) as HTMLElement;
});

const editableClips = computed<Clip[]>(() => {
    const visibleClips: Clip[] = [];
    for (const track of timelineStore.tracks) {
        for (const clip of track.clips) {
            visibleClips.push(clip);
        }
    }
    return visibleClips;
});

const onClickClip = (event: any, eventData: any) => {
    target.value = event.target;

};

const onDragStartClip = (event: any, eventData: any) => {
    const moveable = moveableRef.value;

    event.preventDefault();

    moveable.waitToChangeTarget().then(() => moveable.dragStart(event));

    target.value = event.target;
};

const onOverlayMouseDown = (e: MouseEvent) => {
    const targetElement = e.target as HTMLElement;
    const clipId = targetElement.dataset.clipId;

    if (clipId) {
        selectedClipId.value = clipId;
    } else if (!targetElement.closest('.moveable-instance') && !targetElement.closest('.preview-clip-target')) {
        selectedClipId.value = null;
    }
};



// --- Moveable Event Handlers ---
// 实时更新 DOM 元素，让用户看到拖动效果, 并且经过缩放视口缩放恢复位置跟随鼠标
const onDrag = (event: any) => {
    event.target.style.transform = event.transform;

    const matrix = new DOMMatrix(event.transform);

    matrix.e = matrix.e / props.viewportScale;

    matrix.f = matrix.f / props.viewportScale;

    event.target.style.transform = matrix.toString();
};

const onResize = (event: any) => {
    event.target.style.width = `${event.width}px`;
    event.target.style.height = `${event.height}px`;

    event.target.style.transform = event.drag.transform;
};

const onScale = (event: any) => {
    event.target.style.transform = event.drag.transform;
};


// 将 Moveable 的结束事件同步到 Pinia Store，这里需要进行反向缩放
const onDragEnd = (event: any) => {
    if (event.isDrag == false) return;

    if (!currentSelectedClip.value || props.viewportScale === 0) return;
    const clipId = currentSelectedClip.value.id;

    const clip = useFindClipByClipid(clipId)

    const matrix = new DOMMatrix(event.lastEvent.transform);

    // // 反向缩放 Moveable 报告的拖动距离
    const newX = clip.x + matrix.e / props.viewportScale;
    const newY = clip.y + matrix.f / props.viewportScale;

    timelineStore.updateClip(clipId, {
        x: newX,
        y: newY,
    });
};

const onResizeEnd = (event: any) => {
    if (!currentSelectedClip.value || props.viewportScale === 0) return;
    const clipId = currentSelectedClip.value.id;

    const clip = useFindClipByClipid(clipId)

    const matrix = new DOMMatrix(event.lastEvent.transform);

    const newX = clip.x + matrix.e;
    const newY = clip.y + matrix.f;

    timelineStore.updateClip(clipId, {
        x: newX,
        y: newY,
        width: event.lastEvent.width,
        height: event.lastEvent.height
    });
};



onMounted(() => {
    if (timelineStore.tracks.length > 0 && timelineStore.tracks[0].clips.length > 0) {
        selectedClipId.value = timelineStore.tracks[0].clips[0].id;
    }
});

</script>

<style scoped>
.preview-editor-overlay {
    z-index: 50;
    pointer-events: auto;
}

.preview-clip-target {
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 12px;
    overflow: hidden;
    box-sizing: border-box;
    /* 确保 transform-origin 是左上角，与 etro.js 的 x,y 行为一致 */
    transform-origin: 0 0;
}

.preview-clip-target:hover {
    background-color: rgba(0, 0, 0, 0.3);
}

.moveable-instance {
    z-index: 1002;
}
</style>