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