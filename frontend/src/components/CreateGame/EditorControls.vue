<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import ConfirmationSave from './ConfirmationSave.vue';

export default {
  components: {
    ConfirmationSave,
  },
  setup() {
    const store = useStore();
    const activeTab = ref('controls');
    const showConfirmation = ref(false);

    function move(direction) {
      store.dispatch('moveWord', direction);
    }

    function setDirection(newDirection) {
      store.dispatch('setWordDirection', newDirection);
    }

    function saveGame() {
      showConfirmation.value = true;
    }

    function confirmSaveGame() {
      console.log('Game saved!');
      showConfirmation.value = false;
    }

    function cancelSaveGame() {
      showConfirmation.value = false;
    }

    return {
      activeTab,
      move,
      setDirection,
      saveGame,
      showConfirmation,
      confirmSaveGame,
      cancelSaveGame
    };
  },
};
</script>

<template>
  <div class="editor-controls">
    <div class="tabs">
      <button :class="{ active: activeTab === 'controls' }" @click="activeTab = 'controls'">
        Controls
      </button>
      <button :class="{ active: activeTab === 'save' }" @click="activeTab = 'save'">
        Save
      </button>
    </div>
    <div class="content">
      <div v-if="activeTab === 'controls'">
        <div class="arrow-keys">
          <button class="arrow up" @click="move('up')">🢁</button>
          <div class="middle-row">
            <button class="arrow left" @click="move('left')">🢀</button>
            <button class="arrow right" @click="move('right')">🢂</button>
          </div>
          <button class="arrow down" @click="move('down')">🢃</button>
        </div>
        <div class="direction-buttons">
          <button @click="setDirection('across')">Set as Across</button>
          <button @click="setDirection('down')">Set as Down</button>
        </div>
      </div>
      <div v-else-if="activeTab === 'save'" class="save-controls">
        <button @click="saveGame">Save Game</button>
      </div>
    </div>

    <div v-if="showConfirmation" class="modal-overlay">
      <ConfirmationSave @confirm="confirmSaveGame" @cancel="cancelSaveGame" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$neon-blue: #00ffff;
$bg-color: #0a0a0a;

.editor-controls {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40vh;
  overflow: hidden;
  color: $neon-blue;

  .tabs {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid $neon-blue;

    button {
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid $neon-blue;
      background-color: transparent;
      color: $neon-blue;
      cursor: pointer;
      text-shadow: 0 0 5px $neon-blue;
      box-shadow: 0 0 5px $neon-blue;
      transition: 0.3s;

      &:hover,
      &:active,
      &.active {
        background: $neon-blue;
        color: $bg-color;
        box-shadow: 0 0 10px $neon-blue, 0 0 20px $neon-blue;
      }
    }
  }

  .content {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.arrow-keys {
  display: flex;
  flex-direction: column;
  align-items: center;

  >button,
  .middle-row {
    margin: 0.3rem 0;
  }

  .middle-row {
    display: flex;
    gap: 4rem;
  }

  .arrow {
    font-size: 1.2rem;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid $neon-blue;
    background-color: transparent;
    color: $neon-blue;
    border-radius: 4px;
    cursor: pointer;
    text-shadow: 0 0 3px $neon-blue;
    box-shadow: 0 0 5px $neon-blue;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 0 10px $neon-blue;
    }
  }
}

.direction-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 30px;

  button {
    font-family: 'Poppins', sans-serif;
    font-size: 10px;
    padding: 0.5rem 1rem;
    border: 1px solid $neon-blue;
    background-color: transparent;
    color: $neon-blue;
    border-radius: 8px;
    cursor: pointer;
    text-shadow: 0 0 3px $neon-blue;
    box-shadow: 0 0 5px $neon-blue;
    transition: 0.3s;

    &:hover,
    &:active {
      background: $neon-blue;
      color: $bg-color;
      box-shadow: 0 0 10px $neon-blue, 0 0 20px $neon-blue;
    }
  }
}

.save-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  button {
    font-family: 'Poppins', sans-serif;
    font-size: 13x;
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid $neon-blue;
    background-color: transparent;
    color: $neon-blue;
    border-radius: 8px;
    cursor: pointer;
    text-shadow: 0 0 3px $neon-blue;
    box-shadow: 0 0 5px $neon-blue;
    transition: 0.3s;

    &:hover,
    &:active {
      background: $neon-blue;
      color: $bg-color;
      box-shadow: 0 0 10px $neon-blue, 0 0 20px $neon-blue;
    }
  }
}

</style>
