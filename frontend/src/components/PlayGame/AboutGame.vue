//components/PlayGame/AboutGame.vue

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  },
  computed: {
    totalWordCount() {
      if (!this.game) return 0;
      
      const acrossData = typeof this.game.def_Across_data === 'string'
        ? JSON.parse(this.game.def_Across_data)
        : this.game.def_Across_data || [];
        
      const downData = typeof this.game.def_Down_data === 'string'
        ? JSON.parse(this.game.def_Down_data)
        : this.game.def_Down_data || [];
      
      return acrossData.length + downData.length;
    },
    
    formattedDate() {
      if (!this.game || !this.game.created_at) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(this.game.created_at).toLocaleDateString(undefined, options);
    },
    
    gameTime() {
      return this.game.time || this.game.grid_timer || 0;
    }
  },
  methods: {
    startGame() {
      this.$router.push(`/game/${this.game.game_ID}`);
      this.$emit('close');
    },
    close() {
      this.$emit('close');
    }
  }
}
</script>

<template>
  <div class="about-game-overlay" @click.self="close">
    <div class="about-game-modal">
      <div class="modal-header">
        <h2>{{ game.game_name }}</h2>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      
      <div class="game-details">
        <div class="detail-row">
          <span class="detail-label">Game ID:</span>
          <span class="detail-value">{{ game.game_ID }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Created by:</span>
          <span class="detail-value">{{ game.created_by }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Date created:</span>
          <span class="detail-value">{{ formattedDate }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Grid size:</span>
          <span class="detail-value">{{ game.grid_size }}x{{ game.grid_size }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Time limit:</span>
          <span class="detail-value">{{ gameTime }} minutes</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Total words:</span>
          <span class="detail-value">{{ totalWordCount }}</span>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="close">Cancel</button>
        <button class="start-btn" @click="startGame">Start Game</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.about-game-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
}

.game-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
  
  .detail-label {
    font-weight: bold;
    width: 120px;
    color: #555;
  }
  
  .detail-value {
    flex: 1;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  
  button {
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    border: none;
    
    &.cancel-btn {
      background-color: #f1f1f1;
      color: #333;
      
      &:hover {
        background-color: #e1e1e1;
      }
    }
    
    &.start-btn {
      background-color: #4caf50;
      color: white;
      
      &:hover {
        background-color: #45a049;
      }
    }
  }
}
</style>