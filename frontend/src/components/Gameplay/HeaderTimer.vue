//components/Gameplay/HeaderTimer.vue

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

export default {
  name: 'HeaderTimer',
  setup(props, { emit }) {
    const route = useRoute();
    const gameId = route.params.gameId;
    const timerMinutes = ref(0);
    const initialTime = ref(0);
    const timeLeft = ref(0);
    let intervalId = null;

    async function fetchTimer() {
      try {
        const response = await api.get(`/startGame/${gameId}`);
        if (response.data.success) {
          timerMinutes.value = parseFloat(response.data.game.gridTimer);
          initialTime.value = timerMinutes.value * 60;
          timeLeft.value = initialTime.value;
          startCountdown();
        }
      } catch (error) {
        console.error('Error fetching timer:', error);
      }
    }

    function startCountdown() {
      intervalId = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value -= 1;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    }

    watch(timeLeft, (newVal) => {
      emit('updateTime', newVal);
    });

    const progressBarStyle = computed(() => {
      const percentage =
        initialTime.value === 0 ? 0 : (timeLeft.value / initialTime.value) * 100;
      let bgColor = "#47b94a"; 
      if (percentage < 33) {
        bgColor = "#FF0000"; 
      } else if (percentage < 66) {
        bgColor = "#ea951a"; 
      }
      return {
        width: percentage + '%',
        backgroundColor: bgColor,
      };
    });

    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      const mm = minutes < 10 ? '0' + minutes : minutes;
      const ss = seconds < 10 ? '0' + seconds : seconds;
      return `${mm}:${ss}`;
    });

    onMounted(fetchTimer);
    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      progressBarStyle,
      formattedTime,
    };
  },
};
</script>

<template>
  <div class="header-timer">
    <div class="progress-bar" :style="progressBarStyle">
      <p>{{ formattedTime }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-timer {
  width: 100%;
  height: 100%;
  background-color: #eee;
  position: relative;
}

.progress-bar {
  height: 100%;
  transition: width 1s linear, background-color 1s linear;
}

.progress-bar p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-weight: bold;
}
</style>