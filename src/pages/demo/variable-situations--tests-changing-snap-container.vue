<script>
import Moveable from "vue3-moveable";
import { ref } from "vue";

export default {
    components: { Moveable },
    setup() {
        const snapContainer = ref(".snapGrid");
        const onMoustEnter = (e) => {
            snapContainer.value = e.currentTarget;
        };
        const onDragStart = () => {
            document.querySelectorAll(".snapGrid").forEach(grid => {
                grid.addEventListener("mouseenter", onMoustEnter);
            });
        };
        const onDrag = e => {
            e.target.style.transform = e.transform;
            e.target.style.pointerEvents = "none";
        };
        const onDragEnd = e => {
            e.target.style.pointerEvents = "";
            document.querySelectorAll(".snapGrid").forEach(grid => {
                grid.removeEventListener("mouseenter", onMoustEnter);
            });
        };
        return { snapContainer, onDragStart, onDrag, onDragEnd };
    }
};
</script>
<template>
    <div class="root" style="position: relative;border: 1px solid black;">
        <Moveable :target="'.target'" :draggable="true" :snappable="true" :horizontalGuidelines="[0, 100, 200, 300]"
            :verticalGuidelines="[0, 100, 200, 300]" :snapContainer="snapContainer" @dragStart="onDragStart"
            @drag="onDrag" @dragEnd="onDragEnd" />
        <div class="container" style="width: 100vw; height: 100vh;">
            <div class="snapGrid" style="  width: 100%; height: 300px; background-color: blueviolet;">
                <div class="target" style="width: 200px;height: 150px;transform: translate(0px, 0px) scale(1.5, 1);">
                    Target</div>
            </div>
            <div class="snapGrid" style=" margin-top:100px;  width: 100%; height: 300px; background-color: blueviolet;"></div>
        </div>
    </div>
</template>

<style>
.margin .root {
    position: static;
}

.description {
    padding: 10px;
}

.root {
    position: relative;
}

.container {
    position: relative;
    margin-top: 50px;
}

.will-change-container {
    padding-left: 100px;
    padding-top: 100px;
    will-change: transform;
}

.will-change-target {
    position: relative;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}

.target {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 100px;
    left: 100px;
    line-height: 100px;
    text-align: center;
    background: #ee8;
    color: #333;
    font-weight: bold;
    border: 1px solid #333;
    box-sizing: border-box;
}

.target1 {
    left: 120px;
    top: 120px;
}

.target2 {
    left: 300px;
    top: 140px;
}

.target3 {
    left: 180px;
    top: 250px;
}

.nested {
    position: absolute;
    border: 4px solid #ccc;
    width: 100px;
    height: 100px;
    top: 50px;
    left: 70px;
    color: #333;
    /* box-sizing: border-box; */
}

.nested.first {
    top: 150px;
}

.nested.rotate {
    transform-origin: 0 0;
    transform: rotate(-30deg);
}

.nested.scale {
    transform: scale(1.5, 1.5);
}

.nested .target {
    top: 50px;
    left: 50px
}


/* pos guidelines */
.moveable-normal.red {
    background: red !important;
}

/* gap guidelines */
.moveable-gap.red {
    background: red !important;
}

/* When snapped to an element in elementGuidelines */
.moveable-bold.red {
    background: red !important;
}

/* A dashed line between target and element */
.moveable-dashed.red {
    border-top-color: red !important;
    border-left-color: red !important;
}

/* pos guidelines */
.moveable-normal.green {
    background: green !important;
}

/* gap guidelines */
.moveable-gap.green {
    background: green !important;
}

/* When snapped to an element in elementGuidelines */
.moveable-bold.green {
    background: green !important;
}

/* A dashed line between target and element */
.moveable-dashed.green {
    border-top-color: green !important;
    border-left-color: green !important;
}

.scrollArea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;
}

.scrollArea:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 300%;
    width: 100%;
    background: linear-gradient(#333,
            #fff);
}

.infinite-viewer {
    height: 500px;
}

.control-padding .moveable-around-control {
    background: #f55 !important;
}


.cube {
    display: inline-block;
    border-radius: 5px;
    width: 40px;
    height: 40px;
    margin: 4px;
    background: #eee;
    --color: #4af;
    color: #333;
    line-height: 40px;
    text-align: center;
}

.cube .cube {
    background: #ddd;
    margin-left: 20px;
}
</style>