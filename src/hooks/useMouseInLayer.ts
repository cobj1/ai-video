import { useDataStore } from "@/stores/data";
import type { LayerItem } from "@/types/layer";

const dataStore = useDataStore();

/**
 * 获取鼠标放置在那个图层上
 */

export const useMouseInLayer = (inputEvent: MouseEvent) => {
  return dataStore.layers.find((item: LayerItem) => {
    if (item.el == null) return false;
    
    const rect = item.el.getBoundingClientRect();

    // 计算鼠标相对于 div 左上角的坐标
    const x = inputEvent.clientX - rect.left;
    const y = inputEvent.clientY - rect.top;

    return x > 0 && x < rect.width && y > 0 && y < rect.height;
  });
};
