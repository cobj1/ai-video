<template>
    <div class="target">Target1</div>
    <div class="target">Target2</div>
    <Moveable ref="moveableRef" :target="targets" :draggable="draggable" :throttleDrag="throttleDrag"
        :edgeDraggable="edgeDraggable" :startDragRotate="startDragRotate" :throttleDragRotate="throttleDragRotate"
        :resizable="resizable" :keepRatio="keepRatio" :snappable="snappable" :bounds="bounds" :edge="edge"
        className="control-padding" :controlPadding="controlPadding" :snapGap="snapGap" :snapDirections="snapDirections"
        :elementSnapDirections="elementSnapDirections"
        :maxSnapElementGuidelineDistance="maxSnapElementGuidelineDistance" :elementGuidelines="['.target']"
        @drag="onDrag" @resize="onResize" @render="onRender" @bound="onBound" />
    <Selecto :dragContainer="windowRef" :selectableTargets="['.target']" :hitRate="0" :selectByClick="true"
        :selectFromInside="false" :toggleContinueSelect="['shift']" :ratio="0" @dragStart="onDragStart"
        @selectEnd="onSelectEnd"></Selecto>
</template>

<script setup lang="ts">
import Moveable from "vue3-moveable";
import Selecto from "vue3-selecto";
import { ref } from "vue";

const windowRef = ref(window)

const targets = ref([]);

const controlPadding = 20;

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

const bounds = { "left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css" };
const edge = [];
const targetRef = ref(null);
const moveableRef = ref(null);
const onDrag = e => {
    e.target.style.transform = e.transform;
};
const onResize = e => {
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
};
const onBound = e => {
    console.log(e);
};

const onRender = e => {
    e.target.style.cssText += e.cssText;
};

const onDragStart = e => {
    const moveable = moveableRef.value;
    const target = e.inputEvent.target;
    if (target.tagName === "BUTTON" || moveable.isMoveableElement(target)
        || targets.value.some(t => t === target || t.contains(target))
    ) {
        e.stop();
    }
};
const onSelectEnd = e => {
    const moveable = moveableRef.value;
    if (e.isDragStart) {
        e.inputEvent.preventDefault();
        moveable.waitToChangeTarget().then(() => {
            moveable.dragStart(e.inputEvent);
        });
    }
    targets.value = e.selected;
};
</script>
<style scoped>
.target {
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
<style>
.moveable-control.moveable-resizable {
    display: none;
}

.moveable-control.moveable-resizable.moveable-w {
    display: block;
    width: 4px;
    height: 60px;
    background-color: #eeeeee88;
    margin-top: -30px;
    margin-left: 0px;
    border-radius: 0;
    border: none;
}

.moveable-control.moveable-resizable.moveable-e {
    display: block;
    width: 4px;
    height: 60px;
    background-color: #eeeeee88;
    margin-top: -30px;
    margin-left: -4px;
    border-radius: 0;
    border: none;
}

.moveable-line {
    background: #eeeeee88 !important;
}
</style>