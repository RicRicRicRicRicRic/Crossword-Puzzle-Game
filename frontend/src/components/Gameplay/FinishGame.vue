//components/Gameplay/FinishGame.vue
  
<script>
import api from '@/services/api';

export default {
  name: 'FinishGame',
  props: {
    score: {
      type: Number,
      required: true
    },
    currentTimeLeft: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isSubmitting: false,
      saveStatus: null,
      scoreSaved: false
    };
  },
  computed: {
    gameId() {
      return this.$route.params.gameId;
    },
    user() {
      return this.$store.state.user;
    },
    mainTitle() {
      return this.currentTimeLeft > 0 ? "Congratulations!" : "Time's up!!";
    },
    timeMessage() {
      if (this.currentTimeLeft > 0) {
        const minutes = Math.floor(this.currentTimeLeft / 60);
        const seconds = this.currentTimeLeft % 60;
        const mm = minutes < 10 ? '0' + minutes : minutes;
        const ss = seconds < 10 ? '0' + seconds : seconds;
        return `You finished the game in ${mm}:${ss}.`;
      }
      return "";
    },
    scoreMessage() {
      return `Total Score: ${this.score.toFixed(1)}`;
    }
  },
  mounted() {
    // Stop the game timer when the finish screen is shown.
    this.$store.dispatch('stopTimer');
    
    // Automatically call saveScore as soon as the component is mounted.
    if (this.user && this.user.acc_ID && !this.scoreSaved) {
      this.saveScore();
    }
  },
  methods: {
    async saveScore() {
      if (this.scoreSaved) return;
      
      try {
        this.isSubmitting = true;
        const response = await api.post('/saveScore', {
          gameId: this.gameId,
          score: this.score,
          timeLeft: this.currentTimeLeft,
          userId: this.user.acc_ID
        });
        
        if (response.data.success) {
          this.saveStatus = { 
            type: 'success', 
            message: 'Score saved successfully!' 
          };
          this.scoreSaved = true;
        }
      } catch (error) {
        console.error('Error saving score:', error);
        const errorMsg = error.response?.data?.error || 'Failed to save score. Please try again.';
        this.saveStatus = { 
          type: 'error', 
          message: errorMsg 
        };
      } finally {
        this.isSubmitting = false;
      }
    },
    async finishGame() {
      // As a fallback, if saveScore wasn't successful yet, try saving it once more.
      if (this.user && this.user.acc_ID && !this.scoreSaved) {
        await this.saveScore();
      }
      // Reset the game state and navigate to the Dashboard.
      this.$store.dispatch('resetPlayGame');
      this.$router.push('/Dashboard');
    }
  }
};
</script>

<template>
  <div class="finish-game-modal">
    <div class="finish-game-content">
      <h2>{{ mainTitle }}</h2>
      <h3 v-if="timeMessage">{{ timeMessage }}</h3>
      <h4>{{ scoreMessage }}</h4>
      <div v-if="saveStatus" class="status-message" :class="saveStatus.type">
        {{ saveStatus.message }}
      </div>
      <button class="finish-btn" @click="finishGame" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : 'Finish Game' }}
      </button>
    </div>
  </div>
</template>

  
<style scoped>
  .finish-game-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .finish-game-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    max-width: 500px;
    width: 90%;
  }
  
  .finish-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .finish-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .status-message {
    margin: 15px 0;
    padding: 10px;
    border-radius: 4px;
  }
  
  .status-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .status-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>