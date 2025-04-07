//components/Gameplay/PlayGrid.vue
<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

export default {
  name: 'PlayGrid',
  setup() {
    const route = useRoute();
    const gameId = route.params.gameId;
    const gameData = ref(null);
    const gridAnswers = ref([]);
    const inputRefs = ref([]);

    async function fetchGameData() {
      try {
        const response = await api.get(`/startGame/${gameId}`);
        if (response.data.success) {
          gameData.value = response.data.game;
          initializeGridAnswers();
          initializeInputRefs();
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    }

    function initializeGridAnswers() {
      const size = gameData.value.gridSize;
      gridAnswers.value = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
          answer: '',
          status: 'neutral',
        }))
      );
    }

    function initializeInputRefs() {
      const size = gameData.value.gridSize;
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

    function solutionLetter(row, col) {
      return gameData.value ? gameData.value.gridLetters[row][col] : null;
    }

    function cellNumber(row, col) {
      return gameData.value ? gameData.value.gridCellNumbers[row][col] : null;
    }

    function handleInput(row, col) {
      const userLetter = gridAnswers.value[row][col].answer.trim();
      const expected = solutionLetter(row, col);
      if (!userLetter) {
        gridAnswers.value[row][col].status = 'neutral';
      } else if (userLetter.toLowerCase() === expected.toLowerCase()) {
        gridAnswers.value[row][col].status = 'correct';
        autoFocusNext(row, col);
      } else {
        gridAnswers.value[row][col].status = 'incorrect';
      }
    }

    function autoFocusNext(row, col) {
      const size = gameData.value.gridSize;

      if (col + 1 < size && solutionLetter(row, col + 1)) {
        if (gridAnswers.value[row][col + 1].status !== 'correct') {
          const targetInput = inputRefs.value[row][col + 1];
          if (targetInput) {
            targetInput.focus();
            return;
          }
        }
      }
      if (row + 1 < size && solutionLetter(row + 1, col)) {
        if (gridAnswers.value[row + 1][col].status !== 'correct') {
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
      let newRow = row;
      let newCol = col;

      if (key === 'ArrowUp') newRow = row - 1;
      else if (key === 'ArrowDown') newRow = row + 1;
      else if (key === 'ArrowLeft') newCol = col - 1;
      else if (key === 'ArrowRight') newCol = col + 1;
      else return;

      event.preventDefault();

      if (
        newRow < 0 ||
        newRow >= gameData.value.gridSize ||
        newCol < 0 ||
        newCol >= gameData.value.gridSize
      )
        return;

      if (solutionLetter(newRow, newCol)) {
        const targetInput = inputRefs.value[newRow][newCol];
        if (targetInput) targetInput.focus();
      }
    }

    const gridSize = computed(() => (gameData.value ? gameData.value.gridSize : 0));

    const gridStyle = computed(() => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
      gridTemplateRows: `repeat(${gridSize.value}, 1fr)`,
      width: '100%',
      height: '100%',
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
      if (!solutionLetter(row, col)) {
        classes.push('black-cell');
      } else {
        classes.push('white-cell');
        const status = gridAnswers.value[row][col].status;
        if (status === 'correct') classes.push('correct');
        if (status === 'incorrect') classes.push('incorrect');
      }
      return classes;
    }

    onMounted(fetchGameData);

    return {
      gridStyle,
      gridSize,
      cellFontSize,
      gridAnswers,
      solutionLetter,
      cellNumber,
      handleInput,
      handleKeydown,
      cellClasses,
      setInputRef,
    };
  },
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
.playgrid-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.grid {
  width: 100%;
  height: 100%;
  display: grid;
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
}

.black-cell {
  background-color: #292929;
}

.white-cell {
  background-color: #fff;
}

.correct {
  background-color: #a1e887 !important;
}

.incorrect {
  background-color: #f16666 !important;
}

.white-cell input {
  width: 100%;
  height: 100%;
  text-align: center;
  border: none;
  outline: none;
  background: transparent;
  font-weight: bold;
}

.cell-number {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.7em;
  padding: 0 2px;
}
</style>
