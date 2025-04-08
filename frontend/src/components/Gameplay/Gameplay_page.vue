//components/Gameplay/Gameplay_page.vue

<script>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
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
    const router = useRouter();
    const showQuitModal = ref(false);
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
    
    const onQuitGame = () => {
      showQuitModal.value = true;
    };

    const handlePopState = () => {
      showQuitModal.value = true;
    };

    const confirmQuit = () => {

      store.dispatch('RESET_PLAY_GAME');
      showQuitModal.value = false;
      showFinishGame.value = true;
    };

    const cancelQuit = () => {
      showQuitModal.value = false;
    };

    onMounted(() => {
      window.addEventListener('popstate', handlePopState);
      
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('popstate', handlePopState);
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
      showQuitModal,
      confirmQuit,
      cancelQuit,
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
            <Hotbar @quit-game="onQuitGame" />
          </div>
        </div>
      </div>
    </div>
    <FinishGame 
      v-if="gameFinished && !showQuitModal && !showFinishGame" 
      :score="score" 
      :currentTimeLeft="currentTimeLeft" 
    />
    <FinishGame 
      v-if="showFinishGame" 
      :score="score" 
      :currentTimeLeft="currentTimeLeft" 
    />
    <div v-if="showQuitModal" class="quit-confirmation-modal">
      <div class="confirmation-content">
        <h3>Do you really want to quit the game?</h3>
        <div class="modal-buttons">
          <button class="yes-btn" @click="confirmQuit">Yes</button>
          <button class="no-btn" @click="cancelQuit">No</button>
        </div>
      </div>
    </div>
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
.gameplay-container{
    margin-top: 65px;
    height: calc(100vh - 65px);
    display: flex;
    justify-content: center;
    align-items: center;
}
.gameplay-panel{
    border: 2px solid;
    height: 600px;
    width: 1088px;
    display: flex;

    .left-column {
        height: 100%;
        width: 680px;
        border-right: 2px solid;
    }
    .right-column{
        width: 408px;
        display: flex;
        flex-direction: column;
        .top-right{
            height: 55%;
            border-bottom: 2px solid;
        }
        .bottom-right{
            height: 45%;
        }
    }
}
.quit-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  
  .confirmation-content {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    
    h3 {
      margin-bottom: 1.5rem;
      font-size: 1.6rem;
      color: #333;
    }
    
    .modal-buttons {
      display: flex;
      justify-content: space-around;
      
      button {
        padding: 0.5rem 1.2rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
      }
      
      .yes-btn {
        background-color: #47b94a;
        color: #fff;
        &:hover {
          background-color: #3aa03a;
        }
      }
      
      .no-btn {
        background-color: #c0392b;
        color: #fff;
        &:hover {
          background-color: #a93226;
        }
      }
    }
  }
}
</style>