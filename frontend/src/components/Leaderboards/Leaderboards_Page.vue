//components/Leaderboards/Leaderboards_Page.vue
<script>
import api from '@/services/api';
import defaultpfp from '@/assets/defaultpfp.png'; 

export default {
  data() {
    return {
      leaderboards: [],
      loading: false,
      error: null
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
  },
  methods: {
    async fetchLeaderboards() {
      try {
        this.loading = true;
        const response = await api.post('/leaderboards');
        this.leaderboards = response.data;
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to load leaderboards';
        this.loading = false;
        console.error('Error fetching leaderboards:', error);
      }
    }
  },
  mounted() {
    this.fetchLeaderboards();
  }
}
</script>

<template>
  <div class="leaderboards-container">
    <div class="leaderboards-panel">
      
      <div v-if="loading" class="loading">Loading leaderboards...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="leaderboards.length === 0" class="no-data">No leaderboard data available</div>
      
      <ul v-else class="leaderboards-list">
        <li class="leaderboard-header">
          <div class="rank">Rank</div>
          <div class="player-info">Player</div>
          <div class="score">Score</div>
          <div class="games">Games</div>
        </li>
				<div class="player-list">
					<li v-for="(player, index) in leaderboards" :key="player.acc_ID" class="leaderboard-item">
          <div class="rank">{{ player.Total_Score > 0 ? (index + 1) : '-' }}</div>
          <div class="player-info">
            <img :src="getProfileImage(player.profile_img)" alt="Profile" class="profile-img">
            <span class="player-name">{{ player.player_name }}</span>
          </div>
          <div class="score">{{ Number(player.Total_Score).toFixed(2) }}</div>
          <div class="games">{{ player.games_completed }}</div>
        </li>
				</div>
        
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$neon-yellow: #cfff04;
$bg-dark: #0a0a0a;

.leaderboards-container {
  width: 100%;
  height: calc(100vh - 45px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-dark;
  color: white;
}

.leaderboards-panel {
  background-color: #111;
  width: 900px;
  height: 500px;
  border-radius: 10px;
  border: 2px solid $neon-green;
  box-shadow: 0 0 15px $neon-green;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 5px $neon-blue;
}

.error {
  color: $neon-pink;
  text-shadow: 0 0 8px $neon-pink;
}

.leaderboards-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.leaderboard-header {
  display: flex;
  padding: 10px 0;
  border-bottom: 2px solid $neon-blue;
  background-color: #000;
  color: $neon-green;
  font-weight: bold;
  text-shadow: 0 0 5px $neon-green;
}

.leaderboard-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #333;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1a1a1a;
  }
}

.player-list {
  overflow-y: auto;
}

.rank {
  flex: 0 0 15%;
  text-align: center;
  color: $neon-blue;
  text-shadow: 0 0 5px $neon-blue;
}

.player-info {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid $neon-green;
  box-shadow: 0 0 10px $neon-green;
}

.player-name {
  font-weight: bold;
  color: $neon-green;
  text-shadow: 0 0 5px $neon-green;
}

.score {
  flex: 0 0 25%;
  text-align: center;
  font-weight: bold;
  color: $neon-yellow;
  text-shadow: 0 0 5px $neon-yellow;
}

.games {
  flex: 0 0 20%;
  text-align: center;
  font-weight: bold;
  color: $neon-pink;
  text-shadow: 0 0 5px $neon-pink;
}
</style>