//components/Authentication/Auth_page.vue
<script>
import login from '../authentication/Login.vue';
import register from '../authentication/Register.vue';
export default {
  name: 'Auth_page',
  components: {
    login,
    register
  },
  data() {
    return { switchState: false }
  },
  mounted() {
    document.title = 'Login and register';
  },
};
</script>

<template>
  <div class="auth-page">
    <div class="form-wrapper">
      <login v-if="!switchState" />
      <register v-else />
      <div class="footer-text">
        <p v-if="!switchState">Don't have an account? <span @click="switchState = true">Register</span></p>
        <p v-else>Already have an account? <span @click="switchState = false">Login</span></p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$font-color: #fff;

.auth-page {
  height: 100vh;
  background-color: $bg-color;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  color: $font-color;

  .form-wrapper {
    width: 100%;
    max-width: 400px;
    background-color: #1a1a1a;
    border: 2px solid $neon-color;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 0 20px $neon-color;

    .toggle-buttons {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;

      button {
        flex: 1;
        margin: 0 5px;
        padding: 10px;
        font-weight: 600;
        background: transparent;
        border: 2px solid $neon-color;
        color: $neon-color;
        border-radius: 8px;
        text-shadow: 0 0 5px $neon-color;
        cursor: pointer;
        transition: 0.3s;

        &.active,
        &:hover {
          background: $neon-color;
          color: $bg-color;
          text-shadow: none;
        }
      }
    }

    .footer-text {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.9rem;

      span {
        color: $neon-color;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.3s, text-shadow 0.3s;

        &:hover {
          color: color.adjust($neon-color, $lightness: 15%);
          text-shadow: 0 0 8px color.adjust($neon-color, $lightness: 20%);
        }
      }
    }
  }
}
</style>