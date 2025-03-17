<!-- Login.vue -->
<script>
import axios from 'axios';

export default {
  data() {
    return {
      studentNumber: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          studentNumber: this.studentNumber,
          password: this.password
        });
        alert(response.data.message);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <h2>LOG IN YOUR ACCOUNT</h2>
    <div class="input-box">
      <input v-model="studentNumber" type="text" placeholder="Student Number" required>
    </div>
    <div class="input-box">
      <input v-model="password" type="password" placeholder="Password" required>
    </div>
    <button type="submit">Log in</button>
    <p>
      Not a student yet?
      <router-link to="/Register"><span>Click here</span></router-link>
    </p>
  </form>
</template>

<style scoped>

</style>
