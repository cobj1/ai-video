import { defineStore } from "pinia";
import { ref } from "vue";

export const useFooterStore = defineStore(
  "footer",
  () => {
    const message = ref<string>();

    return { message };
  },
  {
    persist: true,
  }
);
