<template>
  <div class="widget-viewport">
    <!-- Vue Transition управляет анимацией ПОЯВЛЕНИЯ и ИСЧЕЗАНИЯ всего виджета -->
    <Transition name="widget-pop">
      <div v-if="isVisible" class="widget-frame">
        
        <!-- 
          КОНТЕЙНЕР ДЛЯ СКРУГЛЕНИЯ 
          Это "маска", которая обрезает всё, что внутри.
        -->
        <div class="lottie-cropper">
          <!-- Само Lottie -->
          <div ref="lottieContainer" class="lottie-player"></div>
        </div>

      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import lottie from 'lottie-web';

// --- НАСТРОЙКИ ---
const SHOW_DURATION = 15000;         // Сколько висит виджет (15 сек)
const INTERVAL_TIME = 5 * 60 * 1000; // Интервал появления (5 минут)
const ANIMATION_PATH = '/animation.json'; // Путь в public/

const isVisible = ref(false);
const lottieContainer = ref(null);
let animInstance = null;
let mainTimer = null;

const triggerWidget = () => {
  // 1. Показываем фрейм
  isVisible.value = true;
  
  // 2. Инициализируем Lottie после рендеринга DOM
  setTimeout(() => {
    if (lottieContainer.value && !animInstance) {
      animInstance = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg', // svg лучше всего подходит для маскирования
        loop: true,
        autoplay: true,
        path: ANIMATION_PATH
      });
    }
  }, 100);

  // 3. Планируем исчезновение
  setTimeout(() => {
    isVisible.value = false;
    
    // Очистка памяти после завершения CSS-анимации скрытия
    setTimeout(() => {
      if (animInstance) {
        animInstance.destroy();
        animInstance = null;
      }
    }, 600); // Время чуть больше, чем transition leave (0.5s)
  }, SHOW_DURATION);
};

onMounted(() => {
  // Запускаем цикл
  triggerWidget();
  mainTimer = setInterval(triggerWidget, INTERVAL_TIME);
});

onUnmounted(() => {
  if (mainTimer) clearInterval(mainTimer);
  if (animInstance) animInstance.destroy();
});
</script>

<style scoped>
/* 1. Основной контейнер на весь экран (для OBS Browser Source) */
.widget-viewport {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center; /* Центрируем по горизонтали */
  align-items: center;     /* Центрируем по вертикали */
  overflow: hidden;
  background: transparent; /* Прозрачный фон */
  perspective: 2000px; /* Для 3D эффектов появления */
}

/* 2. Фрейм виджета (задает позицию, тень и внешнюю анимацию) */
.widget-frame {
  position: relative;
  width: 500px;  /* Размер виджета */
  height: 203px;
  
  /* Эффекты для всего виджета (не обрезаются) */
  filter: drop-shadow(0 15px 35px rgba(0,0,0,0.6));
}

/* 
  3. КОНТЕЙНЕР-КРОППЕР (ГЛАВНОЕ СКРУГЛЕНИЕ)
  Этот элемент обрезает Lottie-анимацию внутри себя.
*/
.lottie-cropper {
  width: 100%;
  height: 100%;
  
  /* --- СПОСОБ 1: OVERFLOW (Надежный) --- */
  border-radius: 50px; /* Задаем скругление (можно 50% для круга) */
  overflow: hidden;    /* Обрезаем всё, что выходит за пределы радиуса */
  
  /* --- СПОСОБ 2: CLIP-PATH (Более современный, дублирует способ 1) --- */
  /* rect(top right bottom left round radius) */
  clip-path: inset(0 0 0 0 round 50px);
  
  /* --- СТИЛИЗАЦИЯ (ВРЕМЕННО, ДЛЯ ТЕСТА) --- */
  background: #1a1a1a; /* Добавим фон, чтобы видеть скругление */
  border: 4px solid #333; /* Рамка, подчеркивающая форму */
  box-sizing: border-radius;
}

/* 4. Сама Lottie внутри кроппера */
.lottie-player {
  width: 100%;
  height: 100%;
  /* 
    Если анимация не центрирована внутри JSON,
    можно попробовать форсировать ее поведение здесь 
  */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 
  Убеждаемся, что SVG внутри Lottie тянется 
  (иногда нужно для корректного маскирования)
*/
.lottie-player :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover; /* Или contain, зависит от анимации */
}


/* ========================================= */
/* CSS АНИМАЦИИ ВХОДА И ВЫХОДА (Transition)  */
/* ========================================= */

/* --- ВХОД (Enter) --- */
.widget-pop-enter-active {
  /* Плавное появление с "отскоком" */
  transition: all 0.8s cubic-bezier(0.22, 1.61, 0.36, 1);
}

.widget-pop-enter-from {
  opacity: 0;
  /* Появляется, вылетая снизу и увеличиваясь */
  transform: translateY(150px) scale(0.6) rotateX(-20deg);
}

/* --- ВЫХОД (Leave) --- */
.widget-pop-leave-active {
  /* Быстрое исчезновение */
  transition: all 0.5s ease-in;
}

.widget-pop-leave-to {
  opacity: 0;
  /* Улетает вверх, сжимаясь и закручиваясь */
  transform: translateY(-100px) scale(0.7) rotateZ(15deg);
  /* Добавляем эффект размытия при уходе */
  filter: blur(8px);
}
</style>