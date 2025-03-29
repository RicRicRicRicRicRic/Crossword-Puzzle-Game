//components/PlayGame/EditorControls.vue
<script>
export default {
  name: "EditorControls",
  data() {
    return {
      activeTab: "controls", 
    };
  },
};
</script>

<template>
  <div class="editor-controls">
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'controls' }" 
        @click="activeTab = 'controls'">
        Controls
      </button>
      <button 
        :class="{ active: activeTab === 'save' }" 
        @click="activeTab = 'save'">
        Save
      </button>
    </div>

    <div class="content">
      <div v-if="activeTab === 'controls'">
        <div class="arrow-keys">
          <button class="arrow up">🢁</button>
          <div class="middle-row">
            <button class="arrow left">🢀</button>
            <button class="arrow right">🢂</button>
          </div>
          <button class="arrow down">🢃</button>
        </div>
        <div class="direction-buttons">
          <button>Set as Across</button>
          <button>Set as Down</button>
        </div>
      </div>

      <div v-else-if="activeTab === 'save'" class="save-controls">
        <button>Save Game</button>
        <button>Reset Game</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-controls {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40vh;
  overflow: hidden;

  .tabs {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #ccc;
    
    button {
      flex: 1;
      padding: 0.5rem 1rem;
      border: none;
      background-color: #fff;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &.active {
        background-color: #e0e0e0;
      }
      
      &:hover {
        background-color: #f0f0f0;
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
}

.arrow-keys {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  > button,
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
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e0e0e0;
    }
  }
}

.direction-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 30px;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}

.save-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  button {
    width: 80%;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
