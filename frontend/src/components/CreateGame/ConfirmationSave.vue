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
@use "sass:color";

$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$font-color: #fff;

.confirmation-popup {
  background: $bg-color;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px $neon-color;
  color: $font-color;
  font-family: 'Poppins', sans-serif;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    text-shadow: 0 0 5px $neon-color, 0 0 10px $neon-color;
  }

  .input-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: $font-color;
    }

    input {
      font-family: 'Poppins', sans-serif;
      width: 100%;
      max-width: 300px;
      padding: 0.5rem;
      background: transparent;
      border: 2px solid $neon-color;
      border-radius: 4px;
      color: $font-color;
      font-size: 1rem;
      box-shadow: 0 0 5px $neon-color;
      outline: none;
      transition: box-shadow 0.3s ease;

      &::placeholder {
        color: color.adjust($neon-color, $lightness: 20%);
      }

      &:hover,
      &:focus {
        box-shadow: 0 0 10px $neon-color;
      }
    }
  }

  .button-group {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1rem;

    button {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      padding: 0.5rem 1.5rem;
      background: transparent;
      border: 2px solid $neon-color;
      color: $neon-color;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      text-shadow: 0 0 5px $neon-color;
      box-shadow: 0 0 5px $neon-color;
      transition: 0.3s;

      &:hover:not(:disabled) {
        background: $neon-color;
        color: $bg-color;
        box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:first-child {
        background-color: transparent;
      }
    }
  }
}
</style>