//components/Gameplay/Definitions.vue
<script>
import api from '@/services/api';

export default {
  data() {
    return {
      acrossWords: [],
      downWords: [],
      gme: 'Loading...',
      selectedWord: null, 
    };
  },
  computed: {
    gameId() {
      return this.$route.params.gameId; 
    },
  },
  mounted() {
    this.fetchGameDefinitions();
  },
  methods: {
    async fetchGameDefinitions() {
      try {
        const response = await api.get(`/startGame/${this.gameId}`);
        if (response.data.success) {
          const gameData = response.data.game;
          this.acrossWords = gameData.definitionsAcross;
          this.downWords = gameData.definitionsDown;
          this.gme = '';
        }
      } catch (error) {
        console.error('Error fetching game definitions:', error);
        this.gme = 'Failed to load definitions.';
      }
    },
    selectWord(word) {
      this.selectedWord = word;
    },
    isSelected(word) {
      return this.selectedWord === word;
    },
  },
};
</script>

<template>
    <div class="definitions-container">
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

            >
              <strong>{{ index + 1 }}. </strong>{{ item.definition }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  

<style lang="scss" scoped>
.definitions-container {
  height: 100%;
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

    .definitions {
      padding: 10px;
      overflow-y: auto;
      flex: 1;
      margin: 0;
      list-style: none;
    }

    .definition-item {
      padding: 5px;
      border-bottom: 1px dashed #ccc;
      transition: background-color 0.2s;
      cursor: pointer;

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

}
</style>