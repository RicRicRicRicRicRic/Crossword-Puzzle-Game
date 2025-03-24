//components/CreateGame/CreateGame_Page.vue
<template>
    <div class="creategame-container">
      <div class="creategame-panel">
        <div class="wordsearch-container">
          <WordSearch />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import WordSearch from './WordSearch.vue';
  
  export default {
    components: {
      WordSearch,
    },
  };
  </script>
  
  <style scoped>
  .creategame-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    height: 91vh;
    border-bottom: 5px solid;
  }
  
  .creategame-panel {
    width: 500px;
    height: 500px;
    border: 2px solid black; 
  }
  </style>
  