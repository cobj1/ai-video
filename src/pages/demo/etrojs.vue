<template>
    <canvas ref="target"></canvas><br>
</template>

<script setup lang="ts">
import etro from "etro";
import { onMounted, ref } from "vue";

const target = ref<HTMLCanvasElement>();

onMounted(() => {
    if (!target.value) {
        console.error("Canvas element not found");
        return;
    }

    const movie = new etro.Movie({
        canvas: target.value,
    });

    const layer = new etro.layer.Visual({
        startTime: 0,
        duration: 5,
        background: etro.parseColor("blue"),
    });

    movie.layers.push(layer);

    movie.play().then(() => {
        console.log("Movie finished playing");
    });

    // movie.record({
    //     frameRate: 30,
    // }).then((blob) => {
    //     console.log(`Recorded ${blob.size} bytes`);
    // });


})
</script>

<style scoped></style>