import { type ID, type TimeBlock } from "@/types/common";
import type { LayerItem } from "@/types/layer";
import type { Media } from "@/types/media";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { v4 as uuid } from "uuid";

const layers = ref<LayerItem[]>([
  {
    id: uuid(),
    el: null,
    media: [
      {
        id: uuid(),
        el: null,
        view: {
          title: "medium_0",
          thumb: "",
        },
        time: {
          start: 30,
          end: 90,
        },
        location: {
          x: 0,
          y: 0,
        },
      },
      {
        id: uuid(),
        el: null,
        view: {
          title: "medium_1",
          thumb: "",
        },
        time: {
          start: 120,
          end: 200,
        },
        location: {
          x: 0,
          y: 0,
        },
      },
    ],
  },
  // { id: uuid(), el: null, media: [] },
  // { id: uuid(), el: null, media: [] },
  // { id: uuid(), el: null, media: [] },
  // { id: uuid(), el: null, media: [] },
  // { id: uuid(), el: null, media: [] },
  // { id: uuid(), el: null, media: [] },
]);

/**
 * 获取图层 El 元素
 */
const layerEls = computed(() => layers.value.map((item) => item.el));

const setTime = (media: Media, time: TimeBlock) => {
  media.time.start = time.start;
  media.time.end = time.end;
};

const insertLayer = (index: number) => {
  const newLayer = { id: uuid(), el: null, media: [] };

  layers.value.splice(index, 0, newLayer);

  return newLayer;
};

export const useDataStore = defineStore("data", () => {
  return { layers, layerEls, setTime, insertLayer };
});
