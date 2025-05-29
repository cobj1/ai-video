<template>
    <div class="h-100 d-flex flex-column">
        <timeline-tool></timeline-tool>
        <div class="d-flex h-100">
            <div class="h-100" style="min-width: 200px;">
                <timeline-layer-control></timeline-layer-control>
            </div>
            <div class="h-100 w-100 overflow-x-auto d-flex flex-column">
                <timeline-scale class="mt-1"></timeline-scale>
                <timeline-layer>
                    <timeline-layer-item>
                        <timeline-media></timeline-media>
                    </timeline-layer-item>
                </timeline-layer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>