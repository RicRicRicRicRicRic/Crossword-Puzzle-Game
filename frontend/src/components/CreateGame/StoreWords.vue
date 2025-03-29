//components/PlayGame/StoreWords.vue

<script>
export default {
  name: "StoreWords",
  data() {
    return {
      acrossWords: [],
      downWords: [],
    };
  },
  methods: {
    addWord(wordData) {
      if (
        wordData.category === "down" &&
        this.acrossWords.find((item) => item.word === wordData.word)
      ) {
        alert(`The word "${wordData.word}" already exists in across.`);
        return;
      }

      if (wordData.category === "across") {
        if (this.acrossWords.find((item) => item.word === wordData.word)) {
          alert(`The word "${wordData.word}" already exists.`);
          return;
        }
        this.acrossWords.push(wordData);
      } else if (wordData.category === "down") {
        if (this.downWords.find((item) => item.word === wordData.word)) {
          alert(`The word "${wordData.word}" already exists.`);
          return;
        }
        this.downWords.push(wordData);
      }
    },
    removeWord(category, index) {
      if (category === "across") {
        this.acrossWords.splice(index, 1);
      } else if (category === "down") {
        this.downWords.splice(index, 1);
      }
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
            <li v-for="(item, index) in acrossWords" :key="index" class="definition-item">
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
            <li v-for="(item, index) in downWords" :key="index" class="definition-item">
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
            <li v-for="(item, index) in acrossWords" :key="index" class="word-item">
              <strong>{{ index + 1 }}. </strong>{{ item.word }}
              <button @click="removeWord('across', index)">−</button>
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
            <li v-for="(item, index) in downWords" :key="index" class="word-item">
              <strong>{{ index + 1 }}. </strong>{{ item.word }}
              <button @click="removeWord('down', index)">−</button>
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
  }
  .word-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

</style>
