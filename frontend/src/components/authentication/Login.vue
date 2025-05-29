//components/Authentication/Login.vue

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      loginInput: '',
      password: ''
    };
  },
  created() {
    this.$store.dispatch('resetCrossword');
    this.$store.dispatch('resetPlayGame');
  },
  methods: {
    async login() {
      try {
        const response = await api.post('/login', {
          username: this.loginInput,
          password: this.password
        });
        this.$store.commit('setUser', response.data.user);
        this.$store.commit('setToken', response.data.token);
        sessionStorage.removeItem('dashboardSelectedPage');
        this.$router.push({ name: 'DashboardPage' });
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="input-box">
        <input v-model="loginInput" type="text" placeholder="Username or email" required
          autocomplete="current-username/email" />
      </div>
      <div class="input-box">
        <input v-model="password" type="password" placeholder="Password" required autocomplete="current-password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$font-color: #fff;

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $font-color;
  text-align: center;

  h2 {
    font-family: 'Raleway', sans-serif;
    font-weight: 100;
    font-size: 2rem;
    letter-spacing: 10px;
    text-shadow:
      0 0 5px $neon-color,
      0 0 10px $neon-color,
      0 0 20px $neon-color,
      0 0 40px $neon-color;
    margin-bottom: 2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 400px;

    .input-box {
      input {
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        width: 93%;
        padding: 12px;
        background: transparent;
        border: 2px solid $neon-color;
        border-radius: 8px;
        color: $font-color;
        font-size: 1rem;
        box-shadow: 0 0 5px $neon-color;
        outline: none;
        transition: 0.3s ease;

        &::placeholder {
          color: color.adjust($neon-color, $lightness: 20%);
        }

        &:hover,
        &:focus {
          box-shadow: 0 0 10px $neon-color;
        }
      }
    }

    button {
      padding: 12px;
      background: transparent;
      border: 2px solid $neon-color;
      color: $neon-color;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      width: 100%;
      border-radius: 8px;
      text-shadow: 0 0 5px $neon-color;
      box-shadow: 0 0 5px $neon-color;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background: $neon-color;
        color: $bg-color;
        box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
      }
    }
  }
}
</style>