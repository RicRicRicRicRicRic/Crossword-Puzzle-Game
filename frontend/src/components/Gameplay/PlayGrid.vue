//components/Gameplay/PlayGrid.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
    export default {
        
    
    }
</script>

<template>
<div class="gamegrid-container">
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
      </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.gamegrid-container {
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 100%;
}
</style>