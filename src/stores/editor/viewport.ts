import { defineStore } from "pinia";
import { shallowRef } from "vue";

const fullscreenControl = shallowRef();

export const useViewportStore = defineStore("viewport", () => {
  return { fullscreenControl };
});
