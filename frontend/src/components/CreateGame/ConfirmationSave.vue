// components/PlayGame/ConfirmationSave.vue
<script>
 import { useStore } from 'vuex';
 import { ref } from 'vue';

 export default {
   emits: ['confirm', 'cancel'],
   setup(props, { emit }) {
     const store = useStore();
     const gameName = ref('');
     
     function onPublish() {
       store.dispatch('saveGame', { gameName: gameName.value });
       emit('confirm');
     }
     
     function onCancel() {
       emit('cancel');
     }
     
     return { onPublish, onCancel, gameName };
   },
 };
</script>

<template>
  <div class="confirmation-popup">
    <h3>Save Game</h3>
    <div class="input-group">
      <label for="game-name">Enter a name for your game:</label>
      <input 
        id="game-name" 
        v-model="gameName" 
        type="text" 
        placeholder="My Crossword Game"
        required
      />
    </div>
    <div class="button-group">
      <button @click="onPublish" :disabled="!gameName.trim()">Publish Game</button>
      <button @click="onCancel">Cancel</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.confirmation-popup {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      max-width: 300px;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
      }
    }
  }

  .button-group {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1rem;

    button {
      padding: 0.5rem 1.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover:not(:disabled) {
        background-color: #f0f0f0;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &:first-child {
        background-color: #0066cc;
        color: white;
        border-color: #0055aa;
        
        &:hover:not(:disabled) {
          background-color: #0055aa;
        }
      }
    }
  }
}
</style>