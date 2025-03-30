//components/PlayGame/GameGrid.vue

<script>
export default {
  name: "GameGrid",
  data() {
    return {
      gridSize: Number(localStorage.getItem('gridSize')) || 15,
      placedWords: [] 
    };
  },
  computed: {
    totalCells() {
      return this.gridSize * this.gridSize;
    },
    gridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${this.gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${this.gridSize}, 1fr)`,
        width: '100%',
        height: '100%',
      };
    },
    timerMinutes() {
      const fraction = (this.gridSize - 9) / (23 - 9);
      return Math.round(5 + fraction * (20 - 5));
    },
    cellDetails() {
      const cells = Array.from({ length: this.totalCells }, () => ({ letters: [] }));
      
      this.placedWords.forEach(word => {
        for (let i = 0; i < word.word.length; i++) {
          const row = word.position.row + (word.category === 'down' ? i : 0);
          const col = word.position.col + (word.category === 'across' ? i : 0);
          if (row < this.gridSize && col < this.gridSize) {
            const cellIndex = row * this.gridSize + col;
            cells[cellIndex].letters.push(word.word[i]);
          }
        }
      });
      
      cells.forEach(cell => {
        if (cell.letters.length > 1) {
          const allSame = cell.letters.every(letter => letter === cell.letters[0]);
          cell.conflict = !allSame;
        } else {
          cell.conflict = false;
        }
      });
      
      return cells;
    }
  },
  watch: {
    gridSize(newValue, oldValue) {
      // When reducing the grid, ensure that every placed word is fully within the new grid boundaries.
      if (newValue < oldValue) {
        const cannotFit = this.placedWords.some(word => {
          // Check if the starting position is out-of-bound.
          if (word.position.row >= newValue || word.position.col >= newValue) {
            return true;
          }
          // Check if the word, based on its orientation, extends beyond the new grid size.
          if (word.category === 'across') {
            return (word.position.col + word.word.length) > newValue;
          } else if (word.category === 'down') {
            return (word.position.row + word.word.length) > newValue;
          }
          return false;
        });
        if (cannotFit) {
          alert("Cannot make grid smaller because one or more words do not fit in the new size. Please remove those words first.");
          // Revert to the old grid size.
          this.gridSize = oldValue;
          return;
        }
      }
      localStorage.setItem('gridSize', newValue);
    },
    placedWords: {
      handler(newVal) {
        sessionStorage.setItem('placedWords', JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  methods: {
    addWordToGrid(wordData) {
      const startPos = { row: 0, col: 0 };
      const wordLength = wordData.word.length;
      if (wordData.category === 'across') {
        if (startPos.col + wordLength > this.gridSize) {
          alert(`Word "${wordData.word}" is too long to fit horizontally on the grid.`);
          return false;
        }
      } else if (wordData.category === 'down') {
        if (startPos.row + wordLength > this.gridSize) {
          alert(`Word "${wordData.word}" is too long to fit vertically on the grid.`);
          return false;
        }
      }
      this.placedWords.push({
        ...wordData,
        position: startPos
      });
      return true;
    },
    moveWord(wordIndex, direction) {
      const word = this.placedWords[wordIndex];
      const newPos = { ...word.position };
      switch(direction) {
        case 'up':    newPos.row = Math.max(0, newPos.row - 1); break;
        case 'down':  newPos.row = Math.min(this.gridSize - 1, newPos.row + 1); break;
        case 'left':  newPos.col = Math.max(0, newPos.col - 1); break;
        case 'right': newPos.col = Math.min(this.gridSize - 1, newPos.col + 1); break;
      }
      if (word.category === 'across' && newPos.col + word.word.length > this.gridSize) {
        alert('Cannot move the word further in that direction.');
        return;
      } else if (word.category === 'down' && newPos.row + word.word.length > this.gridSize) {
        alert('Cannot move the word further in that direction.');
        return;
      }
      word.position = newPos;
    },
    setWordDirection(wordIndex, newDirection) {
      const word = this.placedWords[wordIndex];
      if (newDirection === 'across') {
        if (word.position.col + word.word.length > this.gridSize) {
          alert(`Word "${word.word}" does not fit horizontally from its current position.`);
          return;
        }
      } else if (newDirection === 'down') {
        if (word.position.row + word.word.length > this.gridSize) {
          alert(`Word "${word.word}" does not fit vertically from its current position.`);
          return;
        }
      }
      word.category = newDirection;
    },
    removeWordFromGrid(wordText) {
      const index = this.placedWords.findIndex(item => item.word === wordText);
      if (index !== -1) {
        this.placedWords.splice(index, 1);
      }
    }
  },
  mounted() {
    const storedPlacedWords = sessionStorage.getItem('placedWords');
    if (storedPlacedWords) {
      this.placedWords = JSON.parse(storedPlacedWords);
    }
  }
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
          v-model.number="gridSize"
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
