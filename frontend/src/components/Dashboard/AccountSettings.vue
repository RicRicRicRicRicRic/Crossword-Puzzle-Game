//components/Dashboard/AccountSettings.vue
<script>
import api from '@/services/api';
import defaultpfp from '@/assets/defaultpfp.png'; 
export default {
  name: 'AccountSettings',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'logout', 'updateUser'],
  data() {
    return {
      showLogoutConfirm: false,
      showPassword: false,

      editingPlayerName: false,
      editingEmail: false,
      editingPassword: false,

      editingProfileImage: false,
      newProfileImg: null,  

      editedPlayerName: '',
      editedEmail: '',
      editedPassword: ''
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    openLogoutConfirm() {
      this.showLogoutConfirm = true;
    },
    confirmLogout() {
      this.$store.commit('setUser', null);
      this.$store.commit('setToken', null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.$emit('logout');
      this.$router.push({ name: 'Auth_page' });
    },
    cancelLogout() {
      this.showLogoutConfirm = false;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    editField(field) {
      if (field === 'player_name') {
        this.editingPlayerName = true;
        this.editedPlayerName = this.user.player_name;
      } else if (field === 'email') {
        this.editingEmail = true;
        this.editedEmail = this.user.email;
      } else if (field === 'password') {
        this.editingPassword = true;
        this.editedPassword = this.user.password;
      }
    },
    cancelEdit(field) {
      if (field === 'player_name') {
        this.editingPlayerName = false;
      } else if (field === 'email') {
        this.editingEmail = false;
      } else if (field === 'password') {
        this.editingPassword = false;
      }
    },
    async saveField(field) {
      let updatedData = {
        acc_ID: this.user.acc_ID,
        player_name: this.user.player_name,
        email: this.user.email,
        password: this.user.password,
        profile_img: this.user.profile_img 
      };

      if (field === 'player_name') {
        updatedData.player_name = this.editedPlayerName;
      } else if (field === 'email') {
        updatedData.email = this.editedEmail;
      } else if (field === 'password') {
        updatedData.password = this.editedPassword;
      }

      try {
        const response = await api.post('/profile', updatedData);
        if (response.data && response.data.message) {
          alert(response.data.message);
          const updatedUser = { ...this.user, ...updatedData };
          this.$store.commit('setUser', updatedUser);
          this.$emit('updateUser', updatedUser);
          if (field === 'player_name') {
            this.editingPlayerName = false;
          } else if (field === 'email') {
            this.editingEmail = false;
          } else if (field === 'password') {
            this.editingPassword = false;
          }
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('An error occurred while updating the profile.');
        }
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleProfileImageChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.newProfileImg = event.target.result;
          this.editingProfileImage = true;
        };
        reader.readAsDataURL(file);
      }
    },
    async saveProfileImage() {
      let updatedData = {
        acc_ID: this.user.acc_ID,
        player_name: this.user.player_name,
        email: this.user.email,
        password: this.user.password,
        profile_img: this.newProfileImg
      };
      try {
        const response = await api.post('/profile', updatedData);
        if (response.data && response.data.message) {
          alert(response.data.message);
          const updatedUser = { ...this.user, ...updatedData };
          this.$store.commit('setUser', updatedUser);
          this.$emit('updateUser', updatedUser);
          this.editingProfileImage = false;
          this.newProfileImg = null;
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('An error occurred while updating the profile image.');
        }
      }
    },
    cancelProfileImage() {
      this.editingProfileImage = false;
      this.newProfileImg = null;
      this.$refs.fileInput.value = '';
    }
  },
  computed: {
    displayProfileImage() {
      if (this.editingProfileImage && this.newProfileImg) {
        return this.newProfileImg;
      }
      if (this.user && this.user.profile_img) {
        if (this.user.profile_img.startsWith('data:')) {
          return this.user.profile_img;
        }
        return `data:image/png;base64,${this.user.profile_img}`;
      }
      return defaultpfp;
    }
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Account Settings</h3>
      <div v-if="user">
        <div class="pfp-container">
          <img class="user-pfp" :src="displayProfileImage" alt="Profile Picture" />
          <button v-if="!editingProfileImage" class="change-pfp-btn" @click="triggerFileInput">
            Change Profile
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleProfileImageChange"
          />
          <div v-if="editingProfileImage" class="btn-row">
            <button @click="saveProfileImage">Save</button>
            <button @click="cancelProfileImage">Cancel</button>
          </div>
        </div>
        <div class="input-item">
          <label for="acc_ID">Player ID:</label>
          <div class="input-container">
            <input id="acc_ID" type="text" :value="user.acc_ID" readonly>
          </div>
        </div>
        <div class="input-item">
          <label for="player_name">Name:</label>
          <div class="input-container">
            <input
              v-if="editingPlayerName"
              id="player_name"
              type="text"
              v-model="editedPlayerName"
            />
            <input
              v-else
              id="player_name"
              type="text"
              :value="user.player_name"
              readonly
            />
            <button
              v-if="!editingPlayerName"
              class="edit-btn"
              @click="editField('player_name')"
            >
              Edit
            </button>
            <div v-if="editingPlayerName" class="btn-row">
              <button @click="saveField('player_name')">Save</button>
              <button @click="cancelEdit('player_name')">Cancel</button>
            </div>
          </div>
        </div>
        <div class="input-item">
          <label for="email">Email:</label>
          <div class="input-container">
            <input
              v-if="editingEmail"
              id="email"
              type="email"
              v-model="editedEmail"
            />
            <input
              v-else
              id="email"
              type="email"
              :value="user.email"
              readonly
            />
            <button
              v-if="!editingEmail"
              class="edit-btn"
              @click="editField('email')"
            >
              Edit
            </button>
            <div v-if="editingEmail" class="btn-row">
              <button @click="saveField('email')">Save</button>
              <button @click="cancelEdit('email')">Cancel</button>
            </div>
          </div>
        </div>
        <div class="input-item">
          <label for="password">Password:</label>
          <div class="input-container">
            <div class="password-wrapper">
              <input
                v-if="editingPassword"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="editedPassword"
              >
              <input
                v-else
                id="password"
                :type="showPassword ? 'text' : 'password'"
                :value="user.password"
                readonly
              >
              <button
                type="button"
                class="toggle-password"
                @click="togglePasswordVisibility"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <button
              v-if="!editingPassword"
              class="edit-btn"
              @click="editField('password')"
            >
              Edit
            </button>
            <div v-if="editingPassword" class="btn-row">
              <button @click="saveField('password')">Save</button>
              <button @click="cancelEdit('password')">Cancel</button>
            </div>
          </div>
        </div>
        <div class="bttn-container">
          <button @click="openLogoutConfirm">Log Out</button>
          <button @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showLogoutConfirm" class="modal-overlay">
    <div class="modal-confirmation logout-modal">
      <p>Are you sure you want to log out?</p>
      <div class="bttn-container">
        <button @click="confirmLogout">Yes</button>
        <button @click="cancelLogout">No</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    min-width: 350px;
    min-height: 500px;
  }

  .modal-confirmation {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    min-width: 350px;
    min-height: 80px;
    text-align: center;
  }
}

.input-item {
  margin-bottom: 20px;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;

  > input {
    padding: 5px;
    box-sizing: border-box;
    flex: 1;
    height: 35px; 
  }
}

.password-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;

  input {
    flex: 1;
    width: auto;
    padding-right: 2.5rem;
    height: 30px; 
  }

  .toggle-password {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
  }
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.bttn-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pfp-container {
  margin-bottom: 10px;
  text-align: center;

  .btn-row {
    justify-content: center;
  }
}

.user-pfp {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  margin: 0 auto 10px;
}

.change-pfp-btn {
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>

