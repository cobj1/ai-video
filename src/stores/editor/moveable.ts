import { defineStore } from "pinia";
import { nextTick, ref } from "vue";
import { useMouseInLayer } from "@/hooks/useMouseInLayer";
import { useTransferLayer } from "@/hooks/useTransferLayer";
import { useFindMediaById } from "@/hooks/useFind";
import { useMediaLocation } from "@/hooks/useLocation";
import { useTimelineScaleStore } from "./timeline-scale";
import { useDataStore } from "../data";
import { useMediaRearrange } from "@/hooks/useRearrange";

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
  draggable: true,
  throttleDrag: 1,
  edgeDraggable: false,
  startDragRotate: 0,
  throttleDragRotate: 0,
  resizable: true,
  keepRatio: false,
  snappable: true,
  snapDirections: { left: true, right: true },
  elementSnapDirections: { left: true, right: true },
  snapGap: true,
  edge: [],
});

let moveableRef = ref();

const setMoveableRef = (ref: any) => (moveableRef = ref);

const onDrag = (e: any) => {
  e.target.style.transform = e.transform;

  const location = useMediaLocation(e.target.id);

  const media = useFindMediaById(e.target.id);
  if (media && location) {
    const frames = media.time.end - media.time.start;
    const start = Math.trunc(
      location.offset.x / timelineScaleStore.getFrameWidth
    );
    const end = start + frames;

    dataStore.setTime(media, { start, end });
  }
};

const onDragStart = (e: any) => {};

const onDragEnd = (e: any) => {
  const layer = useMouseInLayer(e.inputEvent);

  if (layer) {
    if (useTransferLayer(e.target.id, layer.id)) {
      nextTick(() => {
        const medium = useFindMediaById(e.target.id);

        target.value = medium.el;
      });
    } else {
      useMediaRearrange(e.target.id);
    }
  } else {
    useMediaRearrange(e.target.id);
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

const onClickMedia = (event: any, eventData: any) => {
  target.value = event.target;

  data.value = eventData;
};

const onDragStartMedia = (event: any, eventData: any) => {
  const moveable = moveableRef.value;

  event.preventDefault();

  moveable.waitToChangeTarget().then(() => {
    moveable.dragStart(event);
  });

  target.value = event.target;

  data.value = eventData;
};

export const useMoveableStore = defineStore("moveable", () => {
  return {
    target,
    data,
    attributes,
    setMoveableRef,
    onDrag,
    onDragStart,
    onDragEnd,
    onResize,
    onRender,
    onClickMedia,
    onDragStartMedia,
  };
});
