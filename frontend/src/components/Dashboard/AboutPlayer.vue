//components/Dashboard/AboutPlayer.vue
<script>
export default {
  name: 'AboutPlayer',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
};
</script>

<template>
    <div v-if="user">
      <h2>{{ user.player_name }}</h2>
      <p>Email: {{ user.email }}</p>
      <!-- Display additional user info as needed -->
    </div>
    <div v-else>
      <p>Loading user information...</p>
    </div>
</template>
  
<style scoped>
/* Component-specific styles here */
</style>
