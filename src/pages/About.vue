<script setup>
import { ref, onMounted } from 'vue';
import Centrifuge from '@centrifuge/centrifuge-js'

const urlParams = new URLSearchParams(window.location.search);
const SOCKET_TOKEN = urlParams.get('token') || "ТВОЙ_JWT";
const USER_ID = urlParams.get('id') || "10568044";

const donation = ref(null);
const isVisible = ref(false);

const handleDonation = (data) => {
  donation.value = data;
  isVisible.value = true;
  setTimeout(() => isVisible.value = false, 7000);
};

onMounted(() => {
  if (!SOCKET_TOKEN) return;

  // Конфигурация по стандарту v3+
  const centrifuge = new Centrifuge('wss://centrifugo.donationalerts.com/connection/websocket', {
    token: SOCKET_TOKEN
  });

  // В v3 используется newSubscription
  const sub = centrifuge.newSubscription(`$alerts:personal_${USER_ID}`);

  // Событие получения сообщения теперь называется 'publication'
  sub.on('publication', (ctx) => {
    handleDonation(ctx.data);
  });

  sub.on('subscribed', () => console.log('Подписка активна'));
  sub.on('error', (err) => console.error('Ошибка канала:', err));

  sub.subscribe();
  centrifuge.connect();
});
</script>

<template>
  <!-- Контейнер прозрачный для OBS -->
  <div class="w-full h-screen overflow-hidden bg-transparent font-sans antialiased">
    
    <!-- Звук уведомления (опционально) -->
    <audio ref="audioPlayer" src="https://www.myinstants.com/media/sounds/discord-notification.mp3"></audio>

    <transition
      enter-active-class="transition duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      enter-from-class="opacity-0 translate-y-20 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isVisible" 
        class="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px]"
      >
        <!-- Карточка виджета в стиле Catppuccin -->
        <div class="relative overflow-hidden bg-[#1e1e2e] border-2 border-[#fab387] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(250,179,135,0.2)]">
          
          <!-- Декор: фоновое свечение -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-[#fab387] opacity-10 blur-3xl"></div>

          <!-- Контент -->
          <div class="relative z-10 flex flex-col items-center text-center">
            
            <div class="text-[#fab387] text-sm font-bold tracking-widest uppercase mb-1">
              New Donation
            </div>

            <h1 class="text-[#cdd6f4] text-3xl font-black mb-2 drop-shadow-sm">
              {{ donation?.username }}
            </h1>

            <div class="bg-[#fab387] text-[#11111b] px-4 py-1 rounded-full font-bold text-lg mb-4 shadow-lg">
              {{ donation?.amount }} {{ donation?.currency }}
            </div>

            <div v-if="donation?.message" class="text-[#a6adc8] text-lg leading-relaxed italic break-words w-full">
              "{{ donation?.message }}"
            </div>
          </div>

          <!-- Нижняя полоска прогресса (таймер скрытия) -->
          <div class="absolute bottom-0 left-0 h-1 bg-[#fab387] animate-shrink"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
/* Чтобы фон в OBS был прозрачным */
body {
  background-color: transparent !important;
  margin: 0;
  padding: 0;
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

.animate-shrink {
  animation: shrink 7s linear forwards;
}

/* Кастомный шрифт (опционально) */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Inter:wght@400;600&display=swap');

h1 {
  font-family: 'Montserrat', sans-serif;
}

div {
  font-family: 'Inter', sans-serif;
}
</style>