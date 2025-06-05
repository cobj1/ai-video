<template>
    <v-sheet class="timeline-layer-item" :height="65" width="100%">
        <div class="timeline-layer-item-top"></div>
        <v-sheet class="timeline-layer-item-container" color="#9E9E9E10">
            <slot></slot>
        </v-sheet>
    </v-sheet>
</template>

<script setup lang="ts">
/**
 * 组件作用记录资源所在图层，资源拖拽至至此处将规划到该图层
 */


</script>

<style scoped>
.timeline-layer-item {
    display: flex;
    flex-direction: column;
}

.timeline-layer-item-top {
    width: 100%;
    height: 5px;
    flex-shrink: 0;
}

.timeline-layer-item-container {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>