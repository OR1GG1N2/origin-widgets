<template>
  <div class="widget-root" :class="{ dark: isDark }">
    <div class="widget-card" :style="cardStyle">

      <!-- Skeleton -->
      <Transition name="fade" mode="out-in">
        <div v-if="isLoading" key="skeleton" class="widget-inner">
          <div class="skeleton-icon" />
          <div class="skeleton-text">
            <div class="skeleton-line short" />
            <div class="skeleton-line long" />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="hasError" key="error" class="widget-inner">
          <div class="platform-logo-wrap" :style="iconWrapStyle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
            </svg>
          </div>
          <div class="text-block">
            <span class="label-text">Ошибка</span>
            <span class="count-text">—</span>
          </div>
        </div>

        <!-- Main -->
        <Transition v-else name="slide" mode="out-in">
          <div :key="currentScreen.id" class="widget-inner">

            <!-- Logo -->
            <div class="platform-logo-wrap" :style="iconWrapStyle">

              <!-- Twitch -->
              <svg v-if="currentScreen.platform === 'twitch'"
                viewBox="0 0 24 24" width="24" height="24" :fill="currentScreen.brandColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
              </svg>

              <!-- YouTube -->
              <svg v-else-if="currentScreen.platform === 'youtube'"
                viewBox="0 0 24 24" width="26" height="26" :fill="currentScreen.brandColor">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
              </svg>

              <!-- Total -->
              <svg v-else viewBox="0 0 24 24" width="24" height="24" :fill="accentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>

            <!-- Text -->
            <div class="text-block">
              <div class="label-row">
                <span v-if="currentScreen.count > 0" class="live-dot"
                  :style="{ '--dot': currentScreen.brandColor || accentColor }">
                  <span class="dot-ring" />
                  <span class="dot-core" />
                </span>
                <span class="label-text">{{ currentScreen.label }}</span>
              </div>
              <span class="count-text">{{ format(currentScreen.count) }}</span>
            </div>

          </div>
        </Transition>
      </Transition>

      <!-- Accent bar -->
      <div class="accent-bar"
        :style="{ background: currentScreen?.brandColor || accentColor }" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

// ─── Validation ───────────────────────────────────────────────────────────
const TWITCH_RE  = /^[a-zA-Z0-9_]{1,25}$/;
const YOUTUBE_RE = /^UC[a-zA-Z0-9_-]{22}$/;
const HEX_RE     = /^[0-9a-fA-F]{6}$/;

// ─── ENV ──────────────────────────────────────────────────────────────────
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID ?? '';
const TWITCH_TOKEN     = import.meta.env.VITE_TWITCH_AUTH_TOKEN ?? '';
const YT_KEYS = (import.meta.env.VITE_YOUTUBE_KEYS ?? '')
  .split(',').map(k => k.trim()).filter(Boolean);

// ─── State ────────────────────────────────────────────────────────────────
const channels    = reactive({ twitch: '', youtube: '' });
const stats       = reactive({ twitch: 0, youtube: 0 });
const displayMode = ref('total');
const accentColor = ref('#6750A4');
const isDark      = ref(false);
const isLoading   = ref(true);
const hasError    = ref(false);

const apiTimer   = ref(null);
const cycleTimer = ref(null);
let currentAbort = null;
let ytKeyIdx     = 0;

// ─── Helpers ──────────────────────────────────────────────────────────────
const format      = n  => new Intl.NumberFormat('ru-RU').format(n);
const getNextYtKey = () => YT_KEYS.length ? YT_KEYS[ytKeyIdx++ % YT_KEYS.length] : null;

// ─── Theme styles ─────────────────────────────────────────────────────────
const cardStyle = computed(() => {
  const hex = accentColor.value;
  return isDark.value
    ? { '--surface': '#18181d', '--border': `${hex}28`,
        '--text': '#ededf2', '--sub': '#8f8b9e',
        '--icon-bg': `${hex}22`, '--icon-fg': hex,
        '--shimmer-a': '#ffffff06', '--shimmer-b': '#ffffff10' }
    : { '--surface': '#ffffff', '--border': '#e4e1ef',
        '--text': '#18161f', '--sub': '#6e6a7c',
        '--icon-bg': `${hex}15`, '--icon-fg': hex,
        '--shimmer-a': '#00000006', '--shimmer-b': '#0000000e' };
});

const iconWrapStyle = computed(() => ({
  background: 'var(--icon-bg)',
  color: 'var(--icon-fg)',
}));

// ─── Current screen ───────────────────────────────────────────────────────
const currentScreen = computed(() => {
  const total = stats.twitch + stats.youtube;
  if (displayMode.value === 'twitch') {
    return { id: 'tw', label: 'Twitch',    count: stats.twitch,  platform: 'twitch',  brandColor: '#9146FF' };
  }
  if (displayMode.value === 'youtube') {
    return { id: 'yt', label: 'YouTube',   count: stats.youtube, platform: 'youtube', brandColor: '#FF0000' };
  }
  return   { id: 'total', label: 'Live Total', count: total, platform: 'total', brandColor: accentColor.value };
});

// ─── Fetch ────────────────────────────────────────────────────────────────
const safeFetch = async (url, options, signal) => {
  const res = await fetch(url, { ...options, signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const fetchData = async () => {
  if (document.hidden) return;
  if (currentAbort) currentAbort.abort();
  const ctrl = new AbortController();
  currentAbort = ctrl;
  const { signal } = ctrl;
  let anyError = false;

  // Twitch
  if (channels.twitch && TWITCH_CLIENT_ID && TWITCH_TOKEN) {
    try {
      const d = await safeFetch(
        `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channels.twitch)}`,
        { headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${TWITCH_TOKEN}` } },
        signal
      );
      if (!signal.aborted) stats.twitch = d.data?.[0]?.viewer_count ?? 0;
    } catch (e) {
      if (e.name !== 'AbortError') { console.warn('[widget] Twitch error'); anyError = true; }
    }
  }

  // YouTube
  if (channels.youtube) {
    const key = getNextYtKey();
    if (key) {
      try {
        const sData = await safeFetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video` +
          `&channelId=${encodeURIComponent(channels.youtube)}&key=${encodeURIComponent(key)}`,
          {}, signal
        );
        if (!signal.aborted) {
          if (sData.items?.length > 0) {
            const ids = sData.items.map(i => i.id.videoId).join(',');
            const lData = await safeFetch(
              `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails` +
              `&id=${encodeURIComponent(ids)}&key=${encodeURIComponent(key)}`,
              {}, signal
            );
            if (!signal.aborted) {
              stats.youtube = (lData.items ?? []).reduce((s, i) => {
                const v = parseInt(i.liveStreamingDetails?.concurrentViewers ?? '0', 10);
                return s + (Number.isNaN(v) ? 0 : v);
              }, 0);
            }
          } else { stats.youtube = 0; }
        }
      } catch (e) {
        if (e.name !== 'AbortError') { console.warn('[widget] YouTube error'); anyError = true; }
      }
    }
  }

  if (!signal.aborted) {
    hasError.value  = anyError && stats.twitch === 0 && stats.youtube === 0;
    isLoading.value = false;
  }
};

// ─── URL config ───────────────────────────────────────────────────────────
const initSettings = () => {
  const p = new URLSearchParams(window.location.search);

  const tw = p.get('twitch') ?? '';
  channels.twitch = TWITCH_RE.test(tw) ? tw : '';

  const yt = p.get('yt') ?? '';
  channels.youtube = YOUTUBE_RE.test(yt) ? yt : '';

  isDark.value = p.get('theme') === 'dark';

  const color = p.get('color') ?? '';
  if (HEX_RE.test(color)) accentColor.value = `#${color}`;

  const modes = ['total'];
  if (channels.twitch)  modes.push('twitch');
  if (channels.youtube) modes.push('youtube');

  if (modes.length === 2) {
    // Single platform — show it right away, no cycling
    displayMode.value = modes[1];
  } else if (modes.length > 2 && p.get('cycle') !== 'false') {
    let i = 0;
    cycleTimer.value = setInterval(() => {
      i = (i + 1) % modes.length;
      displayMode.value = modes[i];
    }, 15_000);
  }
};

const onVisibilityChange = () => { if (!document.hidden) fetchData(); };

onMounted(() => {
  initSettings();
  fetchData();
  apiTimer.value = setInterval(fetchData, 60_000);
  document.addEventListener('visibilitychange', onVisibilityChange);
});

onUnmounted(() => {
  clearInterval(apiTimer.value);
  clearInterval(cycleTimer.value);
  if (currentAbort) currentAbort.abort();
  document.removeEventListener('visibilitychange', onVisibilityChange);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@500&display=swap');

/* ─── Root ──────────────────────────────────────────────────────────────── */
.widget-root {
  display: inline-flex;
  font-family: 'Barlow', sans-serif;
}

/* ─── Card ──────────────────────────────────────────────────────────────── */
.widget-card {
  position: relative;
  width: 244px;
  height: 74px;
  border-radius: 18px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  overflow: hidden;
  transition: background 0.35s, border-color 0.35s;
  box-shadow: 0 2px 12px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
}

.dark .widget-card {
  box-shadow: 0 4px 28px rgba(0,0,0,.5), 0 1px 3px rgba(0,0,0,.4);
}

/* ─── Inner row ─────────────────────────────────────────────────────────── */
.widget-inner {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 14px;
  height: 100%;
  width: 100%;
}

/* ─── Logo wrap ─────────────────────────────────────────────────────────── */
.platform-logo-wrap {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.35s;
}

/* ─── Text ──────────────────────────────────────────────────────────────── */
.text-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
  flex: 1;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.label-text {
  font-family: 'Barlow', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--sub);
  white-space: nowrap;
  transition: color 0.35s;
}

.count-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -.025em;
  line-height: 1;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  transition: color 0.35s;
}

/* ─── Live dot ──────────────────────────────────────────────────────────── */
.live-dot {
  position: relative;
  display: inline-flex;
  width: 7px;
  height: 7px;
  flex-shrink: 0;
}
.dot-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--dot);
  opacity: .5;
  animation: ping 1.9s ease-out infinite;
}
.dot-core {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--dot);
}

@keyframes ping {
  0%   { transform: scale(1);   opacity: .5; }
  70%  { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}

/* ─── Accent bar ────────────────────────────────────────────────────────── */
.accent-bar {
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  border-radius: 2px 2px 0 0;
  opacity: .65;
  transition: background 0.5s;
}

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
.skeleton-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: linear-gradient(90deg, var(--shimmer-a), var(--shimmer-b), var(--shimmer-a));
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.skeleton-line {
  border-radius: 5px;
  background: linear-gradient(90deg, var(--shimmer-a), var(--shimmer-b), var(--shimmer-a));
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

.skeleton-line.short { height: 9px;  width: 52px; animation-delay: .1s; }
.skeleton-line.long  { height: 20px; width: 72px; animation-delay: .2s; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Transitions ───────────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active  { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to      { opacity: 0; }

.slide-enter-active,
.slide-leave-active { transition: all 0.42s cubic-bezier(0.2, 0, 0, 1); }
.slide-enter-from   { opacity: 0; transform: translateY(9px) scale(0.97); }
.slide-leave-to     { opacity: 0; transform: translateY(-9px) scale(0.97); }
</style>