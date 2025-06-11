import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  useMouseInTrack,
  useMouseInTrackTop,
  useUpdateClipStartFrame,
  useFindTrackindexByTrackid,
  useTransferTrack,
  useClipFocus,
  useClipOrigin,
} from "@/composables/useTimeline";
import { useTimelineStore } from "@/stores/timeline";

const timelineStore = useTimelineStore();

/**
 * 选中的数据
 */
const data = ref();

/**
 * 选中的元素
 */
const target = ref();

/**
 * 拖动中状态（Dragging）
 */
const dragging = ref(false);

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
  //   container: ".timeline-track",
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

const onDragStart = (e: any) => {
  dragging.value = true;
};

const onDrag = (e: any) => {};

const onDragEnd = (e: any) => {
  dragging.value = false;

  useUpdateClipStartFrame(e.target.id);

  const track = useMouseInTrack(e.inputEvent);

  const trackTop = useMouseInTrackTop(e.inputEvent);

  // 鼠标放置在图层顶部处理区域
  if (trackTop) {
    const index = useFindTrackindexByTrackid(trackTop.id);

    const newTrack = timelineStore.insertTrack(
      index + 1,
      "video",
      `新视频轨道 ${index + 1}`
    );

    if (useTransferTrack(e.target.id, newTrack.id)) {
      useClipFocus(e.target.id);
    } else {
      useClipOrigin(e.target.id);
    }
  } else if (track) {
    /* 资源更换图层 */
    if (useTransferTrack(e.target.id, track.id)) {
      useClipFocus(e.target.id);
    } else {
      useClipOrigin(e.target.id);
    }
  } else {
    useClipOrigin(e.target.id);
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
  scrollContainer.scrollBy(direction[0] * 10, direction[1] * 1);
};

const onClickClip = (event: any, eventData: any) => {
  target.value = event.target;

  data.value = eventData;
};

const onDragStartClip = (event: any, eventData: any) => {
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
    dragging,
    attributes,
    getMoveableRef,
    setMoveableRef,
    onDrag,
    onDragStart,
    onDragEnd,
    onResize,
    onRender,
    onScroll,
    onClickClip,
    onDragStartClip,
  };
});
