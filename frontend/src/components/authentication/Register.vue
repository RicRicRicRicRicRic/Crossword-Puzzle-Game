//components/Authentication/Register.vue
<script>
import axios from 'axios';

export default {
    data(){
        return{
            player_name: '',
            password: '',
            email: '',
            }
        },
    methods: {
        async register() {
        console.log('Register method called');
            try {
                const response = await axios.post('http://localhost:3000/api/register', {
                player_name: this.player_name,
                password: this.password,
                email: this.email,
                });
                alert(response.data.message);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
                } else {
                alert('An error occurred. Please try again.');
                }
            }
        }

    }
}
</script>

<template>
    <form @submit.prevent="register">
        <div class="input-box">
            <input v-model="player_name" type="text" placeholder="Create a username" required/>
        </div>
        <div class="input-box">
            <input v-model="password" type="text" placeholder="Create a password" required/>
        </div>
        <div class="input-box">
            <input v-model="email" type="text" placeholder="Enter your email" required/>
        </div>
        <button type="submit">Register</button>
    </form>
</template>

<style lang="scss" scoped>

</style>