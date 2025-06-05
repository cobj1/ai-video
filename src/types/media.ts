import type { Location, TimeBlock, View } from "@/types/common";
import type { Raw } from "vue";

export interface Media {
  id: string;

  el: Raw<HTMLElement> | null;

  location: Location;

  time: TimeBlock;

  view: View;
}
