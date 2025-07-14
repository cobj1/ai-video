<template>
    <div ref="wrapper" class="scale-wrapper">
        <div ref="content" class="scale-content "
            :style="{ transform: `scale(${scale}) translate(-50%, -50%)`, width: `${designWidth}px`, height: `${designHeight}px` }">
            <slot :scale="scale"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
// 视口包装器，它的 内容区域 看起来总是保持一个固定的“设计尺寸”（比如 1920x1080），但整个组件会随着浏览器窗口（或父容器）的大小变化而整体缩放，就像视频播放器中的内容一样。
import { onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue';

const props = defineProps({
    designWidth: {
        type: Number,
        default: 1920
    },
    designHeight: {
        type: Number,
        default: 1080
    }
})

const wrapper = shallowRef<HTMLElement>();
const content = shallowRef(null);
const scale = shallowRef(1);

let resizeObserver: ResizeObserver | null = null;

const calculateScale = () => {
    if (!wrapper.value || !content.value) return;

    const wrapperWidth = wrapper.value.offsetWidth;
    const wrapperHeight = wrapper.value.offsetHeight;

    const scaleX = wrapperWidth / props.designWidth;
    const scaleY = wrapperHeight / props.designHeight;

    // 取较小值确保内容不溢出
    scale.value = Math.min(scaleX, scaleY);
};


onMounted(() => {
    nextTick(() => {
        calculateScale();
        resizeObserver = new ResizeObserver(() => {
            calculateScale();
        });

        if (wrapper.value)
            resizeObserver.observe(wrapper.value);

        window.addEventListener('resize', calculateScale);
    });
})

onBeforeUnmount(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    window.removeEventListener('resize', calculateScale);
})

// 暴露 scale 值，以便父组件可以访问
defineExpose({
    scale
});
</script>

<style scoped>
.scale-wrapper {
    position: relative;
    /* 确保子元素可以相对于它定位 */
    width: 100%;
    /* 可以根据实际需求设置 */
    height: 100%;
    /* 可以根据实际需求设置 */
    overflow: hidden;
    /* 隐藏超出缩放区域的内容 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 确保 content 居中 */
}

.scale-content {
    /* transform 会改变元素的视觉大小，但不会改变其占据的空间，
     所以要用定位或 flex/grid 居中 */
    position: absolute;
    /* 使其脱离文档流，方便用 transform: translate 居中 */
    left: 50%;
    top: 50%;
    transform-origin: 0 0;
    /* 缩放原点设为左上角 */
    /* transform 属性会通过 JS 动态设置 */
    /* translate(-50%, -50%) 是为了在缩放后将其中心点移回容器中心 */
    /* 否则缩放原点在左上角，会导致缩放后偏离中心 */
    overflow: hidden;
    /* 内部内容超出 designWidth/Height 的部分隐藏 */
}
</style>