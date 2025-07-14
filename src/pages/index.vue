<template>
  <layout>
    <splitpanes class="h-100" horizontal>
      <pane min-size="40" size="60">
        <splitpanes>
          <pane min-size="20">
            <v-sheet class="overflow-y-auto" height="100%" width="100%">
              <assets-panel></assets-panel>
            </v-sheet>
          </pane>
          <pane min-size="50">
            <v-sheet class="pa-4 d-flex flex-column" height="100%" width="100%">
              <viewport-wrapper ref="viewportWrapperRef">
                <template #default="{ scale }">
                  <preview-area :viewport-scale="scale"></preview-area>
                </template>
              </viewport-wrapper>
              <preview-area-controls></preview-area-controls>
            </v-sheet>
          </pane>
          <pane min-size="20">
            <v-sheet height="100%" width="100%">
              <properties-panel></properties-panel>
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
  </layout>
</template>

<script setup lang="ts">
import Layout from '@/layout/editor.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { usePreviewAreaStore } from '@/stores/preview-area'
import { onMounted, useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'

const previewAreaStore = usePreviewAreaStore()

const el = useTemplateRef<HTMLElement>('viewportWrapperRef')

onMounted(() => previewAreaStore.fullscreenControl = useFullscreen(el))
</script>

<style scoped>
@import url(@/styles/splitpanes.css);
</style>