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

    // This flag determines whether FinishGame is displayed.
    const showFinishGame = ref(false);

    // Computed property that checks whether all the letters are correct.
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

    // Watch the gameCompleted computed property.
    // When it becomes true, the finished game modal appears.
    watch(gameCompleted, (newVal) => {
      if (newVal) {
        showFinishGame.value = true;
      }
    });

    // You can also trigger the modal manually via the quit button.
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
