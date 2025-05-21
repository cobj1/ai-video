import { defineStore } from "pinia";
import { ref } from "vue";
import { useTheme } from "vuetify";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const dark = ref(true);

    return { dark };
  },
  {
    persist: {
      afterHydrate: (ctx) => {
        const theme = useTheme();

        if (theme.global.current.value.dark != ctx.store.dark) {
          theme.global.name.value = theme.global.current.value.dark
            ? "light"
            : "dark";
        }
      },
    },
  }
);
