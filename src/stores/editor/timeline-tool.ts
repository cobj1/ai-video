import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { refThrottled } from "@vueuse/core";

const timelineScaleZoom = ref(1);

const timelineScaleZoomThrottled = refThrottled(timelineScaleZoom, 100);

export const useTimelineToolStore = defineStore(
  "timeline-tool",
  () => {
    return { timelineScaleZoom, timelineScaleZoomThrottled };
  },
  {
    persist: true,
  }
);
