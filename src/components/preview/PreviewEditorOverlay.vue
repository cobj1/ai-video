<template>
    <div class="preview-editor-overlay position-absolute w-100 h-100 top-0 left-0" @mousedown="onOverlayMouseDown">
        <div v-for="clip in editableClips" :key="clip.id" :class="`preview-clip-target target_${clip.id}`"
            :data-clip-id="clip.id" :style="{
                position: 'absolute',
                // 这里的值需要是经过 viewportScale 缩放后的，因为它们是 DOM 元素的实际像素位置
                left: `${clip.x}px`,
                top: `${clip.y}px`,
                // Moveable 内部会操作 transform，这里设置初始 transform
                transform: `scale(${clip.scaleX}, ${clip.scaleY}) rotate(${clip.rotation}deg)`,
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
            :rotatable="true" :scalable="true" :keepRatio="true" :throttleResize="1" :throttleDrag="1"
            :throttleScale="0.01" :throttleRotate="0.5" :origin="false" @drag="onDrag" @resize="onResize"
            @scale="onScale" @rotate="onRotate" @dragEnd="onDragEnd" @resizeEnd="onResizeEnd" @scaleEnd="onScaleEnd"
            @rotateEnd="onRotateEnd" />
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

// watch(selectedClipTarget, (newTarget) => {
//     if (moveableRef.value) {
//         nextTick(() => {
//             moveableRef.value.updateTarget();
//             // 每次选中目标更新时，确保 Moveable 知道目标当前的位置和变换
//             // 这一步对于 Moveable 内部的精确计算很重要
//             if (newTarget) {
//                 const clip = currentSelectedClip.value;
//                 if (clip) {
//                     // 将存储在 store 中的设计分辨率值，转换为 Moveable 目标元素所需的实际 DOM 属性
//                     // newTarget.style.left = `${clip.x * props.viewportScale}px`;
//                     // newTarget.style.top = `${clip.y * props.viewportScale}px`;
//                     // newTarget.style.transform = `scale(${clip.scaleX}, ${clip.scaleY}) rotate(${clip.rotation}deg)`;
//                     // 如果你的 Moveable 目标元素宽度/高度与 etro.js 渲染的原始尺寸相关
//                     // 则需要在这里设置一个基于原始设计尺寸的宽度和高度，Moveable 会基于此计算
//                     // 否则 Moveable 会使用 DOM 元素的默认或计算出的 width/height
//                     // 例如，假设 etro.js 渲染的图像/视频原始尺寸是 1920x1080 / 100x100，
//                     // 那么 Moveable 目标元素的初始尺寸应该与 etro.js 的图层原始尺寸相对应，
//                     // 这样 Moveable 报告的 scale 才能准确对应 etro.js layer.scale
//                     // 这里我们假设 clip 的原始尺寸是 100x100px (在设计分辨率下)
//                     // newTarget.style.width = `${100 * props.viewportScale}px`;
//                     // newTarget.style.height = `${100 * props.viewportScale}px`;
//                 }
//             }
//         });
//     }
// }, { immediate: true });



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

const onRotate = (event: any) => {
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

    const newY = clip.y + matrix.f;

    timelineStore.updateClip(clipId, {
        y: newY,
        width: event.lastEvent.width,
        height: event.lastEvent.height
    });
};

const onScaleEnd = (event: any) => {
    if (!currentSelectedClip.value || props.viewportScale === 0) return;
    const clipId = currentSelectedClip.value.id;
    const { scale, transform, rotate } = event.lastEvent; // scale 是一个数组 [scaleX, scaleY]
    const { translateX, translateY } = transform;

    // Moveable 报告的 scale 已经是相对缩放。这里不需要再次除以 viewportScale
    // Moveable 的 scale 是相对于它 target 的初始尺寸的缩放。
    // 但是 translate 仍然需要反向缩放。
    const newX = translateX / props.viewportScale;
    const newY = translateY / props.viewportScale;

    timelineStore.updateClip(clipId, {
        x: newX,
        y: newY,
        scaleX: scale[0],
        scaleY: scale[1],
        rotation: rotate
    });
    console.log(`Clip ${clipId} scaled to scaleX:${scale[0]}, scaleY:${scale[1]} (adjusted by scale: ${props.viewportScale})`);
};

const onRotateEnd = (event: any) => {
    if (!currentSelectedClip.value || props.viewportScale === 0) return;
    const clipId = currentSelectedClip.value.id;
    const { rotate, transform, scale } = event.lastEvent; // rotate 是角度
    const { translateX, translateY } = transform;

    // 反向缩放获取设计分辨率下的新位置
    const newX = translateX / props.viewportScale;
    const newY = translateY / props.viewportScale;

    timelineStore.updateClip(clipId, {
        x: newX,
        y: newY,
        rotation: rotate,
        scaleX: scale[0], // 同时更新缩放（如果发生）
        scaleY: scale[1],
    });
    console.log(`Clip ${clipId} rotated to ${rotate}deg (adjusted by scale: ${props.viewportScale})`);
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