//components/Dashboard/Dashboard_Page.vue
<script>
import { mapState } from 'vuex';
import AboutPlayer from './AboutPlayer.vue';

export default {
  name: 'DashboardPage',
  components: { AboutPlayer },
  computed: {
    ...mapState(['user'])
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="navigation-bar">
      <AboutPlayer :user="user" />
    </div>
    <div class="dashboard-panel">
dashboard
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  position: relative;
  height: 100vh;
}

.navigation-bar {
  position: absolute;
  width: 100px;
  height: 100vh;
  border: 2px solid;
  transition: width 0.2s ease;
  overflow: visible;
  background-color: greenyellow;
}

.navigation-bar:hover {
  width: 220px;
}

.dashboard-panel {
  margin-left: 100px;
  height: 100vh;
  border: 2px solid;
}
</style>
