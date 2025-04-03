//components/PlayGame/StoreWords.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const acrossWords = computed(() => store.state.acrossWords);
    const downWords = computed(() => store.state.downWords);

    function remove(category, index) {
      const word =
        category === 'across'
          ? store.state.acrossWords[index].word
          : store.state.downWords[index].word;
      store.dispatch('removeWord', word);
    }

    function selectWord(word) {
      store.dispatch('selectWord', word);
    }

    function isSelected(word) {
      const selected =
        store.state.placedWords[store.state.selectedWordIndex]?.word || '';
      return selected === word;
    }

    return { acrossWords, downWords, remove, selectWord, isSelected };
  },
};
</script>

<template>
  <div class="store-words-container">
    <!-- Top Section: Definitions -->
    <div class="section top-section">
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
              @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.definition }}
            </li>
          </ul>
        </div>
      </div>
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
              @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.definition }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Bottom Section: Words -->
    <div class="section bottom-section">
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
              @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.word }}
              <button @click.stop="remove('across', index)">−</button>
            </li>
          </ul>
        </div>
      </div>
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
              @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }"
            >
              <strong>{{ index + 1 }}. </strong>{{ item.word }}
              <button @click.stop="remove('down', index)">−</button>
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
