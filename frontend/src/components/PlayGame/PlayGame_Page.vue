//components/PlayGame/PlayGame_Page.vue
<script>
import SelectGame from './SelectGame.vue';
import StartGame from './StartGame.vue';
    export default {
        components: {SelectGame, StartGame}
    };
</script>

<template>
    <div class="playgame-container">
        <div class="playgame-panel">

        </div>
    </div>
</template>

<style lang="scss" scoped>
.playgame-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  height: 91vh;
  border-bottom: 5px solid;
}

.playgame-panel {
  display: flex;
  width: 1160px;
  height: 600px;
  border: 2px solid black;
}
</style>