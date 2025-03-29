//components/PlayGame/GameGrid.vue

<script>
export default {
  name: "GameGrid",
  data() {
    return {
      gridSize: Number(localStorage.getItem('gridSize')) || 15,
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
  },
  watch: {
    gridSize(newValue) {
      localStorage.setItem('gridSize', newValue);
    },
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
          v-model.number="gridSize"
        />
      </div>
        <label>Timer: {{ timerMinutes }} minutes</label>
    </div>

    <div class="grid" :style="gridStyle">
      <div
        v-for="n in totalCells"
        :key="n"
        class="grid-cell"
      ></div>
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
}

.grid-cell {
  border: 1px solid #ddd;
  box-sizing: border-box;
}
</style>
