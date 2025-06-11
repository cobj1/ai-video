// types/timeline.d.ts

// 1. 单个片段的通用接口 (Clip)
export interface Clip {
  id: string; // 唯一ID，用于跟踪和选择
  type: "video" | "audio" | "image" | "text" | "group"; // 片段类型

  // 在时间轴上的位置和帧数
  timelineStartFrame: number; // 在时间轴上的开始帧 (帧数)
  timelineDurationFrames: number; // 在时间轴上的持续帧数 (帧数)

  // 原始素材的剪辑点 (如果适用，例如视频剪辑)
  sourceStartFrame?: number; // 原始素材内部的开始帧 (帧数，用于剪辑/裁剪)
  sourceDurationFrames?: number; // 原始素材内部的持续帧数 (帧数，用于剪辑/裁剪)
  // 注意：对于非视频素材（如图片、文本），sourceStartFrame/sourceDurationFrames 概念可能不适用
  // 或者可以视为 0 和其原始“帧”长度（图片通常是1帧，文本可无限长）

  // 视觉层级 (用于在预览区决定哪个元素在上层)
  zIndex?: number;

  // 变换属性 (与帧数无关，与预览区渲染尺寸相关)
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;

  // 关键帧动画 (基于帧，可后续扩展)
  // keyframes?: {
  //     [property: string]: { frame: number; value: any; easing?: string }[];
  // }

  // 效果/滤镜
  // effects?: { type: string; params: any }[];
}

// 2. 特定类型的片段 (继承 Clip)
export interface VideoClip extends Clip {
  type: "video";
  assetId: string; // 必须关联一个视频素材
  originalVideoTotalFrames: number; // 原始视频总帧数
  originalVideoWidth: number;
  originalVideoHeight: number;
  originalVideoFPS: number; // 原始视频的帧率（重要！用于转换）
  volume?: number;
  speed?: number;
}

export interface AudioClip extends Clip {
  type: "audio";
  assetId: string; // 必须关联一个音频素材
  // 音频没有“帧”的概念，但可以在时间轴上以帧为单位进行操作
  // 这里的 durationFrames 会被转换为实际的音频时长
  originalAudioDurationSeconds: number; // 原始音频总时长（秒）
  volume?: number;
}

export interface ImageClip extends Clip {
  type: "image";
  assetId: string;
  originalImageWidth: number;
  originalImageHeight: number;
  // 图片通常只占用 timelineDurationFrames 这么长的时间
}

export interface TextClip extends Clip {
  type: "text";
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
}

// 3. 轨道 (Track) - 保持不变
export interface Track {
  id: string;
  type: "video" | "audio" | "overlay";
  name?: string;
  clips: Clip[];
  isLocked?: boolean;
  isVisible?: boolean;
}

// 4. 时间轴的整体状态 (Pinia Store) - 核心变化：增加 projectFPS
export interface TimelineState {
  tracks: Track[];
  currentPlayheadFrame: number; // 当前播放头位置 (帧数)
  projectTotalFrames: number; // 整个项目的时间轴总帧数
  projectFPS: number; // 项目的统一帧率 (例如 30, 60)。**这是核心！**
  zoomLevel: number; // 时间轴缩放级别 (像素/帧)
  selectedClipId: string | null;
}
