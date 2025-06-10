<template>
    <v-container fluid>
        <section class="h-100 d-flex flex-column ">
            <h3 class="flex-0-0	 text-subtitle-1 font-weight-bold mb-4 d-flex justify-space-between align-center">
                <v-breadcrumbs :items="['Subtitle']">
                    <template v-slot:prepend>
                        <v-icon class="mr-2" icon="mdi-subtitles-outline"></v-icon>
                    </template>
                </v-breadcrumbs>

                <div class="d-flex ga-2">
                    <v-btn border class="text-none" prepend-icon="mdi-upload" rounded="lg" slim
                        text="Upload local files" variant="text" />
                </div>
            </h3>
            
        </section>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped></style>