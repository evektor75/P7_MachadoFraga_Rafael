<template>
    <div class="card mb-4 w-75 mx-auto post">
        <div class="card-header d-flex justify-content-between">
            <div class="card-header_name">De <span class="authorPost"> {{message.User.username}} </span> le <span class="dayPost"> {{message.createdAt.split('T')[0]}}</span> à <span class="timePost"> {{message.createdAt.slice(11,16)}} </span></div>
            <div class="card-header_dot" v-if="users.user.id == message.userId || users.user.isAdmin">
                <font-awesome-icon :icon="['fas','trash']" @click.prevent="deleteMessage(message.id, message.userId)" />
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
                <div class="mr-3 content_like" @click.prevent="createLike(message.id)">
                        <font-awesome-icon :icon="['fas','heart']" class="mr-1"  v-bind:class="likedClass" />
                    Like
                </div>
                <div class="mr-3 content_comment" v-on:click="commentSection">
                    <font-awesome-icon :icon="['fas','comment']" class="mr-1" />Commenter <br><small v-if="message.Comments.length >= 1">Il y a {{message.Comments.length}} commentaire(s)</small></div>
            </div>
            <div class="likeNumber mb-2" v-if="message.Likes.length > 1 ">{{message.Likes.length}} personnes ont aimé
                <font-awesome-icon :icon="['fas','heart']" />
            </div>
            <div class="likeNumber mb-2" v-if="message.Likes.length == 1">{{message.Likes.length}} personne a aimé
                <font-awesome-icon :icon="['fas','heart']" />
            </div>
            <div class="content_border"></div>
            <div class="comment mt-2">
                <div class="createComment d-flex">
                    <textarea type="text" id="commentSection" class="form-control inputComment" v-model="dataComment.content" placeholder="Ecrivez votre commentaire ..."></textarea>
                    <button type="submit" class="btn btn-primary" value="Commenter" @click.prevent="createComment(message.id)"><font-awesome-icon :icon="['fas','plus']" /></button>
                </div>
                <div id="sectionComment" v-show="commentVisibility" class="mt-3">
                    <div class="comment d-flex" v-for="comment in message.Comments" :key="comment.id">
                        <div class="boxComment">
                            <div class="mt-2 mr-2 comment_name ml-1"><u>{{comment.User.username}}</u></div>
                            <div class="mt-2 ml-2 comment_commentary ml-2">{{comment.content}}</div>
                        </div>
                        <div class="moderationComment" v-if="users.user.isAdmin ==true">
                            <font-awesome-icon :icon="['fas','trash']" class="trash" @click.prevent="deleteComment(comment.id, comment.userId)" />
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
    name: "post",
    data() {
        return {
            commentVisibility: false,
            dataComment: {
                content: null
            },
            likedClass: 'alreadyLiked',
            unliked:'',
            users: { user: {id : 0}},
            likes: [],
        }
    },
    computed: {
        ...mapState(["user"])                       
    },
    props: {
        message: {
            title: String,
            content: String,
            attachment: String,
            Comments: Array,
            Likes: Array

        },
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
                console.log('Utilisateurs',this.users);
                if(this.message.Likes.some (e => e.userId == this.users.user.id)){
                    this.likedClass = 'alreadyLiked';
                } else {
                    this.likedClass = '';
                }
            })
            .catch(err => console.log(err))

        
    },

    methods: {
        //création commentaire
        createComment(messageId) {
            const bioRegex = /^[a-zA-Z0-9 ,.!?'éèàç]*$/;
            const comment = this.dataComment.content;
            if (comment !== null) {
                if (bioRegex.test(comment)) {
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
                            this.message.Comments.push({ User: {username: this.users.user.username}, content: this.dataComment.content, id: res.data.comment.id });
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
                axios.delete("http://localhost:3000/api/messages/comment/" + id, {
                    data: { userIdOrder },
                    headers: {
                        authorization: "Bearer " + window.localStorage.getItem("userToken")
                    }
                })
                .then(res => {
                    let comment = this.message.Comments;
                    this.message.Comments = comment.filter(function(value){ 
                     return value.id != id;
                    });
                    console.log('Commentaire supprimé' + res);
                })
                .catch(err => console.log(`il s'agit d'une erreur de type ` + err))
        },
        commentSection() {
            if (this.commentVisibility)
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
                .then(res => {
                    this.likes = res.data;
                    if(this.likes.response.createdAt){
                        console.log(res.data);
                        this.message.Likes.push({ userId: res.data.response.userId , messageId: res.data.response.messageId });
                        this.likedClass = 'alreadyLiked';
                    } else {
                        let id = this.users.user.id;
                        this.message.Likes = this.message.Likes.filter( function(value) {
                            return value.userId != id;
                        });
                        this.likedClass = '';
                    }

                    console.log(this.likes);
                })
                .catch(err => console.log('Impossible de liké ' + err));
        },

    
           
        

        //Suppression de la publication

        deleteMessage(id, userIdOrder) {
            if (window.confirm("Voulez vous vraiment supprimer cette publication ?")) {
                axios.delete("http://localhost:3000/api/messages/" + id, {
                        data: { userIdOrder },
                        headers: {
                            authorization: "Bearer " + window.localStorage.getItem("userToken")
                        }
                    })
                    .then(res => {
                        console.log('Message supprimé' + res);

                    })
                    .catch(err => console.log(`il s'agit d'une erreur de type ` + err))
            }
        },



    }
}
</script>

<style lang="scss">
.post {
    margin-top: 15px;
    max-width: 560px !important;
    min-width: 350px !important
}

.content {
    margin-top: auto;
    margin-bottom: 10px;
    &_like {
        width: 50%;
        text-align: center;
    }
    &_comment {
        width: 50%;
        text-align: center;
    }
}

.content_border {
    border-bottom: 1px solid rgba(0, 0, 0, .125);
    padding: 0 !important;
}

.boxComment {
    border: 1px solid rgba(0, 0, 0, 0.5);
    width: 100%;
    border-radius: 5px;
}

.alreadyLiked {
    color: #ed0000 !important;
}

svg {
    cursor: pointer;
}

.trash {
    margin-top: 1.5em;
    margin-right: 1.5em
}
</style>