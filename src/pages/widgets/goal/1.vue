<script setup>
import { ref, computed } from 'vue';

const token = ref('');
const userId = ref('');
const selectedColor = ref('#fab387'); // Значение по умолчанию

// Генерируем финальную ссылку для стримера
const generatedUrl = computed(() => {
  if (!token.value || !userId.value) return 'Сначала введите данные...';
  
  const base = window.location.origin;
  const cleanToken = token.value.trim();
  const color = selectedColor.value.replace('#', '');
  
  return `${base}/v/${cleanToken}/${userId.value}?color=%23${color}`;
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(generatedUrl.value);
  alert('Ссылка скопирована!');
};
</script>

<template>
  <div class="min-h-screen bg-[#11111b] text-[#cdd6f4] p-8">
    <div class="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 class="text-4xl font-black text-[#fab387]">Widget Maker</h1>
        <p class="text-[#a6adc8]">Создай свой кастомный алерт за пару кликов</p>
      </header>

      <!-- Секция ввода данных -->
      <section class="bg-[#1e1e2e] p-6 rounded-2xl space-y-4 border border-[#313244]">
        <div>
          <label class="block text-sm font-bold mb-2">JWT Токен (из API или ссылки виджета)</label>
          <input 
            v-model="token" 
            type="text" 
            placeholder="V1QiLCJhbGciOiJSUzI1NiJ9..."
            class="w-full bg-[#313244] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#fab387] outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2">Ваш User ID</label>
          <input 
            v-model="userId" 
            type="text" 
            placeholder="10568044"
            class="w-full bg-[#313244] border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#fab387]"
          />
        </div>
      </section>

      <!-- Кастомизация -->
      <section class="bg-[#1e1e2e] p-6 rounded-2xl border border-[#313244]">
        <h3 class="font-bold mb-4">Внешний вид</h3>
        <div class="flex items-center gap-4">
          <input type="color" v-model="selectedColor" class="w-12 h-12 bg-transparent border-none cursor-pointer" />
          <span>Цвет акцента: {{ selectedColor }}</span>
        </div>
      </section>

      <!-- Результат -->
      <section v-if="token && userId" class="bg-[#fab387] p-6 rounded-2xl text-[#11111b]">
        <h3 class="font-bold mb-2">Ваша ссылка для OBS:</h3>
        <div class="flex gap-2">
          <input 
            readOnly 
            :value="generatedUrl" 
            class="flex-1 bg-white/20 border border-black/10 rounded-lg p-2 text-xs font-mono overflow-hidden overflow-ellipsis"
          />
          <button @click="copyToClipboard" class="bg-[#11111b] text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition">
            COPY
          </button>
        </div>
      </section>
    </div>
  </div>
</template>