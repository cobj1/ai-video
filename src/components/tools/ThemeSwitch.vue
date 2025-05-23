<template>
    <v-btn :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme()"></v-btn>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import { useTheme } from 'vuetify'

const theme = useTheme()

const themeStore = useThemeStore()

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'

    themeStore.dark = theme.global.current.value.dark
}
</script>

<style scoped></style>