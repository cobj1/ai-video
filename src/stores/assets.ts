import { defineStore } from "pinia";
import { shallowRef } from "vue";
import Human from "@/components/assets/human.vue";
import Image from "@/components/assets/image.vue";
import Movie from "@/components/assets/movie.vue";
import MovieFX from "@/components/assets/movie-fx.vue";
import Text from "@/components/assets/text.vue";
import Subtitle from "@/components/assets/subtitle.vue";
import History from "@/components/assets/history.vue";

export const useAssetsStore = defineStore("assets", () => {
  const view = shallowRef(Movie);

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
