<template>
    <div ref="timelineScaleRef" class="timeline-scale timeline-scale d-flex mb-4 flex-1-0	"
        :style="{ 'width': 'fit-content', 'height': `10px` }">
        <div class="scale-chunk flex-0-1 position-relative border-s-sm d-flex justify-space-between "
            :class="{ 'border-opacity-100': ((chunk - 1) % timelineScaleStore.conspicuousScale) == 0 || chunk - 1 == 0 }"
            :style="{ 'width': `${timelineScaleStore.chunkWidth}px` }" v-for="chunk in timelineScaleStore.chunks"
            :key="`chunk_${chunk}`">

            <!-- 刻度块的标注 -->
            <div style="position: absolute; top: -2px; font-size: 10px;  left: 4px; color: #fff8;">

                <!-- 明显刻度 -->
                <span v-if="((chunk - 1) % timelineScaleStore.conspicuousScale) == 0 || chunk - 1 == 0">
                    {{ timelineScaleStore.getLabelByChunkIndex(chunk - 1) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 时间线刻度
 * 
 * 它主要用于：
 *      显示时间信息： 标记视频的精确时间点，帮助你定位到特定的帧或秒。
 *      辅助精确剪辑： 让你能够精确地在时间线上进行剪切、修剪和调整片段。
 *      对齐素材： 帮助你将不同的视频、音频或图片素材精确地对齐。
 *      管理关键帧： 显示动画或特效的关键帧位置。
 */
import { useTimelineScaleStore } from '@/stores/editor/timeline-scale';
import { onMounted, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'

const timelineScaleStore = useTimelineScaleStore()


const el = useTemplateRef('timelineScaleRef')

const { width } = useElementSize(el)


watch(width, () => {
    timelineScaleStore.width = width.value
})

</script>

<style scoped>
.scale-chunk {
    transition: width 0.3s;
}
</style>