import type { ID } from "@/types/common";
import { useFindMediaById } from "./useFind";
import { useMediaLocation } from "./useLocation";
import { useDataStore } from "@/stores/data";
import { useTimelineScaleStore } from "@/stores/editor/timeline-scale";

const timelineScaleStore = useTimelineScaleStore();

const dataStore = useDataStore();

export const useSetMediaTime = (mediaid: ID) => {
  const location = useMediaLocation(mediaid);

  const media = useFindMediaById(mediaid);
  if (media && location) {
    const frames = media.time.end - media.time.start;
    const start = Math.round(
      location.offset.x / timelineScaleStore.getFrameWidth
    );
    const end = start + frames;

    dataStore.setTime(media, { start, end });
  }
};
