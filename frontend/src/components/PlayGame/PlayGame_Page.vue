//components/PlayGame/PlayGame_Page.vue

<script>
import api from '@/services/api';
import defaultpfp from '@/assets/defaultpfp.png';
import AboutGame from './AboutGame.vue';

export default {
  components: { AboutGame },
  data() {
    return {
      games: [],
      loading: true,
      error: null,
      searchTerm: "",
      selectedGridSize: "",
      selectedDate: ""
    }
  },
  computed: {
    getProfileImage() {
      return (profileImg) => {
        if (profileImg) {
          if (profileImg.startsWith('data:')) {
            return profileImg;
          }
          return `data:image/png;base64,${profileImg}`;
        }
        return defaultpfp;
      }
    },
    gridSizes() {
      const sizes = new Set();
      this.games.forEach(game => {
        if (game.grid_size) sizes.add(game.grid_size);
      });
      return Array.from(sizes).sort((a, b) => a - b);
    },
    filteredGames() {
      return this.games.filter(game => {
        const matchesName = game.game_name.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesGridSize = this.selectedGridSize ? game.grid_size == this.selectedGridSize : true;
        let matchesDate = true;
        if (this.selectedDate && game.created_at) {
          const gameDate = new Date(game.created_at).toISOString().split('T')[0];
          matchesDate = gameDate === this.selectedDate;
        }
        return matchesName && matchesGridSize && matchesDate;
      });
    }
  },
  mounted() {
    this.fetchGames();
  },
  methods: {
    async fetchGames() {
      try {
        this.loading = true;
        const response = await api.get('/games');
        const hasChanges = JSON.stringify(response.data) !== JSON.stringify(this.games);
        if (hasChanges) {
          this.games = response.data;
        }
        this.loading = false;
      } catch (err) {
        this.error = "Failed to load games";
        console.error(err);
        this.loading = false;
      }
    },
    playGame(gameId) {
      this.$router.push(`/game/${gameId}`);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
};
</script>

<template>
  <div class="playgame-container">
    <div class="playgame-panel">
      <div class="filter-bar">
        <input type="text" v-model="searchTerm" placeholder="Search game name..." />
        <select v-model="selectedGridSize">
          <option value="">All Grid Sizes</option>
          <option v-for="size in gridSizes" :key="size" :value="size">{{ size }}x{{ size }}</option>
        </select>
        <input type="date" v-model="selectedDate" />
      </div>
      <ul class="game-list">
        <li v-for="game in filteredGames" :key="game.game_ID" class="game-selection">
          <div class="left-section">
            <div class="pfp-container">
              <img class="user-pfp" :src="getProfileImage(game.profile_img)" alt="Profile Picture" />
            </div>
          </div>
          <div class="center-section">
            <div class="game-name">
              <h2>{{ game.game_name }}</h2>
            </div>
            <div class="info-sections">
              <div class="center-left">
                <p>GameID: {{ game.game_ID }}</p>
                <p>Grid size: {{ game.grid_size }}x{{ game.grid_size }}</p>
              </div>
              <div class="center-right">
                <p>Time: {{ game.time }} min</p>
                <p>Created by: {{ game.created_by }}</p>
                <p v-if="game.created_at">Date: {{ formatDate(game.created_at) }}</p>
              </div>
            </div>
          </div>
          <div class="right-section">
            <button @click="playGame(game.game_ID)">Play</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playgame-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  height: 91vh;
  border-bottom: 5px solid;
}

.playgame-panel {
  display: flex;
  flex-direction: column;
  width: 1100px;
  height: 600px;
  border: 2px solid black;
  overflow: hidden;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  border-bottom: 2px solid #ccc;
  background-color: #f9f9f9;
  
  input[type="text"],
  input[type="date"],
  select {
    padding: 5px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}

.game-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  flex: 1;
  overflow-y: auto;

  .game-selection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:10px;
    border-bottom: 1px solid #ccc;
    height: 75px; 

    .left-section {
      flex: 0 0 auto;
      width: 10%;
      display: flex; 
      align-items: center;
      justify-content: center;

      .pfp-container {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        .user-pfp {
          width: 100%;
          height: 100%;
          object-fit: cover;
          margin: 0; 
        }
      }
    }

    .center-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 80%;
      padding-bottom: 10px;

      .game-name {
        flex: 0 0 40%; 
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px solid #ccc;

        h2 {
          font-size: 20px;
          margin: 0;
        }
      }

      .info-sections {
        flex: 0 0 60%; 
        display: flex;
        justify-content: space-between;

        .center-left,
        .center-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 50%;
          height: 100%;
          border: 1px solid #ccc;
          padding: 0 10px;

          p {
            margin: 0;
            font-size: 0.9em;
          }
        }
      }
    }

    .right-section {
      flex: 0 0 auto;
      width: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
