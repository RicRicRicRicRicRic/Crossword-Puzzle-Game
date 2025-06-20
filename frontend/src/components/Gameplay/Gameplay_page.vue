//components/Gameplay/Gameplay_page.vue
<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import HeaderTimer from './HeaderTimer.vue';
import PlayGrid from './PlayGrid.vue';
import Definitions from './Definitions.vue';
import Hotbar from './Hotbar.vue';
import FinishGame from './FinishGame.vue';

export default {
  name: 'Gameplay_page',
  components: {
    HeaderTimer,
    Definitions,
    PlayGrid,
    Hotbar,
    FinishGame
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const gameId = computed(() => route.params.gameId);

    const showFinishGame = ref(false);

    const gameCompleted = computed(() => {
      const gridSize = store.getters.gridSize;
      if (!gridSize) return false;
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (store.getters.solutionLetter(row, col)) {
            if (store.state.gridAnswers[row][col].status !== 'correct') {
              return false;
            }
          }
        }
      }
      return true;
    });

    watch(gameCompleted, (newVal) => {
      if (newVal) {
        showFinishGame.value = true;
      }
    });

    const onQuitGame = () => {
      showFinishGame.value = true;
    };

    function onUpdateTime(newTimeLeft) {
      store.commit('UPDATE_TIME_LEFT', newTimeLeft);
    }
    
    function onCorrectLetter() {
      store.commit('INCREMENT_SCORE', store.state.currentTimeLeft);
    }
    
    function onIncorrectLetter() {
      store.commit('DECREMENT_SCORE', store.state.currentTimeLeft);
    }
    
    return {
      score: computed(() => store.state.score),
      currentTimeLeft: computed(() => store.state.currentTimeLeft),
      gameId,
      onUpdateTime,
      onCorrectLetter,
      onIncorrectLetter,
      onQuitGame,
      showFinishGame
    };
  }
};
</script>

<template>
  <div class="HeaderTimer-container">
    <div class="header-bar">
      <HeaderTimer :game-id="gameId" @updateTime="onUpdateTime" />
    </div>
    <div class="gameplay-container">
      <div class="gameplay-panel">
        <div class="left-column">
          <PlayGrid @correct-letter="onCorrectLetter" @incorrect-letter="onIncorrectLetter" />
        </div>
        <div class="right-column">
          <div class="top-right">
            <Definitions />
          </div>
          <div class="bottom-right">
            <Hotbar @quit-game="onQuitGame" />
          </div>
        </div>
      </div>
    </div>
    <FinishGame
      v-if="showFinishGame"
      :score="score"
      :currentTimeLeft="currentTimeLeft"
    />
  </div>
</template>

<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow: 0 0 10px, 0 0 20px;

.HeaderTimer-container {
  background-color: $bg-dark;
  color: white;
  height: 100vh;
  overflow: hidden;
}

.header-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 65px;
  border-bottom: 2px solid $neon-pink;
  background-color: #111;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $neon-green;
  box-shadow: 0 0 10px $neon-pink;
}

.gameplay-container {
  margin-top: 65px;
  height: calc(100vh - 65px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-dark;
}

.gameplay-panel {
  border: 2px solid $neon-green;
  height: 600px;
  width: 1088px;
  display: flex;
  border-radius: 10px;
  background-color: #111;
  box-shadow: 0 0 20px $neon-green;

  .left-column {
    height: 100%;
    width: 680px;
    border-right: 2px solid $neon-blue;
    box-shadow: inset 0 0 10px $neon-blue;
  }

  .right-column {
    width: 408px;
    display: flex;
    flex-direction: column;

    .top-right {
      height: 55%;
      border-bottom: 2px solid $neon-pink;
      padding: 10px;
      box-shadow: inset 0 0 10px $neon-pink;
    }

    .bottom-right {
      height: 45%;
      padding: 10px;
      box-shadow: inset 0 0 10px $neon-green;
    }
  }
}
</style>
