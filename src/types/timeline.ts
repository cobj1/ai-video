// types/timeline.ts
/**
 * @file 定义时间轴相关的类型接口
 */

/**
 * 时间轴切片数据接口
 */
export interface Clip {
  id: string; // 唯一ID
  el: HTMLElement | null; // 切片对应的DOM元素引用
  trackId: string; // 所属轨道的ID
  mediaType: 'video' | 'audio' | 'image' | 'text'; // 媒体类型
  name: string; // 切片名称 (例如文件名)
  startFrame: number; // 切片在时间轴上的起始帧 (项目帧)
  durationFrames: number; // 切片在时间轴上持续的帧数 (项目帧)
  mediaSourcePath: string; // 原始媒体文件路径或ID

  // 媒体源的额外信息 (如果需要，例如原始视频的起始帧和持续帧)
  // 这允许我们修剪切片而不改变原始媒体
  mediaStartTime?: number; // 媒体文件内部的起始时间 (例如，视频从第X秒开始播放，单位：帧)
  mediaDuration?: number; // 媒体文件内部的持续时间 (单位：帧)
}

/**
 * 时间轴轨道数据接口
 */
export interface Track {
  id: string;
  el: HTMLElement | null; // 轨道对应的DOM元素引用
  name: string;
  type: 'video' | 'audio'; // 轨道类型，例如视频轨道或音频轨道
  clips: Clip[]; // 该轨道上的切片数组
}