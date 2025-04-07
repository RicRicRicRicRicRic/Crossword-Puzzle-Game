//components/Gameplay/HeaderTimer.vue

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'HeaderTimer',

};
</script>

<template>
    <div class="header-timer">
      <div class="progress-bar">
        <p>Timer:</p>
      </div>
    </div>
</template>
    
<style lang="scss" scoped>
  .header-timer {
    width: 100%;
    height: 100%;
    background-color: #eee;
    position: relative; 
  }
  
  .progress-bar {
    width: 100%; 
    height: 100%;
    background-color: #47b94a;
  }
  
  .progress-bar p {
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0; 
  }
</style>