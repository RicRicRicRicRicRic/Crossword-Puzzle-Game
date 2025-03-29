//components/PlayGame/StoreWords.vue
<script>
export default {
  name: "StoreWords",
};
</script>

<template>
  <div class="store-words-container">

    <div class="section top-section">
      <div class="column">
        <div class="across">
          <div class="header">
            <h4>Across Definition</h4>
          </div>

        </div>
      </div>
      <div class="column">
        <div class="down">
          <div class="header">
            <h4>Down Definition</h4>
          </div>

        </div>
      </div>
    </div>

    <div class="section bottom-section">
      <div class="column">
        <div class="across">
          <div class="header">
            <h4>Across words</h4>
          </div>

        </div>
      </div>
      <div class="column">
        <div class="down">
          <div class="header">
            <h4>Down words</h4>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.store-words-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section {
  flex: 1; 
  display: flex;
  flex-direction: row;
  
  .column {
    flex: 1; 
    border: 1px solid #ddd;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
  }
  
  .across,
  .down {
    display: flex;
    flex-direction: column;
    width: 100%;

  }
  
  .header {
    display: flex;            
    align-items: center;       
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 40px;
    border-bottom: 2px solid;
  }
}
</style>
