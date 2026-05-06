<script setup lang="ts">
interface Track {
  name: string;
  artist: string;
  image: string;
  nowPlaying: boolean;
}

defineProps<{
  track: Track | null;
}>();
</script>

<template>
  <div v-if="track" class="flex gap-3">
    <img :src="track.image" class="w-12 h-12" />
    <div>
      <div>{{ track.name }}</div>
      <div class="text-sm opacity-70">{{ track.artist }}</div>
    </div>
  </div>
</template>