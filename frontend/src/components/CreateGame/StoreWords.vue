//components/PlayGame/StoreWords.vue

<script>
export default {
  name: "StoreWords",
  data() {
    return {
      acrossWords: [],
      downWords: [],
      selectedWord: null,
    };
  },
  methods: {
    wordExists(word) {
      const existsInAcross = this.acrossWords.some(item => item.word === word);
      const existsInDown = this.downWords.some(item => item.word === word);
      return existsInAcross || existsInDown;
    },
    addWord(wordData) {
      if (wordData.category === "across") {
        this.acrossWords.push(wordData);
      } else if (wordData.category === "down") {
        this.downWords.push(wordData);
      }
    },
    removeWord(category, index) {
      let removedWord = null;
      if (category === "across") {
        removedWord = this.acrossWords.splice(index, 1)[0];
      } else if (category === "down") {
        removedWord = this.downWords.splice(index, 1)[0];
      }
      if (removedWord) {
        if (this.selectedWord === removedWord.word) {
          this.selectedWord = null;
        }
        this.$emit("word-removed", { word: removedWord.word, category });
      }
    },
    updateWordDirection(wordText, newDirection) {
      let indexAcross = this.acrossWords.findIndex(item => item.word === wordText);
      let indexDown = this.downWords.findIndex(item => item.word === wordText);
      let wordData = null;
      if (indexAcross !== -1) {
        wordData = this.acrossWords.splice(indexAcross, 1)[0];
      } else if (indexDown !== -1) {
        wordData = this.downWords.splice(indexDown, 1)[0];
      }
      if (wordData) {
        wordData.category = newDirection;
        if (newDirection === "across") {
          this.acrossWords.push(wordData);
        } else {
          this.downWords.push(wordData);
        }
      }
    },

    selectWord(word, category) {
      this.selectedWord = word;
      this.$emit("word-selected", { word, category });
    }
  },
  mounted() {
    const storedAcross = sessionStorage.getItem("acrossWords");
    const storedDown = sessionStorage.getItem("downWords");
    if (storedAcross) {
      this.acrossWords = JSON.parse(storedAcross);
    }
    if (storedDown) {
      this.downWords = JSON.parse(storedDown);
    }
  },
  watch: {
    acrossWords: {
      handler(newVal) {
        sessionStorage.setItem("acrossWords", JSON.stringify(newVal));
      },
      deep: true,
    },
    downWords: {
      handler(newVal) {
        sessionStorage.setItem("downWords", JSON.stringify(newVal));
      },
      deep: true,
    },
  },
};
</script>

<template>
  <div class="store-words-container">
    <!-- Top Section: Definitions -->
    <div class="section top-section">
      <!-- Across Definitions -->
      <div class="column">
        <div class="across">
          <div class="header">
            <h4>Across Definition</h4>
          </div>
          <ul class="definitions">
            <li
              v-for="(item, index) in acrossWords"
              :key="index"
              class="definition-item"
              @click="selectWord(item.word, 'across')"
              :class="{ selected: selectedWord === item.word }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.definition }}
            </li>
          </ul>
        </div>
      </div>
      <!-- Down Definitions -->
      <div class="column">
        <div class="down">
          <div class="header">
            <h4>Down Definition</h4>
          </div>
          <ul class="definitions">
            <li
              v-for="(item, index) in downWords"
              :key="index"
              class="definition-item"
              @click="selectWord(item.word, 'down')"
              :class="{ selected: selectedWord === item.word }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.definition }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Words -->
    <div class="section bottom-section">
      <!-- Across Words -->
      <div class="column">
        <div class="across">
          <div class="header">
            <h4>Across Words</h4>
          </div>
          <ul class="words">
            <li
              v-for="(item, index) in acrossWords"
              :key="index"
              class="word-item"
              @click="selectWord(item.word, 'across')"
              :class="{ selected: selectedWord === item.word }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.word }}
              <button @click.stop="removeWord('across', index)">−</button>
            </li>
          </ul>
        </div>
      </div>
      <!-- Down Words -->
      <div class="column">
        <div class="down">
          <div class="header">
            <h4>Down Words</h4>
          </div>
          <ul class="words">
            <li
              v-for="(item, index) in downWords"
              :key="index"
              class="word-item"
              @click="selectWord(item.word, 'down')"
              :class="{ selected: selectedWord === item.word }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.word }}
              <button @click.stop="removeWord('down', index)">−</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.store-words-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  
  .column {
    flex: 1;
    border: 1px solid #ddd;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 0; 

    button {
      color: #f0f0f0;
      text-align: center;
      height: 25px;
      border: 1px solid #ccc;
      background-color: #af2c2c;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 20px;

      &:hover {
        background-color: #ff0000;
      }
    }
  }
  
  .across,
  .down {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 40px;
    border-bottom: 2px solid;
    flex-shrink: 0;
  }
  
  .definitions,
  .words {
    padding: 10px;
    overflow-y: auto;
    flex: 1;
    margin: 0;
    list-style: none;
  }
  
  .definition-item,
  .word-item {
    padding: 5px;
    border-bottom: 1px dashed #ccc;
    transition: background-color 0.2s;
    cursor: pointer;
    
    &:hover {
      background-color: #d3d3d3; 
    }
  }
  
  .word-item {
    overflow-wrap: break-word; /* or word-wrap: break-word; */
    word-break: break-all;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .selected {
    background-color: #90ee90; 
  }
  

  .selected:hover {
    background-color: #006400;
  }
}
</style>
