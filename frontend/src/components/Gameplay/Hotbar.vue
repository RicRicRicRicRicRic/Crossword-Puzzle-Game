<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Hotbar',
  setup(props, { emit }) {
    const store = useStore();
    const activeTab = ref('Score');
    const showQuitModal = ref(false);
    
    const quitGame = () => {
      showQuitModal.value = true;
    };

    const confirmQuit = () => {
      showQuitModal.value = false;
      emit('quit-game');
    };

    const cancelQuit = () => {
      showQuitModal.value = false;
    };
    
    return {
      score: computed(() => store.state.score),
      activeTab,
      quitGame,
      showQuitModal,
      confirmQuit,
      cancelQuit
    };
  }
};
</script>

<template>
  <div class="hotbar-container">
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'Score' }" 
        @click="activeTab = 'Score'">
        <h4>Score</h4>
      </button>
      <button 
        :class="{ active: activeTab === 'Settings' }" 
        @click="activeTab = 'Settings'">
        <h4>Settings</h4>
      </button>
    </div>
    <div class="hotbar-content">
      <div class="score-display" v-if="activeTab === 'Score'">
        <h2>Current Score:</h2>
        <p>{{ score.toFixed(1) }}</p>
      </div>
      <div v-if="activeTab === 'Settings'">
        <div class="settings-controls">
          <button class="quit-button" @click="quitGame">Quit Game</button>
        </div>
      </div>
    </div>
    <div v-if="showQuitModal" class="quit-confirmation-modal">
      <div class="confirmation-content">
        <h3>Do you really want to quit the game?</h3>
        <div class="modal-buttons">
          <button class="yes-btn" @click="confirmQuit">Yes</button>
          <button class="no-btn" @click="cancelQuit">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow: 0 0 10px, 0 0 20px;

.hotbar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  background-color: $bg-dark;
  color: white;

  .tabs {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid $neon-pink;

    button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: none;
      height: 100%;
      background-color: #111;
      color: white;
      cursor: pointer;
      border: 1px solid $neon-blue;
      box-shadow: 0 0 10px $neon-blue;
      transition: background-color 0.2s, box-shadow 0.2s;

      &.active {
        background-color: #222;
        box-shadow: 0 0 20px $neon-green;
      }

      &:hover {
        background-color: #333;
        box-shadow: 0 0 15px $neon-blue;
      }
    }
  }

  .hotbar-content {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .score-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      p {
        margin: 0;
        font-size: 20px;
        text-shadow: 0 0 10px $neon-green;
      }
    }
  }

  .settings-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  /* Removed .volume-control and its child styles */

  .quit-button {
    padding: 10px 10px;
    margin-top: 20px; /* Adjusted margin since volume control is removed */
    background-color: $neon-pink;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 0 10px $neon-pink;
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
      background-color: $neon-blue;
      box-shadow: 0 0 20px $neon-blue;
    }
  }

  .quit-confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1500;

    .confirmation-content {
      background: #111;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 0 20px $neon-green;

      h3 {
        margin-bottom: 1.5rem;
        font-size: 1.6rem;
        color: white;
        text-shadow: 0 0 10px $neon-green;
      }

      .modal-buttons {
        display: flex;
        justify-content: space-around;

        button {
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s, box-shadow 0.3s;
        }

        .yes-btn {
          background-color: $neon-green;
          color: white;
          box-shadow: 0 0 10px $neon-green;

          &:hover {
            background-color: $neon-blue;
            box-shadow: 0 0 20px $neon-blue;
          }
        }

        .no-btn {
          background-color: $neon-pink;
          color: white;
          box-shadow: 0 0 10px $neon-pink;

          &:hover {
            background-color: $neon-green;
            box-shadow: 0 0 20px $neon-green;
          }
        }
      }
    }
  }
}
</style>
