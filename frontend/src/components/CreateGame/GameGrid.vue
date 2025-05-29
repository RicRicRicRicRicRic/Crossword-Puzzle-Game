//components/PlayGame/GameGrid.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const gridSize = computed(() => store.state.gridSize);
    const timerMinutes = computed(() => store.state.grid_timer);

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
        <input id="gridSizeSlider" type="range" min="9" max="20" :value="gridSize"
          @input="onGridSizeChange($event.target.value)" />
      </div>
      <label>Timer: {{ timerMinutes }} minutes</label>
    </div>
    <div class="grid" :style="gridStyle">
      <div v-for="(cell, index) in cellDetails" :key="index" class="grid-cell"
        :class="{ conflict: cell.conflict, 'black-cell': cell.letters.length === 0 }"
        :style="{ fontSize: cellFontSize }">
        <!-- Number label in the upper left corner -->
        <span v-if="cell.number" class="cell-number">{{ cell.number }}</span>
        <!-- Display the letter (if any) centered in the cell -->
        <span v-if="cell.letters.length > 0">{{ cell.letters[0] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow-green: 0 0 6px $neon-green, 0 0 12px $neon-green;
$glow-blue: 0 0 6px $neon-blue, 0 0 12px $neon-blue;
$glow-pink: 0 0 6px $neon-pink, 0 0 12px $neon-pink;
// $gradient-neon: linear-gradient(135deg, $neon-green, $neon-pink);

.gamegrid-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: $bg-dark;
  color: white;
  font-family: 'Poppins', sans-serif;
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

  label {
    margin-right: 10px;
  }

  input[type='range'] {
    width: 350px;
    appearance: none;
    -webkit-appearance: none;
    height: 6px;
    border-radius: 5px;
    background: $neon-blue;
    outline: none;
    box-shadow: $glow-blue;
    transition: background 0.3s ease;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      background: white;
      border: 2px solid $neon-blue;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: $glow-blue;
    }

    &::-moz-range-thumb {
      appearance: none; // ✅ For Firefox
      width: 16px;
      height: 16px;
      background: white;
      border: 2px solid $neon-blue;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: $glow-blue;
    }
  }
}

.grid {
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
  background: $bg-dark;
}

.grid {
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
  background: $bg-dark;
}

.grid-cell {
  position: relative;
  border: 1px solid #333;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111;
  font-weight: bold;
  transition: background-color 0.2s;
}

.grid-cell.conflict {
  background-color: #f16666;
  color: #fff;
  text-shadow: none;
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
  color: $neon-pink;
  text-shadow: $glow-pink;
}
</style>
