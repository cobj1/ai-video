import type { ID } from "@/types/common";
import { useFindIndexByLayerid, useFindIndexByMediaid } from "./useFind";
import { useDataStore } from "@/stores/data";

const dataStore = useDataStore();

/**
 * 媒体转移到其他图层
 */
export const useTransferLayer = (mediaid: ID, layerid: ID): boolean => {
  const mediumIndex = useFindIndexByMediaid(mediaid) as any;

  const layerIndex = useFindIndexByLayerid(layerid);

  if (
    mediumIndex != null &&
    layerIndex != null &&
    mediumIndex.layerIndex != layerIndex
  ) {
    const medium =
      dataStore.layers[mediumIndex.layerIndex].media[mediumIndex.mediumIndex];
    if (medium) {
      dataStore.layers[mediumIndex.layerIndex].media.splice(
        mediumIndex.mediumIndex,
        1
      );
      dataStore.layers[layerIndex].media.push(medium);

      return true;
    }
  }

  return false;
};
