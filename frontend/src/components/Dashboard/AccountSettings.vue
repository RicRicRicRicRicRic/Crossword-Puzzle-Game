//components/Dashboard/AccountSettings.vue
<script>
export default {
  name: 'AccountSettings',
  emits: ['close', 'logout'],
  data() {
    return {
      showLogoutConfirm: false
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

      this.$emit('logout');

      this.$router.push({ name: 'Auth_page' });
    },
    cancelLogout() {
      this.showLogoutConfirm = false;
    }
  }
};
</script>

<template>
    <div class="modal-overlay">
        <div class="modal">
            <h3>Account Settings</h3>
            <button @click="openLogoutConfirm">Log Out</button>
            <button @click="close">Close</button>
        </div>
    </div>
  
    <div v-if="showLogoutConfirm" class="modal-overlay">
        <div class="modal">
            <p>Are you sure you want to log out?</p>
            <button @click="confirmLogout">Yes</button>
            <button @click="cancelLogout">No</button>
        </div>
    </div>
</template>
  
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; 
  }
  
  .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    min-width: 300px;
  }
</style>
  