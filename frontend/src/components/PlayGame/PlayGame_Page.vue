<script>
import api from '@/services/api';
import defaultpfp from '@/assets/defaultpfp.png';
import AboutGame from './AboutGame.vue';
import { mapState } from 'vuex'; 

export default {
  components: { AboutGame },
  props: {
    // Keep the prop for flexibility if a parent wants to override,
    // but we'll primarily rely on mapState for the logged-in user.
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showAboutGame: false,
      selectedGame: null,
      games: [],
      loading: true,
      error: null,
      searchTerm: "",
      creatorSearchTerm: "",
      selectedGridSize: "",
      selectedDate: "",
      pollingInterval: null
    }
  },
  computed: {
    // Map the 'user' state from the Vuex store to a computed property
    ...mapState({
      loggedInUser: state => state.user 
    }),
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
        const matchesCreator = this.creatorSearchTerm ? 
          game.created_by.toLowerCase().includes(this.creatorSearchTerm.toLowerCase()) : true;
        const matchesGridSize = this.selectedGridSize ? game.grid_size == this.selectedGridSize : true;
        let matchesDate = true;
        if (this.selectedDate && game.created_at) {
          const gameDate = new Date(game.created_at).toISOString().split('T')[0];
          matchesDate = gameDate === this.selectedDate;
        }
        return matchesName && matchesCreator && matchesGridSize && matchesDate;
      });
    }
  },
  mounted() {
    this.fetchGames();
    this.pollingInterval = setInterval(this.fetchGames, 10000);
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval);
  },
  methods: {
    openAboutGame(game) {
      this.getGameDetails(game.game_ID);
    },
    closeAboutGame() {
      this.showAboutGame = false;
      this.selectedGame = null;
    },
    async getGameDetails(gameId) {
      try {
        const response = await api.get(`/games/${gameId}`);
        this.selectedGame = response.data;
        this.showAboutGame = true;
      } catch (err) {
        console.error("Failed to load game details:", err);
      }
    },
    async fetchGames() {
      try {
        const wasLoading = this.loading;
        if (wasLoading) this.loading = true;
        
        const response = await api.get('/games');
        const hasChanges = JSON.stringify(response.data) !== JSON.stringify(this.games);
        if (hasChanges) {
          this.games = response.data;
        }
        
        if (wasLoading) this.loading = false;
      } catch (err) {
        this.error = "Failed to load games";
        console.error(err);
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getStatus(game) {
      // Use loggedInUser from Vuex store
      const currentUserAccId = this.loggedInUser ? this.loggedInUser.acc_ID : null;

      console.log('--- Checking Game Status ---');
      console.log('Logged-in User ID (from store):', currentUserAccId || 'User not logged in');
      console.log('Game ID:', game.game_ID);
      console.log('Game finished_players data:', game.finished_players);

      if (!currentUserAccId) {
        console.log('Status: unfinished (User not logged in or acc_ID missing from store)');
        return 'unfinished';
      }
      
      if (Array.isArray(game.finished_players)) {
        const isFinished = game.finished_players.some(player => {
          console.log(`Comparing player.acc_ID: ${player.acc_ID} with user.acc_ID: ${currentUserAccId}`);
          return player.acc_ID === currentUserAccId;
        });
        console.log(`Status: ${isFinished ? 'finished' : 'unfinished'}`);
        return isFinished ? 'finished' : 'unfinished';
      }

      console.log('Status: unfinished (finished_players is not an array or is null)');
      return 'unfinished';
    }
  }
};
</script>

<template>
  <div class="playgame-container">
    <div class="playgame-panel">
      <div class="filter-bar">
        <input type="text" v-model="searchTerm" placeholder="Search game name..." />
        <input type="text" v-model="creatorSearchTerm" placeholder="Search by creator..." />
        <select v-model="selectedGridSize">
          <option value="">All Grid Sizes</option>
          <option v-for="size in gridSizes" :key="size" :value="size">{{ size }}x{{ size }}</option>
        </select>
        <input type="date" v-model="selectedDate" />
      </div>
      
      <div v-if="loading" class="loading">Loading games...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ul v-else class="game-list">
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
              <div class="center-center">
                <p>Created by: {{ game.created_by }}</p>
                <p v-if="game.created_at">Date: {{ formatDate(game.created_at) }}</p>
              </div>
              <div class="center-right">
                <p>Time: {{ game.time }} min</p>
                <p>
                  Status: <span :class="{'status-finished': getStatus(game) === 'finished', 'status-unfinished': getStatus(game) === 'unfinished'}">{{ getStatus(game) }}</span> 
                </p>
              </div>
            </div>
          </div>
          <div class="right-section">
            <button @click="openAboutGame(game)">Play</button>
          </div>
        </li>
      </ul>
      
      <!-- About Game Modal -->
      <AboutGame
        v-if="showAboutGame && selectedGame" 
        :game="selectedGame"
        :user="user"
        @close="closeAboutGame"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow: 0 0 10px, 0 0 20px;

.playgame-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: $bg-dark;
  color: white;
  border-bottom: 5px solid $neon-pink;
}

.playgame-panel {
  display: flex;
  flex-direction: column;
  width: 1100px;
  height: 600px;
  background-color: #111;
  border: 2px solid $neon-green;
  border-radius: 10px;
  box-shadow: 0 0 20px $neon-green;
  overflow: hidden;
}

.filter-bar {
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: #000;
  border-bottom: 1px solid $neon-pink;

  input,
  select {
    padding: 10px 14px;
    background: #111;
    border: 1px solid $neon-blue;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    box-shadow: 0 0 5px $neon-blue;
    outline: none;

    &:focus {
      box-shadow: 0 0 10px $neon-blue;
    }
  }

  input[type="text"] {
    flex: 1;
  }
}

.game-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.game-selection {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #333;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #222;
  }
}

.left-section {
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pfp-container {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid $neon-green;
  box-shadow: 0 0 10px $neon-green;

  .user-pfp {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.center-section {
  flex: 1;

  .game-name h2 {
    margin: 0 0 5px 0;
    padding-left: 50px;
    font-size: 20px;
    color: $neon-green;
    text-shadow: 0 0 5px $neon-green;
  }

  .info-sections {
    display: flex;
    font-size: 14px;

    .center-left,
    .center-right,
    .center-center {
      padding-left: 50px;
      flex: 1;
    }
  }
}

.right-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;

  button {
    font-weight: bold;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    padding: 10px 20px;
    background-color: transparent;
    color: $neon-green;
    border: 2px solid $neon-green;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 0 10px $neon-green;
    transition: all 0.2s;

    &:hover {
      background-color: $neon-green;
      color: #000;
      box-shadow: 0 0 20px $neon-green;
    }
  }
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.error {
  color: $neon-pink;
  text-shadow: 0 0 8px $neon-pink;
}

.center-right p span.status-finished { 
  color: $neon-green;
  text-shadow: 0 0 5px $neon-green;
}

.center-right p span.status-unfinished {
  color: $neon-pink;
  text-shadow: 0 0 5px $neon-pink;
}
</style>
