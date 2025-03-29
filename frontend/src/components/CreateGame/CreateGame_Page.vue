//components/CreateGame/CreateGame_Page.vue

<!-- components/CreateGame/CreateGame_Page.vue -->
<script>
import WordSearch from './WordSearch.vue';
import EditorControls from './EditorControls.vue';
import StoreWords from './StoreWords.vue';
import GameGrid from './GameGrid.vue';
  
export default {
  components: {
    WordSearch,
    EditorControls,
    StoreWords,
    GameGrid,
  },
  methods: {
    handleWordAdded(wordData) {
      // Pass the wordData to StoreWords component.
      this.$refs.storeWords.addWord(wordData);
    }
  }
};
</script>

<template>
  <div class="creategame-container">
    <div class="creategame-panel">
      <div class="left-column">
        <KeepAlive>
          <GameGrid />
        </KeepAlive>
      </div>

      <div class="middle-column">
        <div class="top-half">
          <keep-alive>
            <WordSearch @word-added="handleWordAdded" />
          </keep-alive>
        </div>
        <div class="bottom-half">
          <keep-alive>
            <EditorControls />
          </keep-alive>
        </div>
      </div>

      <div class="right-column">
        <KeepAlive>
          <StoreWords ref="storeWords" />
        </KeepAlive>
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
