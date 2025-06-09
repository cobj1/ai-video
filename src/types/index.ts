/**
 * 时间轴上元素数据结构
 *
 */
export interface Element {
  id: string;

  // 'video', 'audio', 'text', 'image'
  type: string;

  // 时间轴起始时间，帧
  start: number;

  // 持续时间，帧
  duration: number;

  // 原始素材文件引用或 URL
  source: null;

  // 位置、缩放、旋转等
  transform: null;

  // 文本内容、图片 URL 等
  content: null;

  effects: null;
}

interface Clip {
  id: string;
  type: "video" | "audio" | "image" | "text";
  assetId: string; // 关联素材库中的ID
  startTime: number; // 在时间轴上的开始时间 (秒)
  duration: number; // 片段在时间轴上的持续时间 (秒)
  sourceStartTime?: number; // 原始素材内部的开始时间 (用于剪辑)
  sourceDuration?: number; // 原始素材内部的持续时间 (用于剪辑)
  // ... 其他通用属性，如 z-index (层级)
}

interface VideoClip extends Clip {
  type: "video";
  speed?: number; // 播放速度
  volume?: number;
}

interface ImageClip extends Clip {
  type: "image";
  // ... 图像特有属性：位置、缩放、旋转、不透明度
}

interface TextClip extends Clip {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  // ... 文本特有属性：位置、缩放、旋转、不透明度、对齐方式
}

// 时间轴轨道
interface Track {
  id: string;
  type: "video" | "audio"; // 视频轨道或音频轨道
  clips: Clip[]; // 轨道上的片段
}

interface TimelineState {
  tracks: Track[];
  totalDuration: number; // 整个项目的时间轴总长
  currentTime: number; // 当前播放头位置 (秒)
  scale: number; // 时间轴缩放比例 (像素/秒)
}
