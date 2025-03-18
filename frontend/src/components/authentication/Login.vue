//components/authentication/Login.vue
<script>
import axios from 'axios';

export default {
    data(){
        return{
            login: '',
            password: '',
            }
        },
    methods: {
        async register() {
            try{
                const response = await axios.post('http://localhost:3000/login',{
                    player_name:this.login,
                    password:this.login,
                    email:this.email,
                });
                alert(response.data.message);
            }catch(error){
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                }else{
                    alert('An error occurred. Please try again.');
                }
            }
        }
    }
}
</script>

<template>
    <form @submit.prevent="Login">
        <div class="input-box">
            <input v-model="login" type="text" placeholder="Enter username or email" required/>
        </div>
        <div class="input-box">
            <input v-model="password" type="text" placeholder="Enter password" required/>
        </div>
        <button type="submit">Login</button>
    </form>
</template>

<style lang="scss" scoped>

</style>