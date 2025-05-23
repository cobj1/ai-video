import { defineStore } from "pinia";
import { ref } from "vue";

export const useAssetsStore = defineStore(
  "assets",
  () => {
    const message = ref<string>();

    return { message };
  },
  {
    persist: true,
  }
);
