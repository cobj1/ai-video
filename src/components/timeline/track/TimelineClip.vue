<template>
    <div class="timeline-clip">
        <div style="pointer-events: none;">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 组件用于显示元素信息
 */
defineProps({
    medium: {
        type: Object,
        default: {}
    }
})
</script>
<style scoped></style>