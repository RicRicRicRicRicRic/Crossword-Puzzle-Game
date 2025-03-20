//components/Dashboard/AboutPlayer.vue
<script>
import AccountSettings from './AccountSettings.vue'; 

export default {
  name: 'AboutPlayer',
  components: {
    AccountSettings
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showAccountSettings: false
    }
  },
  methods: {
    openAccountSettings() {
      this.showAccountSettings = true;
    },
    closeAccountSettings() {
      this.showAccountSettings = false;
    },
    handleLogout() {
      this.showAccountSettings = false;
    }
  }
};
</script>

<template>
  <div class="about-container">
    <div class="pfp-container">
      <img class="pfp" src="@/assets/defaultpfp.png" alt="Default Profile Picture" />
    </div>
    <div class="info-container">
      <div v-if="user">
        <p>{{ user.player_name }}</p>
        <p>{{ user.email }}</p>
      </div>
      <div v-else>
        <p>Loading user information...</p>
      </div>
      <button @click="openAccountSettings">Account Settings</button>
    </div>

    <AccountSettings 
      v-if="showAccountSettings" 
      @close="closeAccountSettings"
      @logout="handleLogout"
    />
  </div>
</template>

<style scoped>
.about-container {
  position: relative;
  display: inline-block; 
  margin-left: -1px;
}

.pfp-container {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pfp {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
}

.info-container {
  position: absolute;
  top: 50%;
  left: 95%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 200ms ease;
  white-space: nowrap;
}

.navigation-bar:hover .about-container .info-container {
  opacity: 1;
}

.info-container p {
  margin: 0;
}
</style>
