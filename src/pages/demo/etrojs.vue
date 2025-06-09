<template>
    <div ref="target">

    </div>
</template>

<script setup lang="ts">
import etro from "etro";
import { onMounted, ref } from "vue";

const target = ref()
onMounted(() => {
    const canvas = document.createElement("canvas");
    target.value.appendChild(canvas)

    const movie = new etro.Movie({
        canvas,
    });

    const layer = new etro.layer.Visual({
        startTime: 0,
        duration: 5,
        background: etro.parseColor("blue"),
    });

    movie.layers.push(layer);

})
</script>

<style scoped></style>