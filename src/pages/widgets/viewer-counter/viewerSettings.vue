<template>
  <div class="min-h-screen bg-[#f4f0fa] text-[#18141f] font-['Roboto',sans-serif] overflow-x-hidden">

    <!-- Skeleton overlay -->
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
        <p class="text-[11px] font-bold tracking-[.2em] uppercase text-[#b8b0cc] animate-pulse">Loading Studio</p>
      </div>
    </Transition>

    <div class="max-w-[1400px] mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <!-- ── Left: Controls ─────────────────────────────────────────── -->
        <div class="lg:col-span-7 flex flex-col gap-6">

          <!-- Header -->
          <header class="flex items-center gap-4">
            <div class="w-14 h-14 bg-[#6750a4] rounded-[20px] flex items-center justify-center shadow-[0_8px_24px_#6750a440] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                <path d="M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-black tracking-tight leading-none">Widget Studio</h1>
              <p class="text-sm text-[#6b6778] mt-1">База виджетов для стрима</p>
            </div>
          </header>

          <!-- Main card -->
          <div class="bg-white rounded-[32px] border border-[#e4e0f0] shadow-[0_2px_16px_rgba(103,80,164,.06)] p-8 md:p-10 flex flex-col gap-9">

            <!-- Visual style -->
            <section class="flex flex-col gap-4">
              <h2 class="text-[10px] font-black tracking-[.22em] uppercase text-[#6750a4]">Visual Style</h2>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="v in ['v1', 'v2']" :key="v"
                  @click="form.view = v"
                  :class="[
                    'flex flex-col gap-1 items-start p-5 rounded-[20px] border-2 transition-all text-left cursor-pointer',
                    form.view === v
                      ? 'bg-[#ede8fb] border-[#6750a4] shadow-[0_0_0_4px_#6750a412]'
                      : 'bg-[#faf9fe] border-[#e4e0f0] hover:border-[#b8a8e0]'
                  ]"
                >
                  <span class="text-[17px] font-bold">{{ v === 'v1' ? 'Material 3' : 'Barlow Pro' }}</span>
                  <span class="text-[11px] text-[#6b6778]">{{ v === 'v1' ? 'Modern / Soft UI' : 'Aggressive / Flat' }}</span>
                </button>
              </div>
            </section>

            <!-- Platform inputs -->
            <section class="flex flex-col gap-4">
              <h2 class="text-[10px] font-black tracking-[.22em] uppercase text-[#6750a4]">Платформы</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <!-- Twitch -->
                <div class="flex flex-col gap-2">
                  <label class="flex items-center gap-1.5 text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6778]">
                    <svg viewBox="0 0 24 24" fill="#9146FF" width="13" height="13">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                    </svg>
                    Twitch Login
                  </label>
                  <input
                    v-model.trim="form.twitch"
                    type="text"
                    maxlength="25"
                    placeholder="Or1ggin"
                    @input="twitchError = false"
                    @blur="validateTwitch"
                    :class="[
                      'w-full bg-[#f5f2fc] rounded-[14px] px-5 py-3.5 text-sm font-medium outline-none border-2 transition-all placeholder:text-[#c4bcd8]',
                      twitchError ? 'border-red-500' : 'border-transparent focus:border-[#6750a4] focus:shadow-[0_0_0_4px_#6750a414]'
                    ]"
                  />
                  <p v-if="twitchError" class="text-[11px] text-red-500">Только буквы, цифры и _ (до 25 симв.)</p>
                </div>

                <!-- YouTube -->
                <div class="flex flex-col gap-2">
                  <label class="flex items-center gap-1.5 text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6778]">
                    <svg viewBox="0 0 24 24" fill="#FF0000" width="13" height="13">
                      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
                    YouTube Channel ID <a href="https://www.google.com/search?q=%D0%BA%D0%B0%D0%BA+%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C+channel+id+youtube" class="text-black">(как получить?)</a>
                  </label>
                  <input
                    v-model.trim="form.yt"
                    type="text"
                    placeholder="UC6GIR5W1Bm5Moc3kzKV-nhw"
                    @input="ytError = false"
                    @blur="validateYt"
                    :class="[
                      'w-full bg-[#f5f2fc] rounded-[14px] px-5 py-3.5 text-sm font-medium outline-none border-2 transition-all placeholder:text-[#c4bcd8]',
                      ytError ? 'border-red-500' : 'border-transparent focus:border-[#6750a4] focus:shadow-[0_0_0_4px_#6750a414]'
                    ]"
                  />
                  <p v-if="ytError" class="text-[11px] text-red-500">Формат: UC + 22 символа</p>
                </div>
              </div>

              <p v-if="noPlatform" class="text-[12px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl">
                ⚠️ Укажи хотя бы одну платформу для генерации ссылки
              </p>
            </section>

            <!-- Appearance -->
            <section class="flex flex-col gap-4">
              <h2 class="text-[10px] font-black tracking-[.22em] uppercase text-[#6750a4]">Внешний вид</h2>
              <div class="flex flex-wrap gap-5 items-end">

                <!-- Accent color -->
                <div class="flex flex-col gap-2">
                  <span class="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6778]">Accent Color</span>
                  <div class="flex items-center gap-3 bg-[#f5f2fc] px-3 py-2 rounded-[14px] border-2 border-transparent focus-within:border-[#6750a4] transition-all">
                    <input
                      type="color"
                      :value="form.color"
                      @input="onColorPicker"
                      class="w-10 h-10 rounded-[10px] cursor-pointer border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[8px] [&::-webkit-color-swatch]:border-none"
                    />
                    <input
                      type="text"
                      :value="form.color"
                      @change="onColorText"
                      maxlength="7"
                      spellcheck="false"
                      class="w-20 bg-transparent border-none outline-none text-sm font-bold font-mono uppercase text-[#18141f]"
                    />
                  </div>
                </div>

                <!-- Theme -->
                <div class="flex flex-col gap-2">
                  <span class="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6778]">Theme</span>
                  <div class="flex bg-[#f5f2fc] p-1 rounded-[14px] gap-1">
                    <button
                      @click="form.isDark = false"
                      :class="[
                        'flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all',
                        !form.isDark ? 'bg-white text-[#18141f] shadow-sm' : 'text-[#6b6778]'
                      ]"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .38-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.38.39-1.02 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.38-.39-1.02-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.39-.38-1.03-.39-1.41 0z"/>
                      </svg>
                      Light
                    </button>
                    <button
                      @click="form.isDark = true"
                      :class="[
                        'flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all',
                        form.isDark ? 'bg-[#1c1c21] text-white shadow-lg' : 'text-[#6b6778]'
                      ]"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                      </svg>
                      Dark
                    </button>
                  </div>
                </div>

                <!-- Animation -->
                <div class="flex flex-col gap-2">
                  <span class="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6778]">Animation</span>
                  <button
                    @click="form.animate = !form.animate"
                    :class="[
                      'flex items-center gap-2 px-5 h-11 rounded-[14px] text-[13px] font-bold transition-all border-2',
                      form.animate
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-[#f5f2fc] text-[#6b6778] border-transparent'
                    ]"
                  >
                    <span :class="['w-2 h-2 rounded-full flex-shrink-0', form.animate ? 'bg-green-500' : 'bg-slate-400']" />
                    {{ form.animate ? 'ON' : 'OFF' }}
                  </button>
                </div>

                <!-- Cycle (only if both platforms) -->
                <div v-if="form.twitch && form.yt" class="flex flex-col gap-2">
                  <span class="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6778]">Auto-Cycle</span>
                  <button
                    @click="form.cycle = !form.cycle"
                    :class="[
                      'flex items-center gap-2 px-5 h-11 rounded-[14px] text-[13px] font-bold transition-all border-2',
                      form.cycle
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-[#f5f2fc] text-[#6b6778] border-transparent'
                    ]"
                  >
                    <span :class="['w-2 h-2 rounded-full flex-shrink-0', form.cycle ? 'bg-green-500' : 'bg-slate-400']" />
                    {{ form.cycle ? 'ON' : 'OFF' }}
                  </button>
                </div>

              </div>
            </section>
          </div>

          <!-- OBS URL card -->
          <div
            :class="[
              'rounded-[32px] p-8 border transition-opacity',
              noPlatform ? 'opacity-50 pointer-events-none' : '',
              'bg-[#ede8fb] border-[#d4c8f8]'
            ]"
          >
            <div class="flex items-center justify-between flex-wrap gap-3 mb-5">
              <h2 class="text-[10px] font-black tracking-[.22em] uppercase text-[#6750a4]">OBS Link</h2>
              <button
                @click="copyUrl"
                :disabled="noPlatform || copying"
                :class="[
                  'flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                  copied
                    ? 'bg-green-600 text-white shadow-[0_4px_16px_#16a34a30]'
                    : 'bg-[#6750a4] text-white shadow-[0_4px_16px_#6750a430] hover:scale-105 active:scale-95'
                ]"
              >
                <svg v-if="copied" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                {{ copied ? 'Скопировано!' : 'Копировать в OBS' }}
              </button>
            </div>
            <div class="bg-white/70 border border-[#d4c8f8] rounded-2xl px-5 py-4 font-mono text-[12px] font-semibold text-[#4a357a] break-all leading-relaxed select-all">
              {{ finalUrl }}
            </div>
          </div>
        </div>

        <!-- ── Right: Preview ──────────────────────────────────────────── -->
        <div class="lg:col-span-5 lg:sticky lg:top-12 lg:self-start">
          <div
            :class="[
              'rounded-[48px] p-16 flex flex-col items-center justify-center min-h-[560px] relative overflow-hidden border transition-all duration-500',
              form.isDark
                ? 'bg-[#18181d] border-white/5 shadow-[0_24px_64px_rgba(0,0,0,.5)]'
                : 'bg-[#e9deff] border-[#d4c8f8] shadow-[0_24px_64px_rgba(103,80,164,.15)]'
            ]"
          >
            <!-- Live badge -->
            <div class="absolute top-7 flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-[10px] font-black tracking-[.3em] uppercase text-[#6750a4]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#6750a4] animate-pulse" />
              Live Preview
            </div>

            <!-- Scaled widget -->
            <div class="scale-[1.75] transition-transform duration-500">

              <!-- V1: Material 3 -->
              <div
                v-if="form.view === 'v1'"
                class="w-60 h-[72px] rounded-[28px] overflow-hidden flex items-center transition-all duration-500"
                :style="v1Styles"
              >
                <div class="flex items-center gap-3 px-3 w-full h-full">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    :style="{ background: form.color + '22', color: form.color }"
                  >
                    <svg v-if="form.twitch && !form.yt" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                    </svg>
                    <svg v-else-if="form.yt && !form.twitch" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </div>
                  <div class="flex flex-col flex-1 truncate pr-2">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span v-if="form.animate" class="relative flex w-[7px] h-[7px] flex-shrink-0">
                        <span class="absolute inset-0 rounded-full opacity-50 animate-ping" :style="{ background: previewBrandColor }" />
                        <span class="relative w-[7px] h-[7px] rounded-full" :style="{ background: previewBrandColor }" />
                      </span>
                      <span class="text-[10px] font-bold uppercase tracking-wider opacity-60">{{ previewLabel }}</span>
                    </div>
                    <span class="text-2xl font-bold tracking-tighter leading-none tabular-nums" style="font-family:'Barlow Condensed',sans-serif">2 481</span>
                  </div>
                </div>
              </div>

              <!-- V2: Barlow Pro -->
              <div
                v-else
                class="relative overflow-hidden transition-all duration-500"
                style="width:244px;height:74px;border-radius:18px;font-family:'Barlow',sans-serif"
                :style="v2Styles"
              >
                <div class="flex items-center gap-3 px-3.5 h-full w-full">
                  <div
                    class="w-11 h-11 rounded-[13px] flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    :style="{ background: form.color + '18', color: form.color }"
                  >
                    <svg v-if="form.twitch && !form.yt" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                    </svg>
                    <svg v-else-if="form.yt && !form.twitch" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </div>
                  <div class="flex flex-col gap-px overflow-hidden flex-1">
                    <div class="flex items-center gap-1.5">
                      <span v-if="form.animate" class="relative flex w-[7px] h-[7px] flex-shrink-0">
                        <span class="absolute inset-0 rounded-full opacity-45 animate-ping" :style="{ background: previewBrandColor }" />
                        <span class="relative w-[7px] h-[7px] rounded-full" :style="{ background: previewBrandColor }" />
                      </span>
                      <span class="text-[9px] font-bold tracking-[.14em] uppercase opacity-50 whitespace-nowrap">{{ previewLabel }}</span>
                    </div>
                    <span class="text-[30px] font-extrabold tracking-tighter leading-none tabular-nums" style="font-family:'Barlow Condensed',sans-serif">2 481</span>
                  </div>
                </div>
                <!-- Accent bar -->
                <div
                  class="absolute bottom-0 left-4 right-4 h-[2px] rounded-t-sm opacity-65 transition-all duration-500"
                  :style="{ background: previewBrandColor }"
                />
              </div>

            </div>

            <!-- Footer dots -->
            <div class="absolute bottom-9 flex flex-col items-center gap-2">
              <div class="flex gap-1.5">
                <div v-for="i in 5" :key="i" class="w-1.5 h-1.5 rounded-full bg-[#6750a4]/20" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const TWITCH_RE  = /^[a-zA-Z0-9_]{1,25}$/;
const YOUTUBE_RE = /^UC[a-zA-Z0-9_-]{22}$/;
const HEX_RE     = /^#[0-9a-fA-F]{6}$/;

const pageLoading = ref(true);
const copied      = ref(false);
const copying     = ref(false);
const twitchError = ref(false);
const ytError     = ref(false);

const form = reactive({
  view:    'v1',
  twitch:  '',
  yt:      '',
  color:   '#6750A4',
  isDark:  false,
  animate: true,
  cycle:   true,
});

const noPlatform = computed(() => !form.twitch && !form.yt);

const previewLabel = computed(() => {
  if (form.twitch && !form.yt) return 'Twitch';
  if (form.yt && !form.twitch) return 'YouTube';
  return 'Live Total';
});

const previewBrandColor = computed(() => {
  if (form.twitch && !form.yt) return '#9146FF';
  if (form.yt && !form.twitch) return '#FF0000';
  return form.color;
});

const v1Styles = computed(() => ({
  background: form.isDark ? '#2b2930' : '#fef7ff',
  border:     `1px solid ${form.isDark ? form.color + '44' : '#cac4d0'}`,
  color:      form.isDark ? '#e6e1e5' : '#1d1b20',
  boxShadow:  form.isDark ? '0 10px 30px rgba(0,0,0,.4)' : `0 10px 30px ${form.color}18`,
}));

const v2Styles = computed(() => ({
  background: form.isDark ? '#18181d' : '#ffffff',
  border:     `1.5px solid ${form.isDark ? form.color + '28' : '#e4e1ef'}`,
  color:      form.isDark ? '#ededf2' : '#18161f',
}));

const finalUrl = computed(() => {
  const tw = TWITCH_RE.test(form.twitch) ? form.twitch : '';
  const yt = YOUTUBE_RE.test(form.yt)   ? form.yt     : '';
  if (!tw && !yt) return '—';

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const path   = form.view === 'v1' ? '/widget/viewercounter2' : '/widget/viewercounter2';
  const url    = new URL(origin + path);
  if (tw) url.searchParams.set('twitch', tw);
  if (yt) url.searchParams.set('yt', yt);
  url.searchParams.set('color', form.color.replace('#', ''));
  url.searchParams.set('theme', form.isDark ? 'dark' : 'light');
  if (!form.animate) url.searchParams.set('animate', 'false');
  if (tw && yt && !form.cycle) url.searchParams.set('cycle', 'false');
  return url.toString();
});

const onColorPicker = (e) => { form.color = e.target.value; };
const onColorText   = (e) => {
  const val = e.target.value.trim();
  const hex = val.startsWith('#') ? val : `#${val}`;
  if (HEX_RE.test(hex)) form.color = hex;
  else e.target.value = form.color;
};

const validateTwitch = () => { if (form.twitch && !TWITCH_RE.test(form.twitch)) twitchError.value = true; };
const validateYt     = () => { if (form.yt && !YOUTUBE_RE.test(form.yt)) ytError.value = true; };

const copyToClipboard = async (text) => {
  if (!text) throw new Error('Нет текста для копирования');

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const successful = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!successful) {
    throw new Error('Не удалось скопировать в буфер обмена');
  }
};

const copyUrl = async () => {
  if (noPlatform.value || copying.value || finalUrl.value === '—') return;
  if (form.twitch && !TWITCH_RE.test(form.twitch)) { twitchError.value = true; return; }
  if (form.yt && !YOUTUBE_RE.test(form.yt))        { ytError.value = true; return; }

  copying.value = true;
  try {
    await copyToClipboard(finalUrl.value);
    copied.value = true;
  } catch (error) {
    console.error('Clipboard error:', error);
  } finally {
    copying.value = false;
    setTimeout(() => { copied.value = false; }, 2500);
  }
};

onMounted(() => {
  requestAnimationFrame(() => setTimeout(() => { pageLoading.value = false; }, 400));
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Barlow+Condensed:wght@700;800&family=Barlow:wght@500;700;800&display=swap');

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>