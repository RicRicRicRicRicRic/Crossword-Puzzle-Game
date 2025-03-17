<script>
import About from './About.vue';
import Enroll from './Enroll.vue';
import Subject from './Subjects.vue';

export default {
  name: 'PageStudent',
  data() {
    return {
      currentView: 'about', 
    };
  },
  mounted() {
    document.title = 'Student Dashboard';
  },
  components: {
    About,
    Enroll,
    Subject,
  },
  methods: {
    setView(view) {
      this.currentView = view;
    },
  },
};
</script>

<template>
  <header class="header">Student Dashboard</header>
  <div class="container">
    <div class="sidebar">
      <button @click="setView('about')">About Student</button>
      <button @click="setView('enroll')">Enroll</button>
      <button @click="setView('subjects')">Academics</button>
    </div>
    <main class="page">
      <About v-show="currentView === 'about'" />
      <Enroll v-show="currentView === 'enroll'" />
      <Subject v-show="currentView === 'subjects'" />
    </main>
  </div>
</template>


<style scoped>
.header{
  background-color: chartreuse;
  height: 60px;
  width: 100%;
  overflow: hidden;
}

.container {
  display: flex; 
  height: calc(100vh - 60px);
  overflow: hidden;
}

.sidebar{
  width: 140px;
  background-color: antiquewhite;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page{
  height: 100%;
}
</style>

