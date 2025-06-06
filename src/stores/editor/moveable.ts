import { defineStore } from "pinia";
import { computed, nextTick, ref } from "vue";
import { useMouseInLayer } from "@/hooks/useMouseInLayer";
import { useTransferLayer } from "@/hooks/useTransferLayer";
import { useTimelineScaleStore } from "./timeline-scale";
import { useDataStore } from "../data";
import { useMediaOrigin } from "@/hooks/useRearrange";
import { useSetMediaTime } from "@/hooks/useSetMediaTime";
import { useMediaFocus } from "@/hooks/useMediaFocus";
import { useMouseInLayerTop } from "@/hooks/useMouseInLayerTop";
import { useFindIndexByLayerid } from "@/hooks/useFind";

const timelineScaleStore = useTimelineScaleStore();

const dataStore = useDataStore();

/**
 * 选中的数据
 */
const data = ref();

/**
 * 选中的元素
 */
const target = ref();

const attributes = ref({
  resizable: true,
  draggable: true,
  scrollable: true,
  keepRatio: false,
  edgeDraggable: false,
  throttleDrag: 1,
  startDragRotate: 0,
  throttleDragRotate: 0,
  // scrollOptions: {
  //   container: ".timeline-layer",
  //   threshold: 30,
  //   checkScrollEvent: false,
  //   throttleTime: 0,
  // },
  snappable: true,
  snapDirections: { left: true, right: true },
  elementSnapDirections: { left: true, right: true },
  snapGap: true,
  edge: [],
});

let moveableRef = ref();

const getMoveableRef = computed(() => moveableRef);

const setMoveableRef = (ref: any) => (moveableRef = ref);

const onDragStart = (e: any) => {};

const onDrag = (e: any) => {};

const onDragEnd = (e: any) => {
  useSetMediaTime(e.target.id);

  const layer = useMouseInLayer(e.inputEvent);

  const layerTop = useMouseInLayerTop(e.inputEvent);

  // 鼠标放置在图层顶部处理区域
  if (layerTop) {
    const index = useFindIndexByLayerid(layerTop.id);

    const newLayer = dataStore.insertLayer(index + 1);

    if (useTransferLayer(e.target.id, newLayer.id)) {
      useMediaFocus(e.target.id);
    } else {
      useMediaOrigin(e.target.id);
    }
  } else if (layer) {
    /* 资源更换图层 */
    if (useTransferLayer(e.target.id, layer.id)) {
      useMediaFocus(e.target.id);
    } else {
      useMediaOrigin(e.target.id);
    }
  } else {
    useMediaOrigin(e.target.id);
  }
};

const onResize = (e: any) => {
  console.log(e);
  // e.target.style.width = `${e.width}px`;
  // e.target.style.height = `${e.height}px`;
  // e.target.style.transform = e.drag.transform;
};

const onRender = (e: any) => {
  e.target.style.cssText += e.cssText;
};

const onScroll = ({ scrollContainer, direction }: any) => {
  scrollContainer.scrollBy(direction[0] * 10, direction[1] * 10);
};

const onClickMedia = (event: any, eventData: any) => {
  target.value = event.target;

  data.value = eventData;
};

const onDragStartMedia = (event: any, eventData: any) => {
  const moveable = moveableRef.value;

  event.preventDefault();

  moveable.waitToChangeTarget().then(() => moveable.dragStart(event));

  target.value = event.target;

  data.value = eventData;
};

export const useMoveableStore = defineStore("moveable", () => {
  return {
    target,
    data,
    attributes,
    getMoveableRef,
    setMoveableRef,
    onDrag,
    onDragStart,
    onDragEnd,
    onResize,
    onRender,
    onScroll,
    onClickMedia,
    onDragStartMedia,
  };
});
