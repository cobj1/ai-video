<template>
    <div class="timeline-scale d-flex"
        :style="{ 'min-width': `${width}px`, 'width': 'fit-content', 'height': `${height}px` }">

        <div class="scale-chunk flex-0-1 position-relative border-s-sm d-flex justify-space-between "
            :class="{ 'border-opacity-100': ((chunk - 1) % conspicuousScale) == 0 || chunk - 1 == 0 }"
            :style="{ 'width': `${chunkWidth}px` }" v-for="chunk in chunks" :key="`chunk_${chunk}`">

            <!-- 帧图 -->
            <div class="frame flex-fill" v-for="frame in density" :key="`frame_${(chunk - 1) * density + frame}`">
            </div>

            <!-- 刻度块的标注 -->
            <div style="position: absolute; top: -2px; font-size: 10px;  left: 4px; color: #fff8;">

                <!-- 明显刻度 -->
                <span v-if="((chunk - 1) % conspicuousScale) == 0 || chunk - 1 == 0">
                    {{ getLabelByFrame((chunk - 1) * density) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue';

/**
 * 时间线刻度
 * 
 * 它主要用于：
 *      显示时间信息： 标记视频的精确时间点，帮助你定位到特定的帧或秒。
 *      辅助精确剪辑： 让你能够精确地在时间线上进行剪切、修剪和调整片段。
 *      对齐素材： 帮助你将不同的视频、音频或图片素材精确地对齐。
 *      管理关键帧： 显示动画或特效的关键帧位置。
 */

const props = defineProps({
    // 缩放/变焦
    zoom: {
        type: Number,
        default: 1
    },
    // 帧速率，每秒多少帧
    frameRate: {
        type: Number,
        default: 30
    }
})

/**
 * 整体时间刻度长度
 */
const width = shallowRef(2000)

/**
 * 整体时间刻度高度
 */
const height = shallowRef(10)

/**
 * 显示几个刻度块
 */
const chunks = computed(() => 100)

/**
 * 每个刻度块的宽度
 */
const chunkWidth = computed(() => 100)

/**
 * 密度：每个刻度中包含多少帧
 */
const density = computed(() => 30)

/**
 * 明显的刻度，每多少块显示一个明显刻度
 */
const conspicuousScale = computed(() => 5)

/**
 * 通过帧数获取标注
 */
const getLabelByFrame = (frame: number) => {
    if (frame % props.frameRate == 0) {
        const mm = Math.trunc((frame / props.frameRate / 60))
        const ss = (frame / props.frameRate - mm * 60)
        return `${mm.toString().padStart(2, '0')}.${ss.toString().padStart(2, '0')}`
    } else {
        return `${frame % props.frameRate} f`;
    }
}
</script>

<style scoped>
.scale-chunk {
    transition: width 0.3s;
}
</style>