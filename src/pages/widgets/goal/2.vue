<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userService, AuthData } from '@../../../src/api/userService';

const authInfo = ref<AuthData | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const loadData = async () => {
  try {
    isLoading.ref = true;
    const result = await userService.getProfile();
    // Мы берем result.data, так как наш интерфейс AuthResponse содержит поле data
    authInfo.value = result.data;
  } catch (e) {
    error.value = 'Ошибка при загрузке данных';
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadData);
</script>

<template>
  <div class="p-6 min-h-screen bg-[#1e1e2e] text-[#cdd6f4]"> <!-- Цвета Catppuccin Mocha -->
    <h1 class="text-2xl font-bold mb-4 text-[#89b4fa]">Статус API</h1>

    <div v-if="isLoading" class="animate-pulse text-[#fab387]">
      Загрузка...
    </div>

    <div v-else-if="error" class="text-[#f38ba8]">
      {{ error }}
    </div>

    <div v-else class="bg-[#313244] p-4 rounded-lg shadow-lg border border-[#45475a]">
      <p class="text-[#a6e3a1]">Данные успешно получены!</p>
      <code class="block mt-2 text-xs break-all text-[#94e2d5]">
        Token: {{ authInfo?.token }}
      </code>
    </div>
  </div>
</template>