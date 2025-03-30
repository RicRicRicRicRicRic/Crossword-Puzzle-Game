//components/CreateGame/CreateGame_Page.vue

<script>
import GameGrid from './GameGrid.vue';
import WordSearch from './WordSearch.vue';
import EditorControls from './EditorControls.vue';
import StoreWords from './StoreWords.vue';

export default {
  components: { GameGrid, WordSearch, EditorControls, StoreWords },
};
</script>

<template>
  <div class="creategame-container">
    <div class="creategame-panel">
      <div class="left-column">
        <GameGrid />
      </div>
      <div class="middle-column">
        <div class="top-half">
          <WordSearch />
        </div>
        <div class="bottom-half">
          <EditorControls />
        </div>
      </div>
      <div class="right-column">
        <StoreWords />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.creategame-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  height: 91vh;
  border-bottom: 5px solid;
}

.creategame-panel {
  display: flex;
  width: 1360px;
  height: 600px;
  border: 2px solid black;

  .left-column {
    flex: 0 0 50%; 
    height: 100%;
    border-right: 2px solid #000000;
  }

  .middle-column {
    flex: 0 0 20%; 
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ccc; 

    .top-half{
      border-bottom: 2px solid;
    }

    .top-half, .bottom-half {
      height: 50%;
      overflow: auto; 
    }
  }

  .right-column {
    flex: 0 0 30%;
    height: 100%;
    border-left: 2px solid;
  }
}
</style>
