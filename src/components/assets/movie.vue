<template>
    <v-container fluid>
        <section class="h-100 d-flex flex-column ">
            <h3 class="flex-0-0	 text-subtitle-1 font-weight-bold d-flex justify-space-between align-center">
                <v-breadcrumbs :items="['Movie']">
                    <template v-slot:prepend>
                        <v-icon class="mr-2" icon="mdi-movie-play-outline"></v-icon>
                    </template>
                </v-breadcrumbs>
                
                <div class="d-flex ga-2">
                    <v-btn border class="text-none" prepend-icon="mdi-upload" rounded="lg" slim
                        text="Upload local files" variant="text" />
                </div>
            </h3>

            <v-tabs class="flex-0-0	" v-model="tab" color="primary">
                <v-tab class="text-none" prepend-icon="mdi-shopping-outline" text="Default" value="default" />

                <v-tab class="text-none" prepend-icon="mdi-laptop" text="Local" value="local" />
            </v-tabs>

            <v-divider />

            <v-tabs-window class="mt-4" v-model="tab">
                <v-tabs-window-item value="default">
                    <v-row>
                        <v-col v-for="(item, i) in items" :key="i" cols="12" md="6" sm="12">
                            <draggable-source-container :data='{
                                title: item.title,
                                thumb: item.img,
                            }'>
                                <v-card class="mx-auto" flat min-height="200" :image="item.img" link :ripple="false"
                                    rounded="lg">
                                    <template #image>
                                        <v-img cover
                                            gradient="to bottom, rgba(var(--v-theme-surface), .1), rgba(var(--v-theme-surface), 1)" />
                                    </template>

                                    <p class="text-body-1 font-weight-bold position-absolute right-0 bottom-0 pa-4">
                                        {{ item.title }}
                                    </p>
                                </v-card>
                            </draggable-source-container>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item value="local">
                     
                </v-tabs-window-item>
            </v-tabs-window>
        </section>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import imageDemo2 from '@/assets/demo-2.png'

const tab = ref()

const items = [
    {
        title: 'xgplayer',
        img: imageDemo2,
    },
    {
        title: 'Shoes 1',
        img: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Shoes 2',
        img: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Shoes 3',
        img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Shoes 4',
        img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
]

</script>

<style scoped></style>