// components/PlayGame/ConfirmationSave.vue
<script>
 import { useStore } from 'vuex';
 export default {
   emits: ['confirm', 'cancel'],
   setup(props, { emit }) {
     const store = useStore();
     
     function onConfirm() {
       store.dispatch('saveGame');
       emit('confirm');
     }
     function onCancel() {
       emit('cancel');
     }
     return { onConfirm, onCancel };
   },
 };
 </script>

<template>
  <div class="confirmation-popup">
    <span>Are you sure you want to save the game?</span>
    <div class="button-group">
      <button @click="onConfirm">Yes</button>
      <button @click="onCancel">No</button>
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

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
