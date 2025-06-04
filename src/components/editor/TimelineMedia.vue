<template>
    <div>
        <slot></slot>
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