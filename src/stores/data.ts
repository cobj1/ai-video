import type { ID } from "@/types/common";
import type { LayerItem } from "@/types/layer";
import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";

const layers = ref<LayerItem[]>([
  {
    id: 0,
    el: null,
    media: [
      {
        id: `medium_0`,
        el: null,
        view: {
          title: "medium_0",
          thumb: "",
        },
        time: {
          start: 100,
          end: 300,
        },
        location: {
          x: 0,
          y: 0,
        },
      },
      {
        id: `medium_1`,
        el: null,
        view: {
          title: "medium_1",
          thumb: "",
        },
        time: {
          start: 500,
          end: 800,
        },
        location: {
          x: 0,
          y: 0,
        },
      },
    ],
  },
  {
    id: 1,
    el: null,
    media: [],
  },
  {
    id: 2,
    el: null,
    media: [],
  },
]);

/**
 * 获取图层 El 元素
 */
const layerEls = computed(() => layers.value.map((item) => item.el));

/**
 * 媒体重排
 */
const mediaRearrange = () => {};

export const useDataStore = defineStore("data", () => {
  return { layers, layerEls };
});
