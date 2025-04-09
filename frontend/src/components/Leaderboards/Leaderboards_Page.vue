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
				<div class="plyaer-list">
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
.leaderboards-container {
  width: 100%;
  margin: 0 auto;
	height: calc(100vh - 45px);
	display: flex;
	justify-content: center;
	align-items: center;
}

.leaderboards-panel {
  background-color: #f8f9fa;
	width: 900px;
	height: 500px;
  border-radius: 8px;
	border: 1px solid;
  padding: 20px;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.error {
  color: #e74c3c;
}

.leaderboards-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leaderboard-header {
  display: flex;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
  background-color: #eaeaea;
  color: #333;
}

.leaderboard-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #ddd;
  align-items: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.player-list {
	overflow-y: auto;
}


.rank {
  flex: 0 0 15%;
  text-align: center;
  font-weight: bold;
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
}

.player-name {
  font-weight: 500;
}

.score {
  flex: 0 0 25%;
  text-align: center;
  font-weight: 500;
}

.games {
  flex: 0 0 20%;
  text-align: center;
}
</style>