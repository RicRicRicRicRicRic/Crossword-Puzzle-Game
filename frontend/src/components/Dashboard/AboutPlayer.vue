//components/Dashboard/AboutPlayer.vue
<script>
import AccountSettings from './AccountSettings.vue';
import defaultpfp from '@/assets/defaultpfp.png'; 

export default {
  name: 'AboutPlayer',
  components: {
    AccountSettings
  },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showAccountSettings: false
    };
  },
  computed: {
    profileImage() {
      if (this.user && this.user.profile_img) {
        if (this.user.profile_img.startsWith('data:')) {
          return this.user.profile_img;
        }
        return `data:image/png;base64,${this.user.profile_img}`;
      }
      return defaultpfp;
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
      <img class="user-pfp" :src="profileImage" alt="Profile Picture" />
    </div>
    <div class="info-container">
      <div v-if="user">
        <p>{{ user.acc_ID }}</p>
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
      :user="user"
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

.user-pfp {
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
  font-size: 17px;
}

.navigation-bar:hover .about-container .info-container {
  opacity: 1;
}

.info-container p {
  margin: 0;
}
</style>
