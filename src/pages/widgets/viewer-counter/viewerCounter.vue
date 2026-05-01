<template>
  <div class="flex items-center justify-center p-4 font-sans">
    <div
      class="relative flex items-center overflow-hidden transition-all duration-500 shadow-md border"
      :style="[themeStyles, {
        width: '240px',
        height: '72px',
        borderRadius: '28px'
      }]"
    >
      <!-- Состояние загрузки -->
      <Transition name="m3-fade" mode="out-in">
        <div v-if="isLoading" key="loading" class="flex items-center gap-3 px-3 w-full h-full">
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full animate-pulse"
            :style="{ background: 'var(--w-icon-bg)' }"
          />
          <div class="flex flex-col gap-2 flex-1">
            <div class="h-2 rounded-full animate-pulse w-16" :style="{ background: 'var(--w-icon-bg)' }" />
            <div class="h-5 rounded-full animate-pulse w-20" :style="{ background: 'var(--w-icon-bg)' }" />
          </div>
        </div>

        <!-- Состояние ошибки -->
        <div v-else-if="hasError" key="error" class="flex items-center gap-3 px-3 w-full h-full">
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
            :style="{ background: 'var(--w-icon-bg)', color: 'var(--w-icon-text)' }"
          >
            <i class="ri-error-warning-line"></i>
          </div>
          <div class="flex flex-col flex-1 truncate pr-2">
            <span class="text-[11px] font-bold tracking-wider uppercase opacity-80" style="color: var(--w-label)">
              Error
            </span>
            <span class="text-xs leading-tight" style="color: var(--w-text)">No data</span>
          </div>
        </div>

        <!-- Основной экран -->
        <div v-else :key="currentScreen.id" class="flex items-center gap-3 px-3 w-full h-full">
          <!-- Иконка в круге -->
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors duration-500"
            :style="{ background: 'var(--w-icon-bg)', color: 'var(--w-icon-text)' }"
          >
            <i :class="currentScreen.icon"></i>
          </div>

          <!-- Текстовый блок -->
          <div class="flex flex-col flex-1 truncate pr-2">
            <div class="flex items-center gap-2 mb-0.5">
              <!-- Точка LIVE -->
              <span v-if="currentScreen.count > 0" class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  :style="{ backgroundColor: currentScreen.brandColor }"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2"
                  :style="{ backgroundColor: currentScreen.brandColor }"
                ></span>
              </span>

              <span
                class="text-[11px] font-bold tracking-wider uppercase opacity-80"
                style="color: var(--w-label)"
              >
                {{ currentScreen.label }}
              </span>
            </div>

            <!-- Число -->
            <span
              class="text-2xl font-bold tracking-tighter leading-none tabular-nums"
              style="color: var(--w-text)"
            >
              {{ format(currentScreen.count) }}
            </span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

// ─── Константы ────────────────────────────────────────────────────────────
const TWITCH_LOGIN_RE = /^[a-zA-Z0-9_]{1,25}$/;
const YOUTUBE_CHANNEL_RE = /^UC[a-zA-Z0-9_-]{22}$/;
const HEX_COLOR_RE = /^[0-9a-fA-F]{6}$/;

const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID ?? '';
const TWITCH_TOKEN = import.meta.env.VITE_TWITCH_AUTH_TOKEN ?? '';
const YT_KEYS = (import.meta.env.VITE_YOUTUBE_KEYS ?? '').split(',').map(k => k.trim()).filter(Boolean);

// ─── Состояние ────────────────────────────────────────────────────────────
const channels = reactive({ twitch: '', youtube: '' });
const stats = reactive({ twitch: 0, youtube: 0 });
const displayMode = ref('total');
const isLoading = ref(true);
const hasError = ref(false);
const isDark = ref(false);

// Палитра (по умолчанию Material 3 Violet)
const palette = reactive({
  main: '#6750A4',
  bg: null,
  text: null,
  label: null,
  border: null
});

// ─── Таймеры ──────────────────────────────────────────────────────────────
const apiTimer = ref(null);
const cycleTimer = ref(null);
let ytKeyIndex = 0;
let currentAbort = null;

// ─── Вспомогательные функции ──────────────────────────────────────────────
const format = (num) => new Intl.NumberFormat('ru-RU').format(num);

const getNextYtKey = () => {
  if (!YT_KEYS.length) return null;
  return YT_KEYS[ytKeyIndex++ % YT_KEYS.length];
};

const safeFetch = async (url, options = {}, signal) => {
  const res = await fetch(url, { ...options, signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ─── Темизация ────────────────────────────────────────────────────────────
const themeStyles = computed(() => {
  const main = palette.main;
  
  const themeDefaults = isDark.value ? {
    bg: palette.bg || '#1d1b20',
    text: palette.text || '#e6e1e5',
    label: palette.label || '#cac4d0',
    border: palette.border || `${main}44`,
    iconBg: `${main}33`
  } : {
    bg: palette.bg || '#fef7ff',
    text: palette.text || '#1d1b20',
    label: palette.label || '#49454f',
    border: palette.border || '#cac4d0',
    iconBg: `${main}22`
  };

  return {
    '--w-bg': themeDefaults.bg,
    '--w-text': themeDefaults.text,
    '--w-label': themeDefaults.label,
    '--w-icon-bg': themeDefaults.iconBg,
    '--w-icon-text': main,
    'backgroundColor': 'var(--w-bg)',
    'borderColor': themeDefaults.border,
  };
});

const currentScreen = computed(() => {
  const total = stats.twitch + stats.youtube;
  if (displayMode.value === 'twitch') {
    return { id: 'tw', label: 'Twitch', count: stats.twitch, icon: 'ri-twitch-fill', brandColor: '#9146FF' };
  }
  if (displayMode.value === 'youtube') {
    return { id: 'yt', label: 'YouTube', count: stats.youtube, icon: 'ri-youtube-fill', brandColor: '#FF0000' };
  }
  return { id: 'total', label: 'Total Live', count: total, icon: 'ri-broadcast-line', brandColor: palette.main };
});

// ─── Логика API ───────────────────────────────────────────────────────────
const fetchData = async () => {
  if (currentAbort) currentAbort.abort();
  const abort = new AbortController();
  currentAbort = abort;
  const { signal } = abort;

  if (document.hidden) return;
  let anyError = false;

  // Twitch
  if (channels.twitch && TWITCH_CLIENT_ID && TWITCH_TOKEN) {
    try {
      const data = await safeFetch(
        `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channels.twitch)}`,
        { headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${TWITCH_TOKEN}` } },
        signal
      );
      if (!signal.aborted) stats.twitch = data.data?.[0]?.viewer_count ?? 0;
    } catch (e) {
      if (e.name !== 'AbortError') { console.warn('Twitch fail'); anyError = true; }
    }
  }

  // YouTube
  if (channels.youtube) {
    const key = getNextYtKey();
    if (key) {
      try {
        const sData = await safeFetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&channelId=${encodeURIComponent(channels.youtube)}&key=${encodeURIComponent(key)}`,
          {}, signal
        );
        if (!signal.aborted && sData.items?.length > 0) {
          const vIds = sData.items.map(i => i.id.videoId).join(',');
          const lData = await safeFetch(
            `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${encodeURIComponent(vIds)}&key=${encodeURIComponent(key)}`,
            {}, signal
          );
          if (!signal.aborted) {
            stats.youtube = (lData.items ?? []).reduce((sum, item) => {
              return sum + parseInt(item.liveStreamingDetails?.concurrentViewers ?? '0', 10);
            }, 0);
          }
        } else {
          stats.youtube = 0;
        }
      } catch (e) {
        if (e.name !== 'AbortError') { console.warn('YouTube fail'); anyError = true; }
      }
    }
  }

  if (!signal.aborted) {
    hasError.value = anyError && stats.twitch === 0 && stats.youtube === 0;
    isLoading.value = false;
  }
};

// ─── Инициализация ────────────────────────────────────────────────────────
const initSettings = () => {
  const p = new URLSearchParams(window.location.search);

  // Валидация HEX
  const parseColor = (key) => {
    const val = p.get(key);
    return HEX_COLOR_RE.test(val) ? `#${val}` : null;
  };

  // Каналы
  const tw = p.get('twitch') ?? '';
  channels.twitch = TWITCH_LOGIN_RE.test(tw) ? tw : '';
  const yt = p.get('yt') ?? '';
  channels.youtube = YOUTUBE_CHANNEL_RE.test(yt) ? yt : '';

  // Тема и палитра
  isDark.value = p.get('theme') === 'dark';
  palette.main = parseColor('color') || '#6750A4';
  palette.bg = parseColor('bg');
  palette.text = parseColor('text');
  palette.label = parseColor('label');
  palette.border = parseColor('border');

  // Цикл экранов
  const modes = ['total'];
  if (channels.twitch) modes.push('twitch');
  if (channels.youtube) modes.push('youtube');

  if (modes.length > 1 && p.get('animate') !== 'false') {
    let idx = 0;
    cycleTimer.value = setInterval(() => {
      idx = (idx + 1) % modes.length;
      displayMode.value = modes[idx];
    }, 15000);
  }
};

// ─── Жизненный цикл ───────────────────────────────────────────────────────
onMounted(() => {
  initSettings();
  fetchData();
  apiTimer.value = setInterval(fetchData, 60000);
  document.addEventListener('visibilitychange', () => !document.hidden && fetchData());
});

onUnmounted(() => {
  clearInterval(apiTimer.value);
  clearInterval(cycleTimer.value);
  if (currentAbort) currentAbort.abort();
});
</script>

<style scoped>
.m3-fade-enter-active,
.m3-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0, 0, 1);
}
.m3-fade-enter-from { opacity: 0; transform: translateY(10px) scale(0.96); }
.m3-fade-leave-to   { opacity: 0; transform: translateY(-10px) scale(0.96); }
</style>