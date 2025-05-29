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

    this.$store.dispatch('stopTimer');
    
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
      if (this.user && this.user.acc_ID && !this.scoreSaved) {
        await this.saveScore();
      }
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

  
<style lang="scss" scoped>
$neon-green: #39ff14;
$neon-blue: #00ffff;
$neon-pink: #ff4ff8;
$bg-dark: #0a0a0a;
$glow: 0 0 10px, 0 0 20px;

.finish-game-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.finish-game-content {
  background-color: #111;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  color: white;
  border: 2px solid $neon-pink;
  box-shadow: 0 0 15px $neon-pink;

  h2 {
    font-size: 28px;
    color: $neon-green;
    text-shadow: 0 0 10px $neon-green;
    margin-bottom: 15px;
  }

  h3,
  h4 {
    margin: 10px 0;
    color: $neon-blue;
    text-shadow: 0 0 8px $neon-blue;
  }

  .status-message {
    margin: 15px 0;
    padding: 12px;
    border-radius: 6px;
    font-weight: bold;
    text-shadow: 0 0 5px;
    border: 1px solid;

    &.success {
      background-color: #0a1;
      color: $neon-green;
      border-color: $neon-green;
      box-shadow: 0 0 10px $neon-green;
    }

    &.error {
      background-color: #311;
      color: $neon-pink;
      border-color: $neon-pink;
      box-shadow: 0 0 10px $neon-pink;
    }
  }

  .finish-btn {
    margin-top: 25px;
    padding: 12px 30px;
    background-color: transparent;
    color: $neon-green;
    border: 2px solid $neon-green;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 0 10px $neon-green;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: $neon-green;
      color: #000;
      box-shadow: 0 0 20px $neon-green;
    }

    &:disabled {
      background-color: #222;
      color: #999;
      border-color: #444;
      box-shadow: none;
      cursor: not-allowed;
    }
  }
}
</style>