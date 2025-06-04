<template>
    <splitpanes class="h-100" horizontal>
        <pane min-size="40" size="60">
            <splitpanes>
                <pane min-size="20">
                    <v-sheet class="overflow-y-auto" height="100%" width="100%">
                        <assets></assets>
                    </v-sheet>
                </pane>
                <pane min-size="50">
                    <v-sheet class="pa-4 d-flex flex-column" height="100%" width="100%">
                        <viewport-wrapper ref="viewportWrapperRef">
                            <preview></preview>
                        </viewport-wrapper>
                        <viewport-control></viewport-control>
                    </v-sheet>
                </pane>
                <pane min-size="20">
                    <v-sheet height="100%" width="100%">
                        <settings></settings>
                    </v-sheet>
                </pane>
            </splitpanes>
        </pane>
        <pane min-size="30">
            <v-sheet height="100%" width="100%">
                <timeline></timeline>
            </v-sheet>
        </pane>
    </splitpanes>
    <draggable-source-wizard></draggable-source-wizard>
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Timeline from '@/pages/editor/timeline/index.vue'
import Preview from '@/pages/editor/preview/index.vue'
import Assets from '@/pages/editor/assets/index.vue'
import Settings from '@/pages/editor/settings/index.vue'
import { useViewportStore } from '@/stores/editor/viewport'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'


const viewportStore = useViewportStore()

const el = useTemplateRef<HTMLElement>('viewportWrapperRef')

onMounted(() => viewportStore.fullscreenControl = useFullscreen(el))

</script>

<style scoped>
@import url(@/styles/splitpanes.css);
</style>