import { watchThrottled } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";

/**
 * 时间线刻度
 *
 * 它主要用于：
 *      显示时间信息： 标记视频的精确时间点，帮助你定位到特定的帧或秒。
 *      辅助精确剪辑： 让你能够精确地在时间线上进行剪切、修剪和调整片段。
 *      对齐素材： 帮助你将不同的视频、音频或图片素材精确地对齐。
 *      管理关键帧： 显示动画或特效的关键帧位置。
 */

/**
 * 时间线宽度
 */

let width = shallowRef(0);

/**
 * 缩放/变焦
 */
const zoom = shallowRef(50);

watchThrottled(
  zoom,
  () => {
    if (zoom.value < 10) {
      density.value = 1;
      chunkWidth.value = 200 - zoom.value * 10;
      conspicuousScale.value = 2;
    }
    if (zoom.value >= 10 && zoom.value < 20) {
      density.value = 1;
      chunkWidth.value = 100 - (zoom.value - 10) * 5;
      conspicuousScale.value = 2;
    }
    if (zoom.value >= 20 && zoom.value < 30) {
      density.value = 1;
      chunkWidth.value = 50 - (zoom.value - 20) * 2.5;
      conspicuousScale.value = 2;
    }
    if (zoom.value >= 30 && zoom.value < 40) {
      density.value = 1;
      chunkWidth.value = 25 - (zoom.value - 30) * 0.5;
      conspicuousScale.value = 10;
    }
    if (zoom.value >= 40 && zoom.value < 50) {
      density.value = 3;
      chunkWidth.value = 50 - (zoom.value - 40) * 2.5;
      conspicuousScale.value = 5;
    }
    if (zoom.value >= 50 && zoom.value < 60) {
      density.value = 3;
      chunkWidth.value = 25 - (zoom.value - 50) * 0.5;
      conspicuousScale.value = 10;
    }
    if (zoom.value >= 60 && zoom.value < 70) {
      density.value = 12;
      chunkWidth.value = 50 - (zoom.value - 60) * 2.5;
      conspicuousScale.value = 5;
    }
    if (zoom.value >= 70 && zoom.value < 80) {
      density.value = 12;
      chunkWidth.value = 25 - (zoom.value - 70) * 0.5;
      conspicuousScale.value = 10;
    }
    if (zoom.value >= 80 && zoom.value < 90) {
      density.value = 48;
      chunkWidth.value = 50 - (zoom.value - 80) * 2.5;
      conspicuousScale.value = 5;
    }
    if (zoom.value >= 90 && zoom.value <= 100) {
      density.value = 48;
      chunkWidth.value = 25 - (zoom.value - 90) * 0.5;
      conspicuousScale.value = 10;
    }
  },
  { throttle: 100 }
);

/**
 * 帧速率，每秒多少帧
 */
const frameRate = shallowRef(30);

/**
 * 内容时长,用来计算时间线长度,单位 frame
 */
const contentDuration = shallowRef(100);

/**
 * 每个块代表包含几个序列帧
 */
const density = shallowRef(3);

/**
 * 显示几个刻度块,显示内容时长四倍的刻度快，参照jianying
 */
const chunks = computed(() =>
  Math.max(Math.trunc(contentDuration.value / density.value) * 4, 200)
);

/**
 * 每个刻度块的宽度
 */
const chunkWidth = shallowRef(25);

/**
 * 渲染帧的宽度，每个序列帧在时间轴所占的宽度，不影响正常合成。单位 px
 */
const getFrameWidth = computed(() => chunkWidth.value / density.value);

/**
 * 明显的刻度，每多少块显示一个明显刻度
 */
const conspicuousScale = shallowRef(10);

/**
 * 通过帧数获取标注
 */
const getLabelByChunkIndex = (chunkIndex: number) => {
  const frame = chunkIndex * density.value;

  if (frame % frameRate.value == 0) {
    const hh = Math.trunc(frame / frameRate.value / 60 / 60);
    const mm = Math.trunc((frame / frameRate.value - hh * 60 * 60) / 60);
    const ss = frame / frameRate.value - mm * 60;
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  } else {
    return `${frame % frameRate.value} f`;
  }
};

export const useTimelineScaleStore = defineStore("timeline-scale", () => {
  return {
    width,
    zoom,
    frameRate,
    chunks,
    chunkWidth,
    density,
    conspicuousScale,
    getFrameWidth,
    getLabelByChunkIndex,
  };
});
