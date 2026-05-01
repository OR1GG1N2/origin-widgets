<template>
  <div class="min-h-screen bg-[#f4f0fa] text-[#1c1b1f] font-['Roboto',sans-serif] overflow-x-hidden">

    <!-- Skeleton overlay (взят из твоего кода) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-400"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="pageLoading" class="fixed inset-0 z-50 bg-[#f4f0fa] flex flex-col items-center justify-center gap-6">
        <div class="w-60 h-[72px] rounded-[28px] bg-white border border-[#e8e4f0] shadow-sm flex items-center px-4 gap-4 relative overflow-hidden">
          <div class="w-11 h-11 rounded-full bg-[#ede9f8] flex-shrink-0" />
          <div class="flex flex-col gap-2 flex-1">
            <div class="h-2 w-14 bg-[#ede9f8] rounded-full" />
            <div class="h-5 w-20 bg-[#ede9f8] rounded-full" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]" />
        </div>
        <p class="text-[11px] font-bold tracking-[.2em] uppercase text-[#b8b0cc] animate-pulse">Loading Gallery</p>
      </div>
    </Transition>

    <!-- Top App Bar (Material 3 Header) -->
    <header class="sticky top-0 z-40 bg-[#f4f0fa]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-[#6750a4] rounded-[12px] flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z"/>
          </svg>
        </div>
        <span class="text-[22px] font-normal leading-tight tracking-tight">Widget Studio</span>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-8">
      
      <!-- Headline -->
      <section class="flex flex-col gap-2">
        <h1 class="text-4xl md:text-[45px] font-normal tracking-tight text-[#1c1b1f]">Галерея виджетов</h1>
        <p class="text-[16px] text-[#49454f]">Выберите виджет для настройки и интеграции в OBS.</p>
      </section>

      <!-- Filter Chips (Material 3 style) -->
      <section class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'h-8 px-4 rounded-lg text-[14px] font-medium transition-all whitespace-nowrap border',
            activeCategory === cat.id 
              ? 'bg-[#e8def8] text-[#1d192b] border-transparent' 
              : 'bg-transparent text-[#49454f] border-[#79747e] hover:bg-[#1c1b1f]/5'
          ]"
        >
          {{ cat.name }}
        </button>
      </section>

      <!-- Widget Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <div 
          v-for="widget in filteredWidgets" 
          :key="widget.id"
          class="group flex flex-col bg-white rounded-[24px] border border-[#e4e0f0] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
          <!-- Thumbnail Container (Surface Container Highest) -->
          <a :href="`${widget.href}`" class="flex flex-col h-full">
          <div class="h-[180px] bg-[#e8def8]/40 flex items-center justify-center p-6 relative overflow-hidden">
            <!-- Mock visual inside card -->
            <div class="w-full h-full bg-white rounded-[16px] shadow-sm flex items-center px-4 border border-[#e4e0f0] scale-90 group-hover:scale-100 transition-transform duration-300">
              <div class="w-10 h-10 rounded-full flex-shrink-0" :style="{ backgroundColor: widget.color + '22', color: widget.color }">
                <!-- Generic icon placeholder -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full p-2.5">
                  <path :d="widget.icon" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <div class="h-2.5 w-1/3 bg-[#e4e0f0] rounded-full mb-2"></div>
                <div class="h-4 w-1/2 bg-[#d4c8f8] rounded-full"></div>
              </div>
            </div>
          </div>

          <!-- Text Content -->
          <div class="p-5 flex flex-col gap-1">
            <h2 class="text-[16px] font-medium text-[#1c1b1f]">{{ widget.title }}</h2>
            <p class="text-[14px] text-[#49454f] leading-snug">{{ widget.desc }}</p>
          </div>
          </a>

        </div>

      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const pageLoading = ref(true);

const activeCategory = ref('all');

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'counters', name: 'Счетчики' },
//   { id: 'alerts', name: 'Алерты' },
//   { id: 'chat', name: 'Чат' }
];

// Иконки Material Symbols в формате SVG путей
const icons = {
  counter: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
  alert: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"
};

const widgets = ref([
  {
    id: 1,
    title: 'Viewer Counter',
    desc: 'Отображает текущее количество зрителей с Twitch и YouTube.',
    category: 'counters',
    color: '#6750a4',
    icon: icons.counter,
    href: 'widget/viewercounter-settings'
  },
//   {
//     id: 2,
//     title: 'Sub Goal Bar',
//     desc: 'Прогресс-бар подписок или фолловеров для достижения цели.',
//     category: 'counters',
//     color: '#006a6a',
//     icon: icons.counter
//   },
//   {
//     id: 3,
//     title: 'Minimal Chat',
//     desc: 'Прозрачный чат с настраиваемыми стилями Material Design.',
//     category: 'chat',
//     color: '#9146FF',
//     icon: icons.chat
//   },
//   {
//     id: 4,
//     title: 'New Follower Alert',
//     desc: 'Всплывающее уведомление о новом фолловере или сабе.',
//     category: 'alerts',
//     color: '#b3261e',
//     icon: icons.alert
//   },
//   {
//     id: 5,
//     title: 'Event List',
//     desc: 'Список последних событий на стриме (донаты, сабы).',
//     category: 'alerts',
//     color: '#4a4458',
//     icon: icons.chat
//   }
]);

const filteredWidgets = computed(() => {
  if (activeCategory.value === 'all') return widgets.value;
  return widgets.value.filter(w => w.category === activeCategory.value);
});

onMounted(() => {
  requestAnimationFrame(() => setTimeout(() => { pageLoading.value = false; }, 600));
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Скрытие скроллбара для чипсов на мобилках */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>