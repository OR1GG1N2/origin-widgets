<script setup lang="ts">
interface Track {
  name: string;
  artist: string;
  image: string;
  nowPlaying: boolean;
  theme?: string;
}

defineProps<{
  track: Track | null;
}>();
</script>

<template>
  <div class="flex items-center justify-center h-screen">
  <div v-if="track" class="flex gap-3 bg-zinc-800 w-64 p-3 rounded-lg ">
    <img :src="track.image" class="w-12 h-12" />
   <div class="min-w-0"> <!-- min-w-0 нужен для корректной работы Flexbox -->
    <div class="truncate text-white">{{ track.name }}</div>
    <div class="text-sm text-white opacity-70 truncate">{{ track.artist }}</div>
  </div>
  </div>
  </div>
</template>