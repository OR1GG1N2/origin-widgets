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
  <!-- <div class="flex items-center justify-center h-screen">
  <div v-if="track" class="flex gap-4 bg-zinc-800 w-64 p-3 rounded-[28px]   border-zinc-500/50 border-3">
    <img :src="track.image" class="w-12 h-12 rounded-3xl spi" />
   <div class="min-w-0"> 
    <div class="truncate text-white">{{ track.name }}</div>
    <div class="text-sm text-white opacity-70 truncate">{{ track.artist }}</div>
  </div>
  </div>
  </div> -->

  <div class="flex items-center justify-center h-screen ">
    <div
      v-if="track"
      class="flex gap-4 p-2 relative overflow-hidden rounded-lg   ring-3 ring-white/10 ring-inset w-fit "
    >
      <div
        class="absolute -inset-1 -z-10 bg-cover bg-center transition-all duration-700"
        :style="{
          backgroundImage: `url(${track.image})`,
          filter: 'blur(1px) brightness(0.3)',
        }"
      ></div>
      <div class="flex w-64">
      <img :src="track.image" class="w-16 h-auto rounded-md" />
      <div class="p-3 min-w-0">
      <h1 class="truncate text-white truncate ">{{ track.name }}
      <h2 class="text-sm text-white opacity-70 truncate">{{ track.artist }}</h2></h1>
      </div>
      </div>
      
      
    </div>
  </div>
</template>
