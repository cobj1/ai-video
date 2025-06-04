<template>
    <div class="w-100 h-100 bg-black">
        <div :class="`target_${item.id}`" ref="target" v-for="(item, index) in items"
            style="width: 500px;  position: absolute; "
            :style="{ left: `${index * 100 + 200}px`, top: `${index * 100 + 200}px` }">
            <v-img src="@/assets/demo-1.png"></v-img>
        </div>

        <Moveable className="moveable" v-for="item in items" :target="[`.target_${item.id}`]" :draggable="true"
            :scalable="true" :rotatable="true" :keepRatio="true" :throttleResize="1" @drag="onDrag"
            @scale="onScale" @rotate="onRotate" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Moveable from "vue3-moveable";

const target = ref()

const items = ref([
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
])

const onDrag = (event: any) => {
    event.target.style.transform = event.transform;
}
const onScale = (event: any) => {
    event.target.style.transform = event.drag.transform;
}
const onRotate = (event: any) => {
    event.target.style.transform = event.drag.transform;
}
</script>

<style scoped></style>