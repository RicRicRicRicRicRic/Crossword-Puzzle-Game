//components/Gameplay/FinishGame.vue

<script>
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
  computed: {
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
  },
  methods: {
    finishGame() {
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
      <button class="finish-btn" @click="finishGame">Finish Game</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

  h2 {
    font-size: 1.8rem;
    color: #333;
    margin: 0 0 1rem 0;
  }

  h3 {
    font-size: 1.4rem;
    color: #555;
    margin: 0 0 1rem 0;
  }

  h4 {
    font-size: 1.2rem;
    color: #777;
    margin: 0 0 1.5rem 0;
  }

  .finish-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #47b94a;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: #3aa03a;
    }
  }
}
</style>
