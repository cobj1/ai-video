import type { ID } from "@/types/common";
import { useFindLayerByMediaid, useFindMediaById } from "./useFind";

export const useMediaRearrange = (mediaid: ID) => {
  const media = useFindMediaById(mediaid);

  const layer = useFindLayerByMediaid(mediaid);

  if (media?.el) {
    const computedStyle = window.getComputedStyle(media.el);

    const transformValue = computedStyle.getPropertyValue("transform");

    try {
      const matrix = new DOMMatrix(transformValue);

      matrix.f = 0;
      
      media.el.style.transform = matrix.toString();
    } catch (e) {
      console.error(e);
    }
  }
};
