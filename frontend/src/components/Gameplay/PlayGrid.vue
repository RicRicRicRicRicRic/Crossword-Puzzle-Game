//components/Gameplay/PlayGrid.vue

<script>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'PlayGrid',
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    const gameId = route.params.gameId;
    const inputRefs = ref([]);

    function initializeInputRefs() {
      const size = store.getters.gridSize;
      inputRefs.value = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
      );
    }

    function setInputRef(el, row, col) {
      if (el) {
        if (!inputRefs.value[row]) {
          inputRefs.value[row] = [];
        }
        inputRefs.value[row][col] = el;
      }
    }

    async function handleInput(row, col) {
      const value = store.state.gridAnswers[row][col].answer;
      // Await the action to ensure the result is returned correctly.
      const result = await store.dispatch('handleInput', { row, col, value });
      
      if (result === 'correct') {
        emit('correct-letter');
        autoFocusNext(row, col);
      } else if (result === 'incorrect') {
        emit('incorrect-letter');
      }
    }

    function autoFocusNext(row, col) {
      const size = store.getters.gridSize;
      if (col + 1 < size && store.getters.solutionLetter(row, col + 1)) {
        if (store.state.gridAnswers[row][col + 1].status !== 'correct') {
          const targetInput = inputRefs.value[row][col + 1];
          if (targetInput) {
            targetInput.focus();
            return;
          }
        }
      }
      if (row + 1 < size && store.getters.solutionLetter(row + 1, col)) {
        if (store.state.gridAnswers[row + 1][col].status !== 'correct') {
          const targetInput = inputRefs.value[row + 1][col];
          if (targetInput) {
            targetInput.focus();
            return;
          }
        }
      }
    }

    function handleKeydown(event, row, col) {
      const key = event.key;
      let dr = 0, dc = 0;
      if (key === 'ArrowUp') {
        dr = -1;
      } else if (key === 'ArrowDown') {
        dr = 1;
      } else if (key === 'ArrowLeft') {
        dc = -1;
      } else if (key === 'ArrowRight') {
        dc = 1;
      } else {
        return;
      }
      event.preventDefault();

      function findNextWhiteCell(currentRow, currentCol, dr, dc) {
        let newRow = currentRow + dr;
        let newCol = currentCol + dc;
        while (
          newRow >= 0 &&
          newRow < store.getters.gridSize &&
          newCol >= 0 &&
          newCol < store.getters.gridSize
        ) {
          if (store.getters.solutionLetter(newRow, newCol)) {
            return { row: newRow, col: newCol };
          }
          newRow += dr;
          newCol += dc;
        }
        return null;
      }

      const nextCell = findNextWhiteCell(row, col, dr, dc);
      if (nextCell) {
        const targetInput = inputRefs.value[nextCell.row][nextCell.col];
        if (targetInput) {
          targetInput.focus();
        }
      }
    }

    const gridSize = computed(() => store.getters.gridSize);
    const gridStyle = computed(() => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
      gridTemplateRows: `repeat(${gridSize.value}, 1fr)`,
      width: '100%',
      height: '100%'
    }));
    const cellFontSize = computed(() => {
      const size = gridSize.value;
      if (!size) return '16px';
      const fraction = (size - 9) / (20 - 9);
      const maxFontSize = 24;
      const minFontSize = 14;
      const fontSize = minFontSize + (maxFontSize - minFontSize) * (1 - fraction);
      return fontSize + 'px';
    });
    function cellClasses(row, col) {
      const classes = [];
      if (!store.getters.solutionLetter(row, col)) {
        classes.push('black-cell');
      } else {
        classes.push('white-cell');
        const status = store.state.gridAnswers[row][col].status;
        if (status === 'correct') classes.push('correct');
        if (status === 'incorrect') classes.push('incorrect');
      }
      return classes;
    }

    onMounted(async () => {
      // Only fetch new game data if no gameData exists.
      if (!store.state.gameData) {
        await store.dispatch('fetchGameData', gameId);
      }
      initializeInputRefs();
    });

    return {
      gridStyle,
      gridSize,
      cellFontSize,
      gridAnswers: computed(() => store.state.gridAnswers),
      solutionLetter: (row, col) => store.getters.solutionLetter(row, col),
      cellNumber: (row, col) => store.getters.cellNumber(row, col),
      handleInput,
      handleKeydown,
      cellClasses,
      setInputRef
    };
  }
};
</script>

<template>
  <div class="playgrid-container">
    <div class="grid" :style="gridStyle">
      <div v-for="(row, rowIndex) in gridSize" :key="rowIndex" class="grid-row">
        <div
          v-for="(col, colIndex) in gridSize"
          :key="colIndex"
          class="grid-cell"
          :class="cellClasses(rowIndex, colIndex)"
        >
          <span v-if="cellNumber(rowIndex, colIndex)" class="cell-number">
            {{ cellNumber(rowIndex, colIndex) }}
          </span>
          <template v-if="solutionLetter(rowIndex, colIndex)">
            <input
              type="text"
              maxlength="1"
              v-model="gridAnswers[rowIndex][colIndex].answer"
              @input="handleInput(rowIndex, colIndex)"
              @keydown="handleKeydown($event, rowIndex, colIndex)"
              :style="{ fontSize: cellFontSize }"
              :ref="el => setInputRef(el, rowIndex, colIndex)"
              :readonly="gridAnswers[rowIndex][colIndex].status === 'correct'"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow: 0 0 10px, 0 0 20px;

.playgrid-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: $bg-dark;
  color: white;
}

.grid {
  width: 100%;
  height: 100%;
  display: grid;
  border: 2px solid $neon-green;
  box-shadow: 0 0 10px $neon-green;
}

.grid-row {
  display: contents;
}

.grid-cell {
  position: relative;
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;

  &.black-cell {
    background-color: #292929;
  }

  &.white-cell {
    background-color: #fff;
  }

  &.correct {
    background-color: #a1e887 !important;
    box-shadow: $glow $neon-green;
  }

  &.incorrect {
    background-color: #f16666 !important;
    box-shadow: $glow $neon-pink;
  }

  &:hover {
    box-shadow: $glow $neon-blue;
  }
}

.white-cell input {
  width: 100%;
  height: 100%;
  text-align: center;
  border: none;
  outline: none;
  background: transparent;
  font-weight: bold;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 0 10px $neon-blue;
  transition: box-shadow 0.2s ease;

  &:focus {
    box-shadow: 0 0 15px $neon-blue;
  }
}

.cell-number {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.7em;
  padding: 0 2px;
  color: $neon-green;
  text-shadow: 0 0 5px $neon-green;
}
</style>
