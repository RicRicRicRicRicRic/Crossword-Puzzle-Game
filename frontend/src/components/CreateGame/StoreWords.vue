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
            <li v-for="(item, index) in acrossWords" :key="index" class="definition-item" @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }">
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
            <li v-for="(item, index) in downWords" :key="index" class="definition-item" @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }">
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
            <li v-for="(item, index) in acrossWords" :key="index" class="word-item" @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }">
              <strong>{{ index + 1 }}.</strong>
              <span>{{ item.word }}</span>
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
            <li v-for="(item, index) in downWords" :key="index" class="word-item" @click="selectWord(item.word)"
              :class="{ selected: isSelected(item.word) }">
              <strong>{{ index + 1 }}.</strong>
              <span>{{ item.word }}</span>
              <button @click.stop="remove('down', index)">−</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$text-color: #ffffff;

.store-words-container {
  width: 88%;
  height: 96.5%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: $bg-color;
  color: $text-color;
  font-family: 'Poppins', sans-serif;
}

.section {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-height: 0; // ensures children can flex properly
}

.column {
  flex: 1;
  border: 1px solid color.adjust($neon-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 10px;
  background-color: color.adjust($bg-color, $lightness: 5%);

  button {
    color: $text-color;
    background-color: transparent;
    border: 2px solid $neon-color;
    border-radius: 4px;
    font-size: 20px;
    height: 25px;
    width: 30px;
    cursor: pointer;
    box-shadow: 0 0 5px $neon-color;
    transition: 0.3s;

    &:hover {
      background-color: $neon-color;
      color: $bg-color;
      box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
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
  height: 40px;
  border-bottom: 2px solid $neon-color;
  color: $neon-color;
  text-shadow: 0 0 5px $neon-color;
  font-weight: bold;
  font-size: 16px;
}

.definitions,
.words {
  padding: 8px 10px;
  overflow: auto;
  flex: 1;
  margin: 0;
  list-style: none;
  min-height: 0;
}

.definition-item,
.word-item {
  font-size: 14px; // smaller size to reduce wrapping
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 6px 10px;
  border-bottom: 1px dashed color.adjust($neon-color, $lightness: -20%);
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  border-radius: 4px;

  &:hover {
    background-color: color.adjust($neon-color, $lightness: -40%, $alpha: -0.8);
    box-shadow: 0 0 5px $neon-color;
  }
}

.word-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding-right: 5px;

  strong {
    white-space: nowrap;
  }

  span {
    overflow-wrap: break-word;
    word-break: break-word;
    text-align: left;
  }

  button {
    flex-shrink: 0;
    margin-left: 8px;
  }
}

.selected {
  background-color: color.adjust($neon-color, $lightness: -50%);
  box-shadow: 0 0 10px $neon-color;
}

.selected:hover {
  background-color: $neon-color;
  color: $bg-color;
}
</style>
