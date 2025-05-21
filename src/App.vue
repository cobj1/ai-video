<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { useThemeStore } from './stores/theme';

useThemeStore()
</script>

<style>
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
</style>