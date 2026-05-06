<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import PlayerVer1 from '../../../components/NowPlayWidget/PlayerVer1.vue';
const username = ref("Or1GG1n")
const track = ref(null)
const loading = ref(true)
const error = ref(null)

const API_KEY = "565fcd7a415ee4be39a9c3e35f9223e7"

let intervalId = null

async function fetchTrack() {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username.value}&api_key=${API_KEY}&format=json&limit=1`
    )

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }

    const text = await res.text()

    // защита от HTML (твоя прошлая ошибка)
    if (text.trim().startsWith("<")) {
      throw new Error("API вернул HTML вместо JSON")
    }

    const data = JSON.parse(text)

    const t = data?.recenttracks?.track?.[0]
    if (!t) throw new Error("Нет данных")

    track.value = {
      name: t.name || "Unknown",
      artist: t.artist?.["#text"] || "Unknown",
      image: t.image?.[t.image.length - 1]?.["#text"] || "",
      duration: t.duration ? Number(t.duration) : null,
      nowPlaying: t["@attr"]?.nowplaying === "true"
    }

  } catch (e) {
    error.value = e.message
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTrack()
  intervalId = setInterval(fetchTrack, 15000) // OBS автообновление
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <PlayerVer1 :track="track" />

</template>