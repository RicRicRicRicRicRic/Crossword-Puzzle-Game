//components/Dashboard/Dashboard_Page.vue
<script>
import { mapState } from 'vuex';
import AboutPlayer from './AboutPlayer.vue';


export default {
  name: 'DashboardPage',
  components: {
    AboutPlayer
  },
  computed: {
    ...mapState(['user'])
  }
};
</script>

<template>
    <div>
      <h1>Dashboard</h1>
      <AboutPlayer :user="user" />
    </div>
  </template>

<style scoped>
/* Add styles for Dashboard page if needed */
</style>
