// types/timeline.ts
/**
 * @file 定义时间轴相关的类型接口
 */

/**
 * 时间轴切片数据接口
 */
export interface Clip {
  id: string; // 唯一ID
  trackId: string; // 所属轨道ID (用于查找 Track)
  name: string; // 切片名称 (例如文件名)
  mediaType: "video" | "audio" | "image" | "text"; // 媒体类型
  mediaSourcePath: string; // 原始媒体文件路径或ID
  startFrame: number; // 切片在时间轴上的起始帧 (项目帧)
  durationFrames: number; // 切片在时间轴上持续的帧数 (项目帧)

  // 媒体源的额外信息 (如果需要，例如原始视频的起始帧和持续帧)
  // 这允许我们修剪切片而不改变原始媒体
  mediaStartTime?: number; // 媒体文件内部的起始时间 (例如，视频从第X秒开始播放，单位：帧)
  mediaDuration?: number; // 媒体文件内部的持续时间 (单位：帧)

  // 用于 Moveable 调整和 etro.js 渲染的视觉属性
  x: number; // 在预览画面中的 X 坐标 (像素)，相对于预览区左上角
  y: number; // 在预览画面中的 Y 坐标 (像素)，相对于预览区左上角
  width: number;
  height: number;
  scaleX: number; // X 轴缩放比例 (1为原始大小)
  scaleY: number; // Y 轴缩放比例 (1为原始大小)
  rotation: number; // 旋转角度 (度，例如 0-360)
  opacity: number; // 透明度 (0-1)

  el?: HTMLElement | null; // 用于 Moveable 目标或元素引用 (如果需要，目前主要由 class name 查找)
}

/**
 * 时间轴轨道数据接口
 */
export interface Track {
  id: string;
  name: string;
  type: "video" | "audio"; // 轨道类型，例如视频轨道或音频轨道
  clips: Clip[]; // 该轨道上的切片数组

  el?: HTMLElement | null; // 用于 Moveable 目标或滚动计算
}
