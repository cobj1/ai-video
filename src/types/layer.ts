import type { Raw } from "vue";
import type { Media } from "./media";

export interface LayerItem {
  id: string | number;

  el: Raw<HTMLElement> | null;

  media: Media[];
}

export interface LayerList {
  items: LayerItem[];
}
