<template>
    <v-layout>
        <v-navigation-drawer v-model="drawer" permanent width="80">
            <div class="d-flex justify-center pa-4">
                <v-avatar image="@/assets/logo.png" />
            </div>

            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('Human')">
                <v-icon>mdi-human-edit</v-icon>

                <span class="text-caption">Human</span>
            </v-btn>

            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('Image')">

                <v-icon>mdi-image-outline</v-icon>

                <span class="text-caption">Image</span>
            </v-btn>

            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('Movie')">
                <v-icon>mdi-movie-play-outline</v-icon>

                <span class="text-caption">Movie</span>
            </v-btn>

            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('MovieFX')">
                <v-icon>mdi-movie-filter-outline</v-icon>

                <span class="text-caption">MovieFX</span>
            </v-btn>


            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('Text')">
                <v-icon>mdi-format-text</v-icon>

                <span class="text-caption">Text</span>
            </v-btn>

            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('Subtitle')">
                <v-icon>mdi-subtitles-outline</v-icon>

                <span class="text-caption">Subtitle</span>
            </v-btn>

            <v-btn class="text-none" stacked tile variant="text" width="80" @click="assetsStore.change('History')">
                <v-badge color="error" content="39" location="top end">
                    <v-icon>mdi-history</v-icon>
                </v-badge>

                <span class="text-caption">History</span>
            </v-btn>

            <template #append>
                <div class="d-flex justify-center pa-4">
                    <v-btn icon variant="text">
                        <v-avatar image="/images/john.jpg" />

                        <v-menu activator="parent" location="top">
                            <v-list density="compact" nav slim>
                                <v-list-item link prepend-icon="mdi-cog" title="Settings" to="/settings" />

                                <v-list-item link prepend-icon="mdi-logout" title="Logout" to="/login" />
                            </v-list>
                        </v-menu>
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <v-app-bar :elevation="2">
            <template #prepend>
                <v-app-bar-nav-icon @click="drawer = !drawer" />
            </template>

            <template #title>
                <v-text-field class="d-block" v-if="projectNameEdited" v-model="projectName" width="240px"
                    label="Project Name" hide-details variant="solo-inverted" append-inner-icon="mdi-check"
                    @click:append-inner="projectNameEdited = false" @keyup.enter="projectNameEdited = false">
                </v-text-field>

                <div v-else>
                    {{ projectName }}

                    <v-btn icon="mdi-rename" variant="plain" @click="projectNameEdited = true"></v-btn>
                </div>
            </template>

            <template #append>
                <v-btn icon="mdi-undo"></v-btn>

                <v-btn icon="mdi-redo"></v-btn>

                <ThemeSwitch></ThemeSwitch>

                <v-btn icon="mdi-history"></v-btn>

                <v-btn icon="mdi-download"></v-btn>

                <v-btn color="error" prepend-icon="mdi-movie-roll">Render Video</v-btn>
            </template>
        </v-app-bar>

        <v-main>
            <div class="h-100 overflow-auto">
                <RouterView></RouterView>
            </div>
        </v-main>

        <v-footer class="justify-center border-t-sm" app>
            {{ footerStore.message }}
        </v-footer>
    </v-layout>
</template>

<script setup lang="ts">
import { useAssetsStore } from '@/stores/assets'
import { useFooterStore } from '@/stores/footer'
import { shallowRef } from 'vue'

const drawer = shallowRef(true)

const projectName = shallowRef('Unnamed Project')

const projectNameEdited = shallowRef(false)

const footerStore = useFooterStore()

const assetsStore = useAssetsStore()
</script>

<style scoped></style>