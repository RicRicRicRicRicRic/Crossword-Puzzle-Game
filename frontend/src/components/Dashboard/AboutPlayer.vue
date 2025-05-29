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

<style lang="scss" scoped>
$neon-blue: #00ffff;

.about-container {
  position: relative;
  display: inline-block;
  margin-left: -1px;

  .pfp-container {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
  
      .user-pfp {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 2px solid $neon-blue;
          overflow: hidden;
          box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff;
        }
    }

  .info-container {
    position: absolute;
    top: 50%;
    left: 95%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 200ms ease;
    white-space: nowrap;
    font-size: 14px;
    font-family: 'Courier New', Courier, monospace;
    color: #0ff;
    transition: 0.3s ease-in;

    p {
      margin: 0;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    button {
      margin-top: 8px;
      padding: 5px 10px;
      background-color: #000;
      color: #0ff;
      border: 1px solid #0ff;
      box-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10px;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;

      &:hover {
        background-color: #0ff;
        color: #000;
        box-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
      }
    }
  }
}

.navigation-bar:hover {
  .about-container {
    .info-container {
      opacity: 1;
    }
  }
}
</style>
