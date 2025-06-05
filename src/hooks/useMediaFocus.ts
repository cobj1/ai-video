import type { ID } from "@/types/common";
import { useFindMediaById } from "./useFind";
import { useMoveableStore } from "@/stores/editor/moveable";
import { nextTick } from "vue";

export const useMediaFocus = (mediaid: ID) => {
  nextTick(() => {
    const moveableStore = useMoveableStore();

    const medium = useFindMediaById(mediaid);

    moveableStore.target = medium.el;
  });
};
