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
            :class="{ selected: isSelected(item.word) }"
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
            :class="{ selected: isSelected(item.word) }"
            @click="selectWord(item.word)"
          >
            <strong>{{ index + 1 }}. </strong>{{ item.definition }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow: 0 0 5px, 0 0 10px;

.definitions-container {
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background-color: $bg-dark;
  color: white;
  border: 2px solid $neon-pink;
  box-shadow: 0 0 15px $neon-pink;

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid $neon-blue;
    margin: 5px;
    border-radius: 8px;
    box-shadow: 0 0 10px $neon-blue;
    overflow: hidden;

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #111;
      color: $neon-green;
      text-shadow: 0 0 10px $neon-green;
      height: 40px;
      border-bottom: 2px solid $neon-pink;
      font-weight: bold;
    }

    .definitions {
      padding: 10px;
      overflow-y: auto;
      flex: 1;
      margin: 0;
      list-style: none;
    }

    .definition-item {
      padding: 10px;
      border-bottom: 1px dashed $neon-blue;
      transition: background-color 0.2s, color 0.2s;
      cursor: pointer;
      color: white;
      text-shadow: 0 0 3px $neon-blue;

      &:hover {
        background-color: rgba(0, 255, 255, 0.1);
        box-shadow: 0 0 8px $neon-blue;
      }

      &.selected {
        background-color: $neon-green;
        color: #000;
        text-shadow: none;
        box-shadow: 0 0 10px $neon-green;
      }
    }
  }

  .across,
  .down {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
</style>
