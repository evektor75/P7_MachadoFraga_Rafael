<template>
    <div class="card mb-4 w-75 mx-auto post">
        <div class="card-header d-flex justify-content-between">
            <div class="card-header_name">De <span class="authorPost"> {{message.User.username}} </span> le <span class="dayPost"> {{message.createdAt.split('T')[0]}}</span> à <span class="timePost"> {{message.createdAt.slice(11,16)}} </span></div>
            <div class="card-header_dot" v-if="users.user.id == message.userId || users.user.isAdmin">
                <router-link to="/feed/modifypost">
                    <font-awesome-icon :icon="['fas','trash']"/>
                </router-link>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title font-weight-bold text-center">{{message.title}}</h5>
            <p class="card-text" v-if="message.content !== 'null'"> {{message.content}}</p>
            <div class="card-img mx-auto px-auto" v-if="message.attachment">
                <img :src="message.attachment" alt="..." class="urlAttachment" />
            </div>
        </div>
        <div class="card-footer">
            <div class="d-flex justify-content-between align-items-center content">
                <div class="mr-3 content_like"  @click.prevent="createLike(message.id)">
                    <font-awesome-icon :icon="['fas','thumbs-up']" class="mr-1"/>Like</div>
                <div class="mr-3 content_comment" v-on:click="commentSection">
                    <font-awesome-icon :icon="['fas','comment']" class="mr-1" />Commenter</div>
            </div>
            <div class="likeNumber mb-2" v-if="message.Likes.length > 1 ">{{message.Likes.length}} personnes ont aimé <font-awesome-icon :icon="['fas','heart']"/></div>
            <div class="likeNumber mb-2" v-if="message.Likes.length == 1">{{message.Likes.length}} personne a aimé <font-awesome-icon :icon="['fas','heart']"/></div>
            <div class="content_border"></div>
            <div class="comment mt-2">
                <div class="createComment d-flex">
                    <textarea type="text" id="commentSection" class="form-control inputComment" v-model="dataComment.content" placeholder="Ecrivez votre commentaire ..."></textarea>
                    <button type="submit" class="btn btn-primary" value="Commenter" @click.prevent="createComment(message.id)"><font-awesome-icon :icon="['fas','plus']" /></button>
                </div>
                <div id="sectionComment" v-show="commentVisibility">
                    <div class="comment d-flex" v-for="comment in message.Comments" :key="comment.id">
                            <div class="boxComment">
                                <div class="mt-2 mr-2 comment_name ml-1"><u>{{comment.User.username}}</u></div>
                                <div class="mt-2 ml-2 comment_commentary ml-2">{{comment.content}}</div>
                            </div>
                            <div class="moderationComment" v-if="user.isAdmin ==true">
                                <font-awesome-icon :icon="['fas','trash']" class="trash" @click.prevent="deleteComment(comment.id, comment.userId)"/>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from "axios";
import { mapState } from "vuex";


export default {
    name :"post",
    data() {
        return {
            commentVisibility: false,
            dataComment: {
                content: null
            },
            users:[]
        }
    },
    computed: {
        ...mapState(["user"])
    },
    props:{
        message:{
            type: Object,
            required: true
        }
    },
    mounted() {
        
        //Recuperation de l'utilisateur
        axios.get("http://localhost:3000/api/auth/compte", {
                headers: {
                    authorization: "Bearer " + localStorage.getItem('userToken')
                }
            })
            .then(res => {
                this.users = res.data;
                console.log('Utilisateur', this.users);
            })
            .catch(err => console.log(err))
    },
   
    methods: {
        //création commentaire
        createComment(messageId) {
            const bioRegex = /^[a-zA-Z0-9 ]*$/;
            const comment = this.dataComment.content;
            if (comment !== null) {
                 if(bioRegex.test(comment)){    
                     console.log('Voici ce qui est renvoyé' + this.dataComment)
                        axios.post("http://localhost:3000/api/messages/comment", {
                        content: this.dataComment.content,
                        messageId: messageId
                    }, {
                        headers: {
                            authorization: "Bearer " + window.localStorage.getItem("userToken")
                        }
                    })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => console.log(err))
            } else {
                alert('Caractères spéciaux interdits ! ');
            }
                
            } else {
                alert('Veuillez entrer un commentaire');
                let inputComment = document.querySelector('.inputComment');
                inputComment.classList.add('redBorder');

            }
        },

        //Suppression du commentaire
        deleteComment(id, userIdOrder) {
            if (window.confirm("Êtes vous sur de vouloir supprimer ce commentaire ?"))
                axios.delete("http://localhost:3000/api/messages/comment/"+id, {
                        data: {userIdOrder}, 
                        headers: {
                            authorization: "Bearer " + window.localStorage.getItem("userToken")
                        }
                    })
                .then(res => {
                    console.log('Message liké' + res);
                }
                )
                .catch(err => console.log(`il s'agit d'une erreur de type ` + err))
        },
        commentSection(){
            if(this.commentVisibility)
                this.commentVisibility = false;
            else
                this.commentVisibility = true;  
        },

        //Création du like
        createLike(messageId) {
            axios.post("http://localhost:3000/api/messages/like", {
                        messageId: messageId
                    }, {
                        headers: {
                            authorization: "Bearer " + window.localStorage.getItem("userToken")
                        }
                    })
                    .then(res => console.log(res))
                    .catch(err => console.log('Impossible de liké' + err ));
        }
    }
}

</script>

<style lang="scss">
.post{
    margin-top:15px;
    max-width:560px!important;
}
.content{
    margin-top:auto;
    margin-bottom: 10px;
    &_like{
        width:50%;
        text-align:center;
    }
    &_comment{
        width:50%;
        text-align:center;
    }

}
.content_border{
    border-bottom:1px solid rgba(0,0,0,.125);
    padding:0!important;
  
}
.boxComment{
    border: 1px solid rgba(0,0,0,0.5);
    width:100%;
    border-radius:5px;
}
</style>