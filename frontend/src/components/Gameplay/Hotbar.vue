//components/Gameplay/Hotbar.vue

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const activeTab = ref('Score');
    const volume = ref(50);
    
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
    
    return {
      score: computed(() => store.state.score),
      activeTab,
      volume,
      volumeIcon
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
      <div v-if="activeTab === 'Score'">
        <span>Current Score: {{ score.toFixed(1) }}</span>
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
          <button class="quit-button">Quit Game</button>
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
    margin-top: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
}
</style>