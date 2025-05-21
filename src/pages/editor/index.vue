<template>
    <splitpanes class="h-100" horizontal>
        <pane min-size="40" size="60">
            <splitpanes>
                <pane min-size="20">
                    <v-sheet height="100%" width="100%"></v-sheet>
                </pane>
                <pane min-size="50">
                    <v-sheet height="100%" width="100%"></v-sheet>
                </pane>
                <pane min-size="20">
                    <v-sheet height="100%" width="100%"></v-sheet>
                </pane>
            </splitpanes>
        </pane>
        <pane min-size="30">
            <v-sheet height="100%" width="100%"></v-sheet>
        </pane>
    </splitpanes>
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

</script>

<style scoped>
.splitpanes:deep(.splitpanes__splitter) {
    min-height: 2px;
    min-width: 2px;
    background-color: #0000000f;
    transition: all 0.3s;
}

.splitpanes:deep(.splitpanes__splitter):hover {
    min-height: 4px;
    min-width: 4px;
}
</style>