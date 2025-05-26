import { defineStore } from "pinia";
import { shallowRef } from "vue";
import Human from "@/pages/editor/assets/human.vue";
import Image from "@/pages/editor/assets/image.vue";
import Movie from "@/pages/editor/assets/movie.vue";
import MovieFX from "@/pages/editor/assets/movie-fx.vue";
import Text from "@/pages/editor/assets/text.vue";
import Subtitle from "@/pages/editor/assets/subtitle.vue";
import History from "@/pages/editor/assets/history.vue";

export const useAssetsStore = defineStore("assets", () => {
  const view = shallowRef(Human);

  const change = (type: string) => {
    switch (type) {
      case "Human":
        view.value = Human;
        break;
      case "Image":
        view.value = Image;
        break;
      case "Movie":
        view.value = Movie;
        break;
      case "MovieFX":
        view.value = MovieFX;
        break;
      case "Text":
        view.value = Text;
        break;
      case "Subtitle":
        view.value = Subtitle;
        break;
      case "History":
        view.value = History;
        break;
    }
  };

  return { view, change };
});
