//components/Gameplay/HeaderTimer.vue

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'HeaderTimer',
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    const gameId = route.params.gameId;

    const progressBarStyle = computed(() => {
      const percentage = store.getters.progressPercentage;
      return {
        width: percentage + '%',
        backgroundColor: store.getters.progressColor
      };
    });

    const formattedTime = computed(() => store.getters.formattedTime);

    onMounted(async () => {
      if (!store.state.gameData) {
        await store.dispatch('fetchGameData', gameId);
      }
      
      if (store.state.currentTimeLeft > 0) {
        store.dispatch('startTimer'); 
      }
      emit('updateTime', store.state.currentTimeLeft);
    });

    onUnmounted(() => {
      store.dispatch('stopTimer');
    });

    return {
      progressBarStyle,
      formattedTime
    };
  }
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
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;

.header-timer {
  width: 100%;
  height: 100%;
  background-color: $bg-dark;
  position: relative;
  border: 2px solid $neon-blue;
  box-shadow: 0 0 10px $neon-blue, 0 0 20px $neon-blue;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 1s linear, background-color 1s linear;
  position: relative;
  box-shadow: 0 0 10px $neon-green, 0 0 20px $neon-green;
}

.progress-bar p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  text-shadow: 0 0 5px $neon-pink, 0 0 10px $neon-pink;
  font-family: 'Poppins', sans-serif;
}
</style>