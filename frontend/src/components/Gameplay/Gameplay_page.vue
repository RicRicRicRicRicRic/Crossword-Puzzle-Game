//components/Gameplay/Gameplay_page.vue

<!-- components/Gameplay/Gameplay_page.vue -->
<script>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStore } from 'vuex';
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
    const showFinishGame = ref(false);

    function onUpdateTime(newTimeLeft) {
      store.commit('UPDATE_TIME_LEFT', newTimeLeft);
    }
    
    function onCorrectLetter() {
      store.commit('INCREMENT_SCORE', store.state.currentTimeLeft);
    }
    
    function onIncorrectLetter() {
      store.commit('DECREMENT_SCORE', store.state.currentTimeLeft);
    }
    
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
    
    const gameFinished = computed(() => {
      return gameCompleted.value || store.state.currentTimeLeft === 0;
    });
    
    // Called when the Hotbar emits a quit-game event.
    const onQuitGame = () => {
      showFinishGame.value = true;
    };

    onMounted(() => {
      // Optional: any additional mounting behavior
    });
    
    onBeforeUnmount(() => {
      // Optional: cleanup code
    });
    
    return {
      score: computed(() => store.state.score),
      currentTimeLeft: computed(() => store.state.currentTimeLeft),
      gameId: computed(() => store.state.gameData?.id),
      onUpdateTime,
      onCorrectLetter,
      onIncorrectLetter,
      gameFinished,
      onQuitGame,
      showFinishGame
    };
  }
};
</script>

<template>
  <div class="HeaderTimer-container">
    <div class="header-bar">
      <HeaderTimer @updateTime="onUpdateTime" />
    </div>
    <div class="gameplay-container">
      <div class="gameplay-panel">
        <div class="left-column">
          <PlayGrid @correct-letter="onCorrectLetter" @incorrect-letter="onIncorrectLetter" />
        </div>
        <div class="right-column">
          <div class="top-right">
            <Definitions/>
          </div>
          <div class="bottom-right">
            <!-- Listen for the quit-game event from Hotbar -->
            <Hotbar @quit-game="onQuitGame" />
          </div>
        </div>
      </div>
    </div>
    <!-- Render FinishGame if the game naturally finishes or if the user confirms quitting -->
    <FinishGame 
      v-if="gameFinished || showFinishGame" 
      :score="score" 
      :currentTimeLeft="currentTimeLeft" 
    />
  </div>
</template>

<style lang="scss" scoped>
.header-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 65px;
  border-bottom: 2px solid;
  background-color: white;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gameplay-container {
  margin-top: 65px;
  height: calc(100vh - 65px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.gameplay-panel {
  border: 2px solid;
  height: 600px;
  width: 1088px;
  display: flex;

  .left-column {
    height: 100%;
    width: 680px;
    border-right: 2px solid;
  }
  .right-column {
    width: 408px;
    display: flex;
    flex-direction: column;
    .top-right {
      height: 55%;
      border-bottom: 2px solid;
    }
    .bottom-right {
      height: 45%;
    }
  }
}
</style>
