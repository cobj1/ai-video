<template>
    <v-sheet ref="container" class="timeline-layer position-relative d-flex flex-column-reverse overflow-y-auto"
        :class="{ 'justify-center': justifyCenter }" height="100%" :width="timelineScaleStore.width">
        <timeline-layer-item v-for="item in items" :key="item.id" :id="item.id"
            :ref="(component: any) => { if (component) { item.el = markRaw(component.$el) } }">
            <timeline-media class="timeline-media"
                :style="{ 'left': `${medium.time.start * timelineScaleStore.getFrameWidth}px`, 'width': `${medium.time.end * timelineScaleStore.getFrameWidth - medium.time.start * timelineScaleStore.getFrameWidth}px` }"
                :medium="medium" v-for="medium in item.media" :key="medium.id" :id="medium.id"
                :ref="(component: any) => { if (component) { medium.el = markRaw(component.$el) } }" draggable="true"
                @click="moveableStore.onClickMedia($event, medium)"
                @dragstart="moveableStore.onDragStartMedia($event, medium)">
                {{ `${medium.id}` }} {{ medium.time }}
            </timeline-media>
        </timeline-layer-item>

        <Moveable ref="moveableRef" v-bind="moveableStore.attributes" :target="moveableStore.target"
            :elementGuidelines="['#medium_0']"
            :scrollOptions="({ container: '.timeline-layer', threshold: 30, checkScrollEvent: false, throttleTime: 0 })"
            :bounds="{ left: 0, bottom: 0, position: 'css' }" @scroll="moveableStore.onScroll"
            @drag="moveableStore.onDrag" @dragStart="moveableStore.onDragStart" @dragEnd="moveableStore.onDragEnd"
            @resize="moveableStore.onResize" @render="moveableStore.onRender" />
    </v-sheet>
</template>

<script setup lang="ts">
/**
 * 组件用于层级中资源交互，显示各个图层
 */
import Moveable from "vue3-moveable";
import '@/styles/moveable.scss'
import { useTimelineScaleStore } from '@/stores/editor/timeline-scale';
import { markRaw, ref, watch } from "vue";
import { useMoveableStore } from "@/stores/editor/moveable";
import { useElementSize } from '@vueuse/core'

const props = defineProps({
    items: {
        type: Object
    }
})

const timelineScaleStore = useTimelineScaleStore()

const moveableStore = useMoveableStore()

const moveableRef = ref()

moveableStore.setMoveableRef(moveableRef)

const container = ref()

const justifyCenter = ref(true)

const { height } = useElementSize(container)

watch(() => props.items?.length, () => {
    if (container.value && props.items) {

        justifyCenter.value = props.items.length * 65 < height.value

        console.log(props.items.length * 65, height.value)
    }
}, {
    immediate: true
})

</script>

<style scoped></style>