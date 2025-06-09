<template>
    <v-container fluid>
        <section class="h-100 d-flex flex-column ">
            <h3 class="flex-0-0	 text-subtitle-1 font-weight-bold mb-4 d-flex justify-space-between align-center">
                Settings Panel

                <div class="d-flex ga-2">
                    <v-btn border class="text-none" prepend-icon="mdi-refresh" rounded="lg" slim text="Reset"
                        variant="text" />
                </div>
            </h3>

            <v-tabs class="flex-0-0	" v-model="tab" color="primary">
                <v-tab class="text-none" prepend-icon="mdi-database-outline" text="Base" value="base" />

                <v-tab class="text-none" prepend-icon="mdi-check-decagram-outline" text="Approved" value="two" />

                <v-tab class="text-none" prepend-icon="mdi-account-clock-outline" text="Pending" value="three" />
            </v-tabs>

            <v-divider />

            <v-tabs-window class="overflow-y-auto" v-model="tab">
                <v-tabs-window-item value="base">
                    <v-img class="ma-4 " max-height="140px" src="@/assets/demo-1.png"></v-img>

                    <v-divider />

                    <v-expansion-panels multiple>
                        <v-expansion-panel title="Location">
                            <template #text>
                                <v-list class="pa-0" lines="three">
                                    <v-list-item class="pa-0" density="compact">
                                        <v-number-input label="x" control-variant="stacked" inset
                                            hide-details></v-number-input>
                                    </v-list-item>
                                    <v-list-item class="pa-0" density="compact">
                                        <v-number-input label="y" control-variant="stacked" inset
                                            hide-details></v-number-input>
                                    </v-list-item>
                                </v-list>
                            </template>
                        </v-expansion-panel>

                        <v-expansion-panel title="Zoom">
                            <template #text>
                                <v-list class="pa-0" lines="three">
                                    <v-list-item class="pa-0" density="compact">
                                        <v-slider label="zoom" prepend-icon="mdi-loupe" hide-details></v-slider>
                                    </v-list-item>
                                </v-list>
                            </template>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <v-divider></v-divider>

                    <v-list v-model:selected="settingsSelection" lines="three" select-strategy="leaf">
                        <v-list-subheader>General</v-list-subheader>
                        <v-list-item v-for="item in settingsItems" :key="item.value" :subtitle="item.subtitle"
                            :title="item.title" :value="item.value">
                            <template v-slot:prepend="{ isSelected, select }">
                                <v-list-item-action start>
                                    <v-checkbox-btn :model-value="isSelected"
                                        @update:model-value="select"></v-checkbox-btn>
                                </v-list-item-action>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                    Two
                </v-tabs-window-item>

                <v-tabs-window-item value="three">
                    Three
                </v-tabs-window-item>
            </v-tabs-window>
        </section>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref()

const userControls = [
    { title: 'Content filtering', subtitle: 'Set the content filtering level to restrict appts that can be downloaded' },
    { title: 'Password', subtitle: 'Require password for purchase or use password to restrict purchase' },
]
const settingsItems = [
    { value: 'notifications', title: 'Notifications', subtitle: 'Notify me about updates to apps or games that I downloaded' },
    { value: 'sound', title: 'Sound', subtitle: 'Auto-update apps at any time. Data charges may apply' },
    { value: 'widgets', title: 'Auto-add widgets', subtitle: 'Automatically add home screen widgets when downloads complete' },
]

const settingsSelection = []
</script>

<style scoped></style>