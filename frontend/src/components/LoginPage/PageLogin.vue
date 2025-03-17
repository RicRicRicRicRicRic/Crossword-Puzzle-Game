<!-- PageLogin.vue -->
<script>
import Reset from './Reset.vue';
import Login from './Login.vue';

export default {
  name: 'PageLogin',
  components: { 
    Reset,
    Login  
  },
  data() {
    return { showReset: false };
  },
  mounted() {
    document.title = 'Login';
  }
};
</script>

<template>
  <div class="container">
    <div class="container-forms">
      <div class="button-forms">
        <button @click="showReset = false">LOG IN</button>
        <button @click="showReset = true">PASSWORD RESET</button>
      </div>
      <!-- Show the Login if showReset is false -->
      <Login v-if="!showReset" />
      <!-- Show the Reset if showReset is true -->
      <Reset v-if="showReset" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.container-forms {
  background-color: rgb(0, 255, 174);
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}
</style>
