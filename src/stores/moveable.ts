import { defineStore } from "pinia";
import { computed, nextTick, ref, watch } from "vue";
import {
  useMouseInTrack,
  useMouseInTrackTop,
  useUpdateClipStartFrame,
  useFindTrackindexByTrackid,
  useTransferTrack,
  useClipFocus,
  useClipOrigin,
  useFindClipByClipid,
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
  snappable: true,
  snapDirections: { left: true, right: true },
  elementSnapDirections: { left: true, right: true },
  snapGap: true,
  edge: [],
});

let moveableRef = ref();

const getMoveableRef = computed(() => moveableRef);

const setMoveableRef = (ref: any) => (moveableRef = ref);

/**
 * Moveable 的额外属性，例如 elementGuidelines
 */

const elementGuidelines = computed<HTMLElement[]>(() => {
  const clipElements: HTMLElement[] = [];
  timelineStore.tracks.forEach((track) => {
    track.clips.forEach((clip) => {
      if (clip.el && clip.el != target.value) {
        // 确保 clip.el 存在且不是当前选中的元素
        clipElements.push(clip.el);
      }
    });
  });
  return clipElements;
});

watch([() => [timelineStore.pixelsPerFrame]], () => {
  if (target.value && getMoveableRef.value) {
    nextTick(() => {
      moveableRef.value.updateTarget();
    });
  }
});

const onDragStart = (e: any) => {
  dragging.value = true;
};

const onDrag = (e: any) => {};

const onDragEnd = (e: any) => {
  dragging.value = false;

  const clipId = e.target.id;

  useUpdateClipStartFrame(clipId);

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

    if (useTransferTrack(clipId, newTrack.id)) {
      useClipFocus(clipId);
    } else {
      useClipOrigin(clipId);
    }
  } else if (track) {
    /* 资源更换图层 */
    if (useTransferTrack(clipId, track.id)) {
      useClipFocus(clipId);
    } else {
      useClipOrigin(clipId);
    }
  } else {
    useClipOrigin(clipId);
  }
};

const onResizeEnd = (e: any) => {
  const clipId = e.target.id;

  const currentClip = useFindClipByClipid(clipId);

  if (!currentClip) return;

  // Moveable 提供的 width 是 DOM 元素的当前宽度
  const newWidthPixels = e.lastEvent.width;

  let newDurationFrames = Math.round(
    newWidthPixels / timelineStore.pixelsPerFrame
  );

  newDurationFrames = Math.max(1, newDurationFrames); // 最小 1 帧

  currentClip.durationFrames = newDurationFrames;

  useUpdateClipStartFrame(clipId);

  useClipOrigin(clipId);
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
    elementGuidelines,
    getMoveableRef,
    setMoveableRef,
    onDrag,
    onDragStart,
    onDragEnd,
    onResizeEnd,
    onRender,
    onScroll,
    onClickClip,
    onDragStartClip,
  };
});
