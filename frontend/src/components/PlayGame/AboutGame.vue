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
@use "sass:color";

$neon-color: #9a7bff;
$bg-color: #0a0a0a;
$font-color: #fff;

.about-game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.about-game-modal {
  background-color: $bg-color;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 30px;
  box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
  color: $font-color;
  font-family: 'Poppins', sans-serif;
  text-align: left;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 1.8rem;
    font-family: 'Raleway', sans-serif;
    letter-spacing: 2px;
    font-weight: 100;
    text-shadow:
      0 0 5px $neon-color,
      0 0 10px $neon-color,
      0 0 20px $neon-color,
      0 0 40px $neon-color;
    margin: 0;

  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: $neon-color;
    cursor: pointer;
    text-shadow: 0 0 5px $neon-color;

    &:hover {
      color: color.adjust($neon-color, $lightness: 10%);
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
    width: 120px;
    font-weight: bold;
    color: color.adjust($neon-color, $lightness: -10%);
  }

  .detail-value {
    flex: 1;
    color: $font-color;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    border: 2px solid $neon-color;
    background: transparent;
    color: $neon-color;
    text-shadow: 0 0 5px $neon-color;
    box-shadow: 0 0 5px $neon-color, 0 0 10px $neon-color;
    transition: 0.3s ease;

    &:hover {
      background-color: $neon-color;
      color: $bg-color;
      text-shadow: none;
      box-shadow: 0 0 10px $neon-color, 0 0 20px $neon-color;
    }
  }
}
</style>