import type { ID } from "@/types/common";
import { useFindMediaById } from "./useFind";
import { useMoveableStore } from "@/stores/editor/moveable";
import { nextTick } from "vue";

export const useMediaOrigin = (mediaid: ID) => {
  const media = useFindMediaById(mediaid) as any;

  if (media && media.el != null) {
    const moveableStore = useMoveableStore();

    moveableStore.target = null;

    nextTick(() => {
      const computedStyle = window.getComputedStyle(media.el);

      const transformValue = computedStyle.getPropertyValue("transform");

      try {
        const matrix = new DOMMatrix(transformValue);

        matrix.e = 0;

        matrix.f = 0;

        media.el.style.transform = matrix.toString();
      } catch (e) {
        console.error(e);
      }

      nextTick(() => {
        moveableStore.target = media.el;
        moveableStore.getMoveableRef.value.updateTarget();
      });
    });
  }
};
