//components/PlayGame/EditorControls.vue
<script>
export default {
        name: "EditorControls",
    };
</script>

<template>
    <div class="editor-controls">
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
</template>
  
  
<style lang="scss" scoped>
.editor-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  height: 40vh;
  overflow: hidden;
}
  
  .arrow-keys {
    display: flex;
    flex-direction: column;
    align-items: center;
    > button, .middle-row {
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
    margin-top: 40px;
  
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
</style>
  