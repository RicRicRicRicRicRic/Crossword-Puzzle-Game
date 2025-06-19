//components/Dashboard/Dashboard_Page.vue
<script>
import { markRaw } from 'vue';
import { mapState } from 'vuex';
import AboutPlayer from './AboutPlayer.vue';
import Leaderboards from '@/components/Leaderboards/Leaderboards_Page.vue';
import PlayGame from '@/components/PlayGame/PlayGame_Page.vue';
import CreateGame from '@/components/CreateGame/CreateGame_Page.vue';

export default {
  name: 'DashboardPage',
  components: { AboutPlayer, Leaderboards, PlayGame, CreateGame },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      headerText: 'Play a game',
      currentView: markRaw(PlayGame)
    }
  },
  created() {
    const savedPage = sessionStorage.getItem('dashboardSelectedPage');
    if (savedPage) {
      this.handleButtonClick(savedPage, false);
    }
    this.$store.dispatch('resetPlayGame');
  },
  methods: {
    /**
     * @param {string} text 
     * @param {boolean} store 
     */
    handleButtonClick(text, store = true) {
      this.headerText = text;
      if (text === 'Play a game') {
        this.currentView = markRaw(PlayGame);
      } else if (text === 'Create a game') {
        this.currentView = markRaw(CreateGame);
      } else if (text === 'Leaderboards') {
        this.currentView = markRaw(Leaderboards);
      }
      if (store) {
        sessionStorage.setItem('dashboardSelectedPage', text);
      }
    }
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="navigation-bar">
      <AboutPlayer :user="user" />
      <div class="button-container">
        <button class="nav-buttons" @click="handleButtonClick('Play a game')">
          <img class="button-img" src="@/assets/play.png" alt="Play a game" />
          <p>Play a game</p>
        </button>
        <button class="nav-buttons" @click="handleButtonClick('Create a game')">
          <img class="button-img" src="@/assets/create.png" alt="Create a game" />
          <p>Create a game</p>
        </button>
        <button class="nav-buttons" @click="handleButtonClick('Leaderboards')">
          <img class="button-img" src="@/assets/leaderboards.png" alt="Leaderboards" />
          <p>Leaderboards</p>
        </button>
      </div>
    </div>
    <div class="header-bar">
      {{ headerText }}
    </div>
    <div class="dashboard-panel">
      <keep-alive>
        <component :is="currentView" />
      </keep-alive>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: 'Poppins', sans-serif;
  color: #0ff;
}

.dashboard-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}

.dashboard-panel {
  margin-left: 100px;
  margin-top: 50px;
  height: calc(100vh - 65px);
  overflow-y: auto;
  background-color: #0a0a0a;
  padding: 20px;
  box-shadow: inset 0 0 10px #00fff7;
    overflow: hidden;
}

.navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  height: 100vh;
  border: 2px solid #00fff7;
  background-color: #000;
  transition: width 200ms ease;
  z-index: 10;
  box-shadow: 0 0 20px #00fff7;

  &:hover {
    width: 220px;

    .nav-buttons {
      width: 220px;

      p {
        transition: opacity 400ms ease-in;
        opacity: 1;
      }
    }
  }
}

.button-container {
  height: 60vh;
}

.nav-buttons {
  position: relative;
  width: 100px;
  height: 80px;
  margin-bottom: 10px;
  transition: width 200ms ease;
  font-size: 13px; /* Adjust the font size here */
  background-color: #111;
  border: 1px solid #0ff;
  box-shadow: 0 0 10px #00fff7;
  color: #0ff;
  cursor: pointer;

  p {
    position: absolute;
    left: 90px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    opacity: 0;
    color: #0ff;
    text-shadow: 0 0 5px #0ff;
  }

  &:hover {
    background-color: #0ff;
    color: #000;
    transition: 0.3s ease;

    p {
      color: #000;
      text-shadow: none;
    }
  }
}

.button-img {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
}

.header-bar {
  font-family: 'Raleway', sans-serif;
  font-weight: 100;
  font-size: 2rem;
  letter-spacing: 10px;
  position: fixed;
  top: 0;
  left: 100px;
  width: calc(100% - 100px);
  height: 65px;
  border-bottom: 2px solid #00fff7;
  background-color: #000;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0ff;
  text-shadow: 0 0 5px #00fff7, 0 0 10px #00fff7;
  box-shadow: 0 0 10px #00fff7;
}
</style>
