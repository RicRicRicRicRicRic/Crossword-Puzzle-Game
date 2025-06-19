//components/PlayGame/WordSearch.vue

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { definition, wordSuggest } from '@/services/dictionary';

export default {
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const suggestions = ref([]);
    const definitionText = ref(null);
    const selectedWord = ref('');
    const showDropdown = ref(false);

    async function onInput() {
      if (searchQuery.value.length > 0) {
        try {
          const response = await wordSuggest.get('', { params: { query: searchQuery.value } });
          suggestions.value = response.data;
          showDropdown.value = suggestions.value.length > 0;
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          suggestions.value = [];
          showDropdown.value = false;
        }
      } else {
        suggestions.value = [];
        showDropdown.value = false;
      }
    }

    function selectWord(word) {
      searchQuery.value = word;
      selectedWord.value = word;
      showDropdown.value = false;
      getDefinition(word);
    }

    async function getDefinition(word) {
      try {
        const response = await definition.get(`${word}`);
        const results = response.data;
        if (results && results.length) {
          let firstSentence = results[0].def.split('. ')[0];
          if (!firstSentence.endsWith('.')) {
            firstSentence += '.';
          }
          definitionText.value = [firstSentence];
        } else {
          definitionText.value = ["Definition not found."];
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        definitionText.value = ["Definition not found."];
      }
    }

    function addWord(category) {
      if (!selectedWord.value) {
        alert("Please select a word first.");
        return;
      }
      store.dispatch('addWord', {
        word: selectedWord.value,
        definition: definitionText.value ? definitionText.value[0] : "Definition not found.",
        category,
      });
    }

    return {
      searchQuery,
      suggestions,
      definitionText,
      selectedWord,
      showDropdown,
      onInput,
      selectWord,
      addWord,
    };
  },
};
</script>

<template>
  <div class="wordsearch-container">
    <div class="input-box">
      <input
        type="text"
        v-model="searchQuery"
        @input="onInput"
        placeholder="Search for a word..."
      />
      <ul v-if="showDropdown" class="dropdown">
        <li
          v-for="(word, index) in suggestions"
          :key="index"
          @click="selectWord(word)"
        >
          {{ word }}
        </li>
      </ul>
    </div>
    <div v-if="definitionText" class="definition">
      <div class="selected-word">
        <h3>{{ selectedWord }}</h3>
        <span>({{ selectedWord.length }} letters)</span>
      </div>
      <div class="definition-content">
        <p v-for="(def, idx) in definitionText" :key="idx">{{ def }}</p>
      </div>
    </div>
    <div class="button-container">
      <button @click="addWord('across')">Add in Across</button>
      <button @click="addWord('down')">Add in Down</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$font-color: #fff;

.wordsearch-container {
  width: 100%;
  height: auto;
  color: $font-color;
  font-family: 'Poppins', sans-serif;

  .input-box {
    width: 98%;
    max-width: 500px;
    margin: 10px auto 10px;
    position: relative;
    display: flex;
    justify-content: center;

    input {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      background: transparent;
      border: 2px solid $neon-color;
      border-radius: 8px;
      color: $font-color;
      box-shadow: 0 0 5px $neon-color;
      outline: none;
      transition: 0.3s ease;

      &::placeholder {
        color: color.adjust($neon-color, $lightness: 20%);
      }

      &:hover,
      &:focus {
        box-shadow: 0 0 10px $neon-color;
      }
    }

    .dropdown {
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: $bg-color;
      border: 1px solid $neon-color;
      box-shadow: 0 0 10px $neon-color;
      max-height: 150px;
      overflow-y: auto;
      z-index: 10;

      li {
        padding: 10px;
        cursor: pointer;
        color: $font-color;

        &:hover {
          background: color.adjust($neon-color, $lightness: -60%);
        }
      }
    }
  }

  .definition {
    width: 87%;
    margin: 0 auto 20px;
    padding: 10px;
    border: 2px solid $neon-color;
    border-radius: 8px;
    box-shadow: 0 0 10px $neon-color;
    background-color: rgba(0, 0, 0, 0.3);
    max-height: 130px;
    display: flex;
    flex-direction: column;

    .selected-word {
     margin-bottom: -5px;
      h3 {
        margin: 0;
        text-shadow: 0 0 5px $neon-color, 0 0 10px $neon-color;
      }

      span {
        font-size: 0.9rem;
        color: color.adjust($neon-color, $lightness: 20%);
      }
    }

    .definition-content {
      margin-top: 5px;
      overflow-y: auto;
      flex: 1;

      p {
        margin-top: 5px;
        color: $font-color;
      }
    }
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 2px solid $neon-color;
      color: $neon-color;
      font-weight: 500;
      border-radius: 8px;
      text-shadow: 0 0 5px $neon-color;
      box-shadow: 0 0 5px $neon-color;
      cursor: pointer;
      transition: 0.3s;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;

      &:hover {
        background: $neon-color;
        color: $bg-color;
        box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
      }
    }
  }
}
</style>
