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
    <router-link to="/Login_or_Register">
      <button>Go to Login or register</button>
  </router-link>
</template>



<style  scoped>

</style>