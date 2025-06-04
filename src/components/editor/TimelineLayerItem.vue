<template>
    <v-sheet class="timeline-layer-item" :height="60" width="100%" color="#9E9E9E10">
        <timeline-media class="timeline-media" :class="`layer_${layer.id}_medium`"
            :style="{ 'left': `${medium.start}px`, 'width': `${medium.end - medium.start}px` }" :medium="medium"
            v-for="medium in layer.media" :key="medium.id" draggable="true" @click="onClickMedia($event)"
            @dragstart="onDragStartMedia($event)">
            {{ `layer_${layer.id}_medium_${medium.id}` }}
        </timeline-media>

        <Moveable ref="moveableRef" :target="target" :draggable="draggable" :throttleDrag="throttleDrag"
            :edgeDraggable="edgeDraggable" :startDragRotate="startDragRotate" :throttleDragRotate="throttleDragRotate"
            :resizable="resizable" :keepRatio="keepRatio" :snappable="snappable" :bounds="bounds" :edge="edge"
            :snapGap="snapGap" :snapDirections="snapDirections" :elementSnapDirections="elementSnapDirections"
            :maxSnapElementGuidelineDistance="maxSnapElementGuidelineDistance" :elementGuidelines="[]" @drag="onDrag"
            @resize="onResize" @render="onRender" @bound="onBound" />
    </v-sheet>
</template>

<script setup lang="ts">
/**
 * 组件作用于当前层级的移动位置等信息
 */
import Moveable from "vue3-moveable";
import '@/styles/moveable.scss'
import { ref } from "vue";

defineProps({
    layer: {
        type: Object,
        default: {}
    }
})

/**
 * 选中的元素
 */
const target = ref();

/**
 * 允许拖拽
 */
const draggable = true;

const throttleDrag = 1;
const edgeDraggable = false;
const startDragRotate = 0;
const throttleDragRotate = 0;
const resizable = true;
const keepRatio = false;
const snappable = true;
const snapGap = true;
const snapDirections = { "left": true, "right": true };
const elementSnapDirections = { "left": true, "right": true };

const maxSnapElementGuidelineDistance = ref();

const bounds: any = { "left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css" };
const edge: any[] = [];
const moveableRef = ref();

const onDrag = (e: any) => {
    e.target.style.transform = e.transform;
};
const onResize = (e: any) => {
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
};
const onBound = (e: any) => {
    console.log(e);
};

const onRender = (e: any) => {
    e.target.style.cssText += e.cssText;
};

const onClickMedia = (event: any) => {
    target.value = event.target;
}

const onDragStartMedia = (event: any) => {
    const moveable = moveableRef.value;

    event.preventDefault();

    moveable.waitToChangeTarget().then(() => {
        moveable.dragStart(event);
    });

    target.value = event.target;
}

</script>

<style scoped>
.timeline-layer-item {
    position: relative;
}

.timeline-media {
    position: absolute;
    width: 200px;
    height: 60px;
    top: 0;
    left: 100px;
    line-height: 60px;
    text-align: center;
    background-color: #2A4A50;
    font-weight: bold;
    box-sizing: border-box;
}
</style>