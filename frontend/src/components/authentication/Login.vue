//components/Authentication/Login.vue
<script>
import api from '@/services/api';

export default {
    data() {
        return {
            loginInput: '',
            password: ''
            };
        },
    methods: {
        async login() {
            try {
                const response = await api.post('/login', {
                username: this.loginInput,
                password: this.password });
                this.$store.commit('setUser', response.data.user);
                this.$store.commit('setToken', response.data.token);
                this.$router.push({ name: 'DashboardPage' });
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
                } else {
                alert('An error occurred. Please try again.');
                }
            }
        }
    }
};
</script>

<template>
    <form @submit.prevent="login">
        <div class="input-box">
            <input v-model="loginInput" type="text" placeholder="Enter username or email" required autocomplete="current-username/email"/>
        </div>
        <div class="input-box">
            <input v-model="password" type="password" placeholder="Enter password" required autocomplete="current-password" />
        </div>
        <button type="submit">Login</button>
    </form>
</template>

<style scoped>
/* Add your component styles here */
</style>
