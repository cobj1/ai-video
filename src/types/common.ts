export type ID = number | string;

/**
 * 位置信息：x 坐标，y 坐标
 */
export interface Location {
  x: number;
  y: number;
}

/**
 * 时间块：开始时间帧，结束时间帧
 */
export interface TimeBlock {
  start: number;
  end: number;
}

/**
 * 视图：缩略图，标题
 */
export interface View {
  thumb: string;
  title: string;
}
