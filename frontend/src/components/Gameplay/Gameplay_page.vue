//components/Gameplay/Gameplay_page.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import HeaderTimer from './HeaderTimer.vue';
import PlayGrid from './PlayGrid.vue';
import Definitions from './Definitions.vue';
import Hotbar from './Hotbar.vue';

export default {
  name: 'Gameplay_page',
  components: {
    HeaderTimer, Definitions, PlayGrid, Hotbar
  },
  setup() {
    const store = useStore();
    
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
      gameId: computed(() => store.state.gameData?.id),
      onUpdateTime,
      onCorrectLetter,
      onIncorrectLetter
    };
  }
};
</script>

<template>
  <div class="HeaderTimer-container">
    <div class="header-bar">
      <!-- HeaderTimer emits current time each update -->
      <HeaderTimer @updateTime="onUpdateTime" />
    </div>
    <div class="gameplay-container">
      <div class="gameplay-panel">
        <div class="left-column">
          <!-- Listen for both correct-letter and incorrect-letter events -->
          <PlayGrid @correct-letter="onCorrectLetter" @incorrect-letter="onIncorrectLetter" />
        </div>
        <div class="right-column">
          <div class="top-right">
            <Definitions/>
          </div>
          <div class="bottom-right">
            <!-- Pass the score to Hotbar -->
            <Hotbar :score="score" />
          </div>
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
</style>