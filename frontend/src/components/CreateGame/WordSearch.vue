//components/PlayGame/WordSearch.vue

<script>
import { definition, wordSuggest } from '@/services/dictionary';

export default {
  name: "WordSearch",
  data() {
    return {
      searchQuery: '',
      suggestions: [],
      definition: null,
      selectedWord: '',
      showDropdown: false,
    };
  },
  methods: {
    async onInput() {
      if (this.searchQuery.length > 0) {
        try {
          const response = await wordSuggest.get('', {
            params: { query: this.searchQuery }
          });
          this.suggestions = response.data;
          this.showDropdown = this.suggestions.length > 0;
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          this.suggestions = [];
          this.showDropdown = false;
        }
      } else {
        this.suggestions = [];
        this.showDropdown = false;
      }
    },
    selectWord(word) {
      this.searchQuery = word;
      this.selectedWord = word;
      this.showDropdown = false;
      this.getDefinition(word);
    },
    async getDefinition(word) {
      try {
        const response = await definition.get(`${word}`);
        const results = response.data;
        
        if (results && results.length) {
          let firstSentence = results[0].def.split('. ')[0];
          if (!firstSentence.endsWith('.')) {
            firstSentence += '.';
          }
          this.definition = [firstSentence];
        } else {
          this.definition = ["Definition not found."];
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        this.definition = ["Definition not found."];
      }
    }
  }
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
    <div v-if="definition" class="definition">
      <h3>{{ selectedWord }}</h3>
      <p v-for="(def, idx) in definition" :key="idx">{{ def }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wordsearch-container {
  .input-box {
    position: relative;
    input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      box-sizing: border-box;
    }
    .dropdown {
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #ccc;
      max-height: 150px;
      overflow-y: auto;
      li {
        padding: 10px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
  .definition {
    margin-top: 20px;
    h3 {
      margin-bottom: 10px;
    }
  }
}
</style>
