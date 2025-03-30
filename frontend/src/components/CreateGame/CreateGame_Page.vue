//components/CreateGame/CreateGame_Page.vue
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
  data() {
    return {
      selectedWordIndex: null,
    };
  },
  methods: {
    handleWordAdded(wordData) {
      if (this.$refs.storeWords.wordExists(wordData.word)) {
        alert(`The word "${wordData.word}" already exists in the stored words.`);
        return;
      }
      const gridSize = this.$refs.gameGrid.gridSize;
      if (wordData.word.length > gridSize) {
        alert(`The word "${wordData.word}" is too long for the ${gridSize} x ${gridSize} grid.`);
        return;
      }
      const added = this.$refs.gameGrid.addWordToGrid(wordData);
      if (added) {
        this.$refs.storeWords.addWord(wordData);
      }
    },
    moveSelectedWord(direction) {
      if (
        this.selectedWordIndex !== null &&
        this.$refs.gameGrid.placedWords[this.selectedWordIndex]
      ) {
        this.$refs.gameGrid.moveWord(this.selectedWordIndex, direction);
      } else {
        this.selectedWordIndex = null;
      }
    },
    setSelectedWordDirection(direction) {
      if (
        this.selectedWordIndex !== null &&
        this.$refs.gameGrid.placedWords[this.selectedWordIndex]
      ) {
        this.$refs.gameGrid.setWordDirection(this.selectedWordIndex, direction);
        const wordText = this.$refs.gameGrid.placedWords[this.selectedWordIndex].word;
        this.$refs.storeWords.updateWordDirection(wordText, direction);
      } else {
        this.selectedWordIndex = null;
      }
    },
    handleWordRemoved({ word, category }) {
      this.$refs.gameGrid.removeWordFromGrid(word);
      if (
        this.selectedWordIndex !== null &&
        this.$refs.gameGrid.placedWords[this.selectedWordIndex]?.word === word
      ) {
        this.selectedWordIndex = null;
      }
    },
    handleWordSelected({ word }) {
      const index = this.$refs.gameGrid.placedWords.findIndex(
        item => item.word === word
      );
      if (index !== -1) {
        this.selectedWordIndex = index;
      }
    }
  }
};
</script>

<template>
  <div class="creategame-container">
    <div class="creategame-panel">
      <div class="left-column">
        <KeepAlive>
          <GameGrid ref="gameGrid" />
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
            <EditorControls 
              @move-word="moveSelectedWord" 
              @set-direction="setSelectedWordDirection" />
          </keep-alive>
        </div>
      </div>
      <div class="right-column">
        <KeepAlive>
          <StoreWords 
            ref="storeWords" 
            @word-removed="handleWordRemoved"
            @word-selected="handleWordSelected" />
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
