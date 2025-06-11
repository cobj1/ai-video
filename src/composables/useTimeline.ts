import { useMoveableStore } from "@/stores/moveable";
import { useTimelineStore } from "@/stores/timeline";
import type { Track, Clip } from "@/types/timeline";
import { nextTick } from "vue";

const timelineStore = useTimelineStore();

/**
 * 获取鼠标放置在那个图层上
 */

export const useMouseInTrack = (inputEvent: MouseEvent) => {
  return timelineStore.tracks.find((track: Track) => {
    if (track.el == null) return false;

    const rect = track.el.getBoundingClientRect();

    // 计算鼠标相对于 div 左上角的坐标
    const x = inputEvent.clientX - rect.left;
    const y = inputEvent.clientY - rect.top;

    return x > 0 && x < rect.width && y > 0 && y < rect.height;
  });
};

/**
 * 获取鼠标放置在那个图层顶部
 */

export const useMouseInTrackTop = (
  inputEvent: MouseEvent
): Track | undefined => {
  return timelineStore.tracks.find((track: Track) => {
    if (track.el == null) return false;

    const topEl = track.el.querySelector(".timeline-track-top");

    if (topEl == null) return false;

    const rect = topEl.getBoundingClientRect();

    // 计算鼠标相对于 div 左上角的坐标
    const x = inputEvent.clientX - rect.left;
    const y = inputEvent.clientY - rect.top;

    return x > 0 && x < rect.width && y > 0 && y < rect.height;
  });
};

/**
 * 通过 clipid 获取 clip 所在的位置
 */
export const useFindClipindexByClipid = (clipid: string) => {
  let index = null;

  timelineStore.tracks.forEach((track, trackIndex) => {
    track.clips.forEach((clip, clipIndex) => {
      if (clip.id == clipid) index = { trackIndex, clipIndex };
    });
  });
  return index;
};

/**
 * 通过 id 获取 Track 所在的位置
 */
export const useFindTrackindexByTrackid = (trackid: string): number => {
  let index = 0;

  timelineStore.tracks.forEach((track, trackIndex) => {
    if (track.id == trackid) index = trackIndex;
  });
  return index;
};

/**
 * 通过 clipid 获取 clip
 */
export const useFindClipByClipid = (clipid: string): Clip => {
  const clipindex = useFindClipindexByClipid(clipid) as any;

  if (clipindex != null) {
    return timelineStore.tracks[clipindex.trackIndex].clips[
      clipindex.clipIndex
    ];
  }
  return clipindex;
};

export const useFindTrackByTrackId = (trackId: string): Track => {
  const trackIndex = useFindTrackindexByTrackid(trackId) as any;

  if (trackIndex != null) {
    return timelineStore.tracks[trackIndex];
  }
  return trackIndex;
};

export const useFindTrackByClipid = (clipid: string) => {
  const clipindex = useFindClipindexByClipid(clipid) as any;

  if (clipindex != null) {
    return timelineStore.tracks[clipindex.trackIndex];
  }
  return clipindex;
};

/**
 * 媒体转移到其他图层
 */
export const useTransferTrack = (clipid: string, trackId: string): boolean => {
  const clipindex = useFindClipindexByClipid(clipid) as any;
  const trackIndex = useFindTrackindexByTrackid(trackId) as any;

  if (
    clipindex != null &&
    trackIndex != null &&
    clipindex.trackIndex != trackIndex
  ) {
    const clip =
      timelineStore.tracks[clipindex.trackIndex].clips[clipindex.clipIndex];
    if (clip) {
      timelineStore.tracks[clipindex.trackIndex].clips.splice(
        clipindex.clipIndex,
        1
      );
      timelineStore.tracks[trackIndex].clips.push(clip);

      return true;
    }
  }

  return false;
};

export const useClipLocation = (clipid: string) => {
  const clip = useFindClipByClipid(clipid);

  if (clip.el) {
    const clipRect = clip.el.getBoundingClientRect();

    const track = useFindTrackByClipid(clipid);

    const trackRect = track.el.getBoundingClientRect();

    return {
      clipRect,
      trackRect,
      offset: {
        x: clipRect.x - trackRect.x,
        y: clipRect.y - trackRect.y,
      },
    };
  }
  return null;
};

export const useClipFocus = (clipid: string) => {
  nextTick(() => {
    const moveableStore = useMoveableStore();

    const clip = useFindClipByClipid(clipid);

    moveableStore.target = clip.el;
  });
};

export const useClipOrigin = (clipid: string) => {
  const clip = useFindClipByClipid(clipid) as any;

  if (clip && clip.el != null) {
    const moveableStore = useMoveableStore();

    moveableStore.target = null;

    nextTick(() => {
      const computedStyle = window.getComputedStyle(clip.el);

      const transformValue = computedStyle.getPropertyValue("transform");

      try {
        const matrix = new DOMMatrix(transformValue);

        matrix.e = 0;

        matrix.f = 0;

        clip.el.style.transform = matrix.toString();
      } catch (e) {
        console.error(e);
      }

      nextTick(() => {
        moveableStore.target = clip.el;
        moveableStore.getMoveableRef.value.updateTarget();
      });
    });
  }
};

export const useUpdateClipStartFrame = (clipid: string) => {
  const location = useClipLocation(clipid);

  const clip = useFindClipByClipid(clipid);

  if (clip && location) {
    const start = Math.round(location.offset.x / timelineStore.pixelsPerFrame);

    clip.startFrame = start;
  }
};
