import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { useTimelineStore } from "./timeline";

export const usePreviewAreaStore = defineStore("preview-area", () => {
  const timelineStore = useTimelineStore();
  
  const fullscreenControl = shallowRef();

  let etroWorker: Etroworker | null = null;

  // 切换播放/暂停
  const togglePlay = () => {
    if (!etroWorker) return;
    if (isPlaying.value) {
      etroWorker.pause();
    } else {
      // 从当前播放头位置开始播放
      etroWorker.play(timelineStore.currentPlayheadFrame);
    }
  };

  return { fullscreenControl };
});
