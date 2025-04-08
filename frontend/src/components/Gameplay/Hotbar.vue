//components/Gameplay/Hotbar.vue

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Hotbar',
  setup(props, { emit }) {
    const store = useStore();
    const activeTab = ref('Score');
    const volume = ref(50);
    const showQuitModal = ref(false);
    
    const volumeIcon = computed(() => {
      if (volume.value === 0) {
        return "🔇";
      } else if (volume.value >= 70) {
        return "🔊";
      } else if (volume.value >= 40) {
        return "🔉";
      } else if (volume.value >= 1) {
        return "🔈";
      }
      return "";
    });
    
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
      volume,
      volumeIcon,
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
          <div class="volume-control">
            <span class="volume-icon">{{ volumeIcon }}</span>
            <input
              type="range"
              class="volume-slider"
              min="0"
              max="100"
              v-model.number="volume"
            />
            <span class="volume-number">{{ volume }}</span>
          </div>
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
.hotbar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;

  .tabs {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid;

    button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: none;
      height: 100%;
      background-color: #fff;
      cursor: pointer;
      border: 1px solid #ddd;
      transition: background-color 0.2s;

      &.active {
        background-color: #e0e0e0;
      }

      &:hover {
        background-color: #f0f0f0;
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
      }
    }
  }

  .settings-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 250px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;

    .volume-icon {
      font-size: 1.5rem;
      width: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      margin-left: 5px;
    }

    .volume-slider {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 3px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      margin: 0;
      padding: 0;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #4a90e2;
        cursor: pointer;
        border: none;
      }

      &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border: none;
        border-radius: 50%;
        background: #4a90e2;
        cursor: pointer;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .volume-number {
      width: 2rem;
      text-align: center;
      font-size: 1rem;
    }
  }

  .quit-button {
    padding: 10px 10px;
    margin-top: 20px;
    background-color: #ff5555;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #ff2222;
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
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);

      h3 {
        margin-bottom: 1.5rem;
        font-size: 1.6rem;
        color: #333;
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
          transition: background 0.3s;
        }

        .yes-btn {
          background-color: #47b94a;
          color: #fff;
          &:hover {
            background-color: #3aa03a;
          }
        }

        .no-btn {
          background-color: #c0392b;
          color: #fff;
          &:hover {
            background-color: #a93226;
          }
        }
      }
    }
  }
}
</style>
