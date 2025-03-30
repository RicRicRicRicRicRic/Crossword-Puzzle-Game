//components/PlayGame/GameGrid.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const gridSize = computed(() => store.state.gridSize);
    const timerMinutes = computed(() => {
      const fraction = (store.state.gridSize - 9) / (23 - 9);
      return Math.round(5 + fraction * (20 - 5));
    });
    const cellDetails = computed(() => {
      const cells = Array.from({ length: store.state.gridSize * store.state.gridSize }, () => ({
        letters: []
      }));
      store.state.placedWords.forEach(word => {
        for (let i = 0; i < word.word.length; i++) {
          const row = word.position.row + (word.category === 'down' ? i : 0);
          const col = word.position.col + (word.category === 'across' ? i : 0);
          if (row < store.state.gridSize && col < store.state.gridSize) {
            const cellIndex = row * store.state.gridSize + col;
            cells[cellIndex].letters.push(word.word[i]);
          }
        }
      });
      cells.forEach(cell => {
        cell.conflict = cell.letters.length > 1 && !cell.letters.every(letter => letter === cell.letters[0]);
      });
      return cells;
    });

    const gridStyle = computed(() => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${store.state.gridSize}, 1fr)`,
      gridTemplateRows: `repeat(${store.state.gridSize}, 1fr)`,
      width: '100%',
      height: '100%',
    }));

    function onGridSizeChange(newSize) {
      store.dispatch('setGridSize', Number(newSize));
    }

    return { gridSize, timerMinutes, cellDetails, gridStyle, onGridSizeChange };
  },
};
</script>


<template>
  <div class="gamegrid-container">
    <div class="controls-container">
      <div class="slider-container">
        <label for="gridSizeSlider">Grid Size: {{ gridSize }} x {{ gridSize }}</label>
        <input
          id="gridSizeSlider"
          type="range"
          min="9"
          max="23"
          :value="gridSize"
          @input="onGridSizeChange($event.target.value)"
        />
      </div>
      <label>Timer: {{ timerMinutes }} minutes</label>
    </div>
    <div class="grid" :style="gridStyle">
      <div
        v-for="(cell, index) in cellDetails"
        :key="index"
        class="grid-cell"
        :class="{ conflict: cell.conflict }"
      >
        {{ cell.letters[0] || '' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gamegrid-container {
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 100%;
}

.controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  gap: 2.5rem;
}

.slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
  input[type="range"] {
    width: 350px;
  }
}

.grid {
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
}

.grid-cell {
  border: 1px solid #ddd;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  background-color: #fff;
}

/* Conflict: when overlapping letters differ */
.grid-cell.conflict {
  background-color: #ffcccc;
}
</style>
