// stores/editor/timeline-scale.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimelineStore = defineStore("timeline", () => {
  // --- 核心缩放状态：每帧对应的像素宽度 ---
  // 这将是时间轴渲染计算的主要依据
  const pixelsPerFrame = ref(50); // 默认值，例如 10px/帧

  // --- 项目基本信息 ---
  const frameRate = ref(30); // 帧速率，每秒多少帧 (Project FPS)
  const contentDurationFrames = ref(0); // 内容总时长，单位帧 (Project Total Frames)

  // --- Actions ---
  /**
   * 设置时间轴的缩放级别。
   * @param pixelsPerFrameValue 每帧对应的像素宽度。
   */
  function setPixelsPerFrame(pixels: number) {
    // 可以添加缩放范围限制，例如 0.1px/帧 到 100px/帧
    pixelsPerFrame.value = Math.max(0.1, Math.min(pixels, 100));
  }

  /**
   * 设置项目帧率。
   * @param rate 帧率值。
   */
  function setFrameRate(rate: number) {
    frameRate.value = rate;
  }

  /**
   * 设置时间轴的总内容时长 (以帧为单位)。
   * @param duration 帧数。
   */
  function setContentDuration(duration: number) {
    contentDurationFrames.value = duration;
  }

  // --- 导出状态和 Actions ---
  return {
    pixelsPerFrame,
    frameRate,
    contentDurationFrames,
    setPixelsPerFrame,
    setFrameRate,
    setContentDuration,
  };
});