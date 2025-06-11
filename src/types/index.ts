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
