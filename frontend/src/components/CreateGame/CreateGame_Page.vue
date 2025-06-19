//components/CreateGame/CreateGame_Page.vue

<script>
import GameGrid from './GameGrid.vue';
import WordSearch from './WordSearch.vue';
import EditorControls from './EditorControls.vue';
import StoreWords from './StoreWords.vue';

export default {
  components: { GameGrid, WordSearch, EditorControls, StoreWords },
};
</script>

<template>
  <div class="creategame-container">
    <div class="creategame-panel">
      <div class="left-column">
        <GameGrid />
      </div>
      <div class="middle-column">
        <div class="top-half">
          <WordSearch />
        </div>
        <div class="bottom-half">
          <EditorControls />
        </div>
      </div>
      <div class="right-column">
        <StoreWords />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow-green: 0 0 10px $neon-green, 0 0 20px $neon-green;
$glow-blue: 0 0 10px $neon-blue, 0 0 20px $neon-blue;
$glow-pink: 0 0 10px $neon-pink, 0 0 20px $neon-pink;

.creategame-container {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 91vh;
  background-color: $bg-dark;
  color: white;
  border-bottom: 5px solid $neon-pink;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
}

.creategame-panel {
  display: flex;
  width: 1360px;
  height: 600px;
  border: 2px solid $neon-green;
  border-radius: 10px;
  box-shadow: $glow-green;
  overflow: hidden;
  background-color: #111;

  .left-column {
    flex: 0 0 50%;
    height: 100%;
    border-right: 2px solid $neon-blue;
    box-shadow: inset $glow-blue;
    padding: 10px;
  }

  .middle-column {
    flex: 0 0 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 2px solid $neon-pink;
    box-shadow: inset $glow-pink;

    .top-half {
      height: 50%;
      border-bottom: 2px solid $neon-blue;
      box-shadow: inset $glow-blue;
      padding: 10px;
      overflow: hidden;
    }

    .bottom-half {
      height: 50%;
      padding: 10px;
      overflow: auto;
      overflow: hidden;
    }
  }

  .right-column {
    flex: 0 0 30%;
    height: 100%;
    border-left: 2px solid $neon-green;
    box-shadow: inset $glow-green;
    padding: 10px;
  }
}
</style>
