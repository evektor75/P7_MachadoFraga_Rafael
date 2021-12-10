<template>
    <div id="feed">
    
        <createPost/>
    
        <post v-for="message in messages" v-bind:key="message.id" :message="message" @infosMessage="messageInfos"/>
    
    </div>
</template>

<script>
import axios from "axios";
import createPost from "../components/createPost.vue";
import post from "../components/post.vue";
export default {
    name: 'feed',
    components: {
        createPost,
        post

    },
    data() {
        return {
            message: {
                id: '',
                title: '',
                content: '',
                attachment: ''
            },
            messages: [],
        };
    },
    methods: {
        messageInfos(payload) {
            this.message = payload.message;
        }
    },
    mounted() {
        axios.get("http://localhost:3000/api/messages", {
                headers: {
                    authorization: "Bearer " + localStorage.getItem("userToken")
                }
            })
            .then(res => {
                this.messages = res.data;
                console.log("Publications", this.messages);
                

            })
            .catch(err => console.log(`Impossible d'afficher les publications` + err))
        this.$store.dispatch("getUserProfile");

    }
};
</script>

<style lang="scss">

</style>