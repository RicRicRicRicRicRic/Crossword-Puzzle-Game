//components/PlayGame/GameGrid.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const gridSize = computed(() => store.state.gridSize);
    const timerMinutes = computed(() => {
      const fraction = (store.state.gridSize - 9) / (20 - 9);
      return Math.round(5 + fraction * (20 - 5));
    });

    const cellDetails = computed(() => {
      const cells = Array.from({ length: store.state.gridSize * store.state.gridSize }, () => ({
        letters: [],
        number: null,
      }));
      store.state.placedWords.forEach(word => {
        const startRow = word.position.row;
        const startCol = word.position.col;
        const startIndex = startRow * store.state.gridSize + startCol;
        for (let i = 0; i < word.word.length; i++) {
          const row = word.position.row + (word.category === 'down' ? i : 0);
          const col = word.position.col + (word.category === 'across' ? i : 0);
          if (row < store.state.gridSize && col < store.state.gridSize) {
            const cellIndex = row * store.state.gridSize + col;
            cells[cellIndex].letters.push(word.word[i]);
          }
        }
        let numberLabel = '';
        if (word.category === 'across') {
          const indexInAcross = store.state.acrossWords.findIndex(item => item.word === word.word);
          if (indexInAcross >= 0) {
            numberLabel = 'a' + (indexInAcross + 1);
          }
        } else if (word.category === 'down') {
          const indexInDown = store.state.downWords.findIndex(item => item.word === word.word);
          if (indexInDown >= 0) {
            numberLabel = 'd' + (indexInDown + 1);
          }
        }
        if (cells[startIndex]) {
          if (cells[startIndex].number) {
            if (word.word[0].toLowerCase() === cells[startIndex].letters[0].toLowerCase()) {
              cells[startIndex].number += ',' + numberLabel;
            }
          } else {
            cells[startIndex].number = numberLabel;
          }
        }
      });
      cells.forEach(cell => {
        cell.conflict =
          cell.letters.length > 1 && !cell.letters.every(letter => letter === cell.letters[0]);
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

    const cellFontSize = computed(() => {
      const fraction = (store.state.gridSize - 9) / (20 - 9);
      const maxFontSize = 24; 
      const minFontSize = 14; 
      const fontSize = minFontSize + (maxFontSize - minFontSize) * (1 - fraction);
      return fontSize + 'px';
    });

    function onGridSizeChange(newSize) {
      store.dispatch('setGridSize', Number(newSize));
    }

    return { gridSize, timerMinutes, cellDetails, gridStyle, onGridSizeChange, cellFontSize };
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
          max="20"
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
        :class="{ conflict: cell.conflict, 'black-cell': cell.letters.length === 0 }"
        :style="{ fontSize: cellFontSize }"
      >
        <!-- Number label in the upper left corner -->
        <span v-if="cell.number" class="cell-number">{{ cell.number }}</span>
        <!-- Display the letter (if any) centered in the cell -->
        <span v-if="cell.letters.length > 0">{{ cell.letters[0] }}</span>
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
  position: relative; /* Needed for absolute positioning of the number */
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  background-color: #fff;
}

.grid-cell.conflict {
  background-color: #f16666;
}

.black-cell {
  background-color: #292929;
}

.cell-number {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.7em;
  padding: 0 2px;
}
</style>
