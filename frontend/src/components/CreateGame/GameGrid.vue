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

.slider-container {
  margin-bottom: 10px;
  text-align: center;
  
  input[type="range"] {
    width: 80%;
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
