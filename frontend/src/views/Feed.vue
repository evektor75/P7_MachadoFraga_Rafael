<template>
    <div id="feed">
       <createPost/>
        <div class="secondContainer mx-auto">
            <h1 class="text-center fil">Fil d'actualité</h1>
            <post v-for="message in messages" v-bind:key="message.id" :message="message"/>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import createPost from "../components/createPost";
import post from "../components/post";


export default {
    name: 'feed',
    components:{
        post,
        createPost
    },
    data() {
        return {
            message: {
                title: "",
                content: "",
                selectedFile: ""
            },
            msgError:"",
            messages: [],
             
        }
    },
    computed: {
        ...mapState(["user"])
    },

    mounted() {
        //Recuperation des messages
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

    },

};
</script>

<style lang="scss">
@import '../assets/_variable.scss';
//Section Création Publication
.alreadySelected{
    border: 1px solid green!important;
    color:black!important;
}

#msgError{
    color:#FFC312;
    margin-top:10px !important;
}

//

//Post
body {
    font-family: 'Numans' !important;
    color: white !important;
}

.card {
    margin-top: 3em !important;
    min-height:370px!important;
    height:auto!important;
}
.card-img{
    text-align:center;
    max-height:250px!important;
}
.urlAttachment{
    object-fit:cover;
}

.fil {
    margin-top: 25px;
}
//

//section commentaire
.content_like {
    cursor:pointer;
}
.content_comment{
    cursor:pointer;
}
#commentSection {
    min-width: 85%;
    max-height: 40px;
}

.comment {
    padding-left: 0 !important;
    margin-top: 5px;
}

.trash {
    position: absolute;
    right: 15px;
    size: 1.2em;
}
.redBorder{
    border:1px solid red!important;
}
</style>