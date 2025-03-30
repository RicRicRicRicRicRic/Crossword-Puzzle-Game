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
.wordsearch-container {
  height: 100%;
  overflow: hidden;
  
  .input-box {
    width: 90%;
    margin: 10px auto 20px; 
    position: relative;
    border-bottom: 2px solid;
    
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
    width: 90%;
    margin: 0 auto 20px; 
    padding: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    height: 50%;
    display: flex;
    flex-direction: column;
    
    h3 {
      margin: 0;
    }
    
    .definition-content {
      margin-top: 5px;
      overflow-y: auto;
      flex: 1;
      
      p {
        margin-top: 5px;
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
      border: 1px solid #ccc;
      background-color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
