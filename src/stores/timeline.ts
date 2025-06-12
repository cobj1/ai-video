// stores/timeline.ts
import { useFindTrackByTrackId } from "@/composables/useTimeline";
import type { Clip, Track } from "@/types/timeline";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTimelineStore = defineStore("timeline", () => {
  // --- 核心缩放状态：每帧对应的像素宽度 ---
  // 这将是时间轴渲染计算的主要依据
  const pixelsPerFrame = ref(10); // 默认值，例如 10px/帧

  // --- 项目基本信息 ---
  const frameRate = ref(30); // 帧速率，每秒多少帧 (Project FPS)
  const contentDurationFrames = ref(0); // 内容总时长，单位帧 (Project Total Frames)

  // --- 时间轴轨道和切片数据 ---
  const tracks = ref<Track[]>([]); // 新增：存储所有轨道的数据

  // --- 计算属性 ---
  // 计算时间轴的总像素宽度
  const totalTimelineWidth = computed(() => {
    return contentDurationFrames.value * pixelsPerFrame.value;
  });

  // --- Actions ---
  /**
   * 设置时间轴的缩放级别。
   * @param pixelsPerFrameValue 每帧对应的像素宽度。
   */
  function setPixelsPerFrame(pixels: number) {
    // 可以添加缩放范围限制，例如 0.1px/帧 到 100px/帧
    pixelsPerFrame.value = Math.max(0.1, Math.min(pixels, 100));
  }

  /**
   * 设置项目帧率。
   * @param rate 帧率值。
   */
  function setFrameRate(rate: number) {
    frameRate.value = rate;
  }

  /**
   * 设置时间轴的总内容时长 (以帧为单位)。
   * @param duration 帧数。
   */
  function setContentDuration(duration: number) {
    contentDurationFrames.value = duration;
  }

  /**
   * 添加一个新轨道
   */
  function insertTrack(
    index: number,
    trackType: "video" | "audio",
    name?: string
  ): Track {
    const newTrack: Track = {
      id: `track-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      el: null,
      name:
        name ||
        `${trackType === "video" ? "视频" : "音频"}轨道 ${
          tracks.value.length + 1
        }`,
      type: trackType,
      clips: [],
    };

    tracks.value.splice(index, 0, newTrack); // 在指定索引处插入新轨道

    // 每次添加轨道后，更新总时长，以防时间轴过短
    updateContentDurationBasedOnClips();
    return newTrack; // 返回新轨道的ID
  }

  /**
   * 向指定轨道添加一个切片
   * @param trackId 切片所属轨道的ID。
   * @param clipData 切片数据 (不包含id和trackId，将自动生成)。
   */
  function addClip(
    trackId: string,
    clipData: Omit<Clip, "id" | "trackId" | "el">
  ): Clip | null {
    const track = useFindTrackByTrackId(trackId); // 确保轨道存在

    if (track) {
      const newClip: Clip = {
        id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        el: null, // 这里可以在后续渲染时设置实际的 DOM 元素
        trackId: trackId,
        ...clipData,
      };
      track.clips.push(newClip);
      // 根据新切片更新时间轴总时长，确保切片可见
      updateContentDurationBasedOnClips();

      return newClip; // 返回新切片
    } else {
      console.warn(`Track with ID ${trackId} not found. Cannot add clip.`);
    }
    return null; // 返回 null 表示添加失败
  }

  /**
   * 更新切片的位置和/或时长
   * @param clipId 要更新的切片ID。
   * @param updates 一个包含要更新属性的对象。
   */
  function updateClip(clipId: string, updates: Partial<Clip>) {
    for (const track of tracks.value) {
      const clipIndex = track.clips.findIndex((c) => c.id === clipId);
      if (clipIndex !== -1) {
        // 使用 Object.assign 浅合并更新，保持响应性
        Object.assign(track.clips[clipIndex], updates);
        // 如果切片位置或时长改变，可能需要更新总时长
        if (
          updates.startFrame !== undefined ||
          updates.durationFrames !== undefined
        ) {
          updateContentDurationBasedOnClips();
        }
        return; // 找到并更新后即可退出
      }
    }
    console.warn(`Clip with ID ${clipId} not found. Cannot update clip.`);
  }

  /**
   * 根据当前所有切片的最大结束帧，更新 contentDurationFrames。
   * 确保时间轴足够长以容纳所有内容。
   */
  function updateContentDurationBasedOnClips() {
    let maxEndFrame = 0;
    for (const track of tracks.value) {
      for (const clip of track.clips) {
        const clipEndFrame = clip.startFrame + clip.durationFrames;
        if (clipEndFrame > maxEndFrame) {
          maxEndFrame = clipEndFrame;
        }
      }
    }

    // 确保时间轴至少有一定的默认长度 (例如，为了初始显示)
    // 否则如果没有任何切片，总时长会是0，时间轴会消失
    contentDurationFrames.value = Math.max(
      maxEndFrame * 1.5,
      frameRate.value * 60
    ); // 至少30秒的时长
  }

  // --- 导出状态和 Actions ---
  return {
    pixelsPerFrame,
    frameRate,
    contentDurationFrames,
    totalTimelineWidth,
    tracks,
    setPixelsPerFrame,
    setFrameRate,
    setContentDuration,
    insertTrack,
    addClip,
    updateClip,
    updateContentDurationBasedOnClips,
  };
});
