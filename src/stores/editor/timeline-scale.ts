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
const zoom = shallowRef(6);

watchThrottled(
  zoom,
  () => {
    if (zoom.value == 1) {
      density.value = 1;
      chunkWidth.value = 200;
      conspicuousScale.value = 2;
    }
    if (zoom.value == 2) {
      density.value = 1;
      chunkWidth.value = 100;
      conspicuousScale.value = 2;
    }
    if (zoom.value == 3) {
      density.value = 1;
      chunkWidth.value = 50;
      conspicuousScale.value = 2;
    }
    if (zoom.value == 4) {
      density.value = 1;
      chunkWidth.value = 25;
      conspicuousScale.value = 10;
    }
    if (zoom.value == 5) {
      density.value = 3;
      chunkWidth.value = 50;
      conspicuousScale.value = 5;
    }
    if (zoom.value == 6) {
      density.value = 3;
      chunkWidth.value = 25;
      conspicuousScale.value = 10;
    }
    if (zoom.value == 7) {
      density.value = 12;
      chunkWidth.value = 50;
      conspicuousScale.value = 5;
    }
    if (zoom.value == 8) {
      density.value = 12;
      chunkWidth.value = 25;
      conspicuousScale.value = 10;
    }
    if (zoom.value == 9) {
      density.value = 48;
      chunkWidth.value = 50;
      conspicuousScale.value = 5;
    }
    if (zoom.value == 10) {
      density.value = 48;
      chunkWidth.value = 25;
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
const contentDuration = shallowRef(200);

/**
 * 每个块代表包含几个序列帧
 */
const density = shallowRef(3);

/**
 * 显示几个刻度块,显示内容时长四倍的刻度快，参照jianying
 */
const chunks = computed(() =>
  Math.max(Math.trunc(contentDuration.value / density.value) * 4, 100)
);

/**
 * 每个刻度块的宽度
 */
const chunkWidth = shallowRef(25);

/**
 * 渲染帧的宽度，每个序列帧在时间轴所占的宽度，不影响正常合成。单位 px
 */
const getFrameWidth = () => chunkWidth.value / density.value;

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

/**
 * 获取一个正整数的所有正约数（因数）。
 *
 * @param {number} num 要查找约数的正整数。
 * @returns {number[]} 包含所有约数的数组，按升序排列。
 * 如果输入不是正整数，则返回空数组。
 */
function getDivisors(num: number) {
  // 检查输入是否为有效正整数
  if (typeof num !== "number" || !Number.isInteger(num) || num <= 0) {
    console.warn("输入必须是正整数。");
    return [];
  }

  const divisors = [];
  const limit = Math.sqrt(num); // 计算平方根，优化循环次数

  for (let i = 1; i <= limit; i++) {
    if (num % i === 0) {
      // 如果 i 是约数
      divisors.push(i);

      // 如果 i 不是 num 的平方根，那么 num / i 也是约数
      // 避免对于完全平方数（如 9, 16）重复添加其平方根（如 3, 4）
      if (i * i !== num) {
        divisors.push(num / i);
      }
    }
  }

  // 将约数按升序排列
  divisors.sort((a, b) => a - b);

  return divisors;
}

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
