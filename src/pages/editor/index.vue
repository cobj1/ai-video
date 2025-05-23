<template>
    <splitpanes class="h-100" horizontal>
        <pane min-size="40" size="60">
            <splitpanes>
                <pane min-size="20">
                    <v-sheet height="100%" width="100%">
                        <assets></assets>
                    </v-sheet>
                </pane>
                <pane min-size="50">
                    <v-sheet class="pa-4  " height="100%" width="100%">
                        <viewport-wrapper>
                            <div class="w-100 h-100 bg-black">
                                <preview></preview>
                            </div>
                        </viewport-wrapper>
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
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Timeline from '@/pages/editor/timeline/index.vue'
import Preview from '@/pages/editor/preview/index.vue'
import Assets from '@/pages/editor/assets/index.vue'
import Settings from '@/pages/editor/settings/index.vue'
</script>

<style scoped>
@import url(@/styles/splitpanes.css);
</style>