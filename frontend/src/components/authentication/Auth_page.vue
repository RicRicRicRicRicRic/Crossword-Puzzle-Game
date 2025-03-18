<script>
import login from './Login.vue';
import register from './Register.vue';
    export default {
        name: 'Auth_page',
        components: {
            login,
            register
        },
        data(){
            return { switchState: false }
        },
        mounted() {
            document.title = 'Login and register'; 
        },
    };
</script>

<template>
    <div class="container">
        <div class="container-forms">
            <div class="button-forms">
                <button @click="switchState = false">Login</button>
                <button @click="switchState = true">Register</button>
            </div>
            <login v-if="!switchState" />
            <register v-if="switchState" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>