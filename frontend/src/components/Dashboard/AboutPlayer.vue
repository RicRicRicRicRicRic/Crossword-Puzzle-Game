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
    <div>
      <h2>{{ user.player_name }}</h2>
      <p>Email: {{ user.email }}</p>
      <!-- Display additional user info as needed -->
    </div>
  </template>

<style scoped>
/* Component-specific styles here */
</style>
