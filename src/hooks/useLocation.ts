import type { ID } from "@/types/common";
import { useFindLayerByMediaid, useFindMediaById } from "./useFind";

export const useMediaLocation = (mediaid: ID) => {
  const media = useFindMediaById(mediaid);
  if (media.el) {
    const mediaRect = media.el.getBoundingClientRect();

    const layer = useFindLayerByMediaid(mediaid);

    const layerRect = layer.el.getBoundingClientRect();

    return {
      mediaRect,
      layerRect,
      offset: {
        x: mediaRect.x - layerRect.x,
        y: mediaRect.y - layerRect.y,
      },
    };
  }
  return null;
};
