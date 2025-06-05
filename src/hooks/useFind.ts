import { useDataStore } from "@/stores/data";
import type { ID } from "@/types/common";
import type { Media } from "@/types/media";

const dataStore = useDataStore();

/**
 * 通过 id 获取媒体所在的位置
 */
export const useFindIndexByMediaid = (mediaid: ID) => {
  let index = null;

  dataStore.layers.forEach((layer, layerIndex) => {
    layer.media.forEach((medium, mediumIndex) => {
      if (medium.id == mediaid) index = { layerIndex, mediumIndex };
    });
  });
  return index;
};

/**
 * 通过 id 获取图层所在的位置
 */
export const useFindIndexByLayerid = (layerid: ID) => {
  let index = null;

  dataStore.layers.forEach((layer, layerIndex) => {
    if (layer.id == layerid) index = layerIndex;
  });
  return index;
};

export const useFindMediaById = (mediaid: ID): Media => {
  const mediaIndex = useFindIndexByMediaid(mediaid) as any;

  if (mediaIndex != null) {
    return dataStore.layers[mediaIndex.layerIndex].media[
      mediaIndex.mediumIndex
    ];
  }
  return mediaIndex;
};

export const useFindLayerById = (layerid: ID) => {
  const layerIndex = useFindIndexByLayerid(layerid) as any;

  if (layerIndex != null) {
    return dataStore.layers[layerIndex];
  }
  return layerIndex;
};

export const useFindLayerByMediaid = (mediaid: ID) => {
  const mediaIndex = useFindIndexByMediaid(mediaid) as any;

  if (mediaIndex != null) {
    return dataStore.layers[mediaIndex.layerIndex];
  }
  return mediaIndex;
};
