//components/Home.vue
<script>
export default {
  name: 'Home',
  mounted() {
    document.title = 'Home Page';
  }
};
</script>

<template>
  <div class="home">
    <h1>The Word Lab: Decode the Grid</h1>
    <router-link to="/Login_or_Register">
      <button class="neon-btn">start</button>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$font-color: #fff;

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: $bg-color;
  color: $font-color;
  text-align: center;
  font-family: 'Poppins', sans-serif;

  h1 {
    font-family: 'Raleway', sans-serif;
    font-weight: 100;
    font-size: 4rem;
    letter-spacing: 10px;
    text-shadow:
      0 0 5px $neon-color,
      0 0 10px $neon-color,
      0 0 20px $neon-color,
      0 0 40px $neon-color;
    margin-bottom: 2rem;
  }

  .neon-btn {
    padding: 12px 32px;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    background: transparent;
    border: 2px solid $neon-color;
    color: $neon-color;
    border-radius: 8px;
    text-shadow: 0 0 5px $neon-color;
    box-shadow: 0 0 5px $neon-color, 0 0 10px $neon-color;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background: $neon-color;
      color: $bg-color;
      text-shadow: none;
      box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
    }
  }
}
</style>