<template>
    <div id="feed">
        <div class="container">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header text-center">
                        <h3>Créer une publication</h3>
                    </div>
                    <div class="card-body">
                        <form action="/new" method="post">
                            <div class="form-group">
                                <label for="title">Titre</label>
                                <input id="title" type="text" class="form-control" v-model="message.title">
                            </div>
                            <div class="input-group form-group">
                                <label for="post" class="mr-1 mt-2">Quoi de neuf ? </label>
                                <input id="post" type="text" class="form-control" v-model="message.content">
                            </div>
                            <div class="input-group">
                                <input id="file" type="file" class="custom-file-input" @change="onFilechange">
                                <label class="custom-file-label upload" for="file"></label>
                            </div>
                            <div class="form-group">
                                <input type="submit" value="Publier" class="btn float-right login_btn publish_btn mt-4" @click.prevent="createPost">
                                <div id="msgError">{{msgError}}</div>
                                <span id='msgReturnAPI' class="mx-3 text-danger" v-if="user.token==null">Veuillez vous connecter</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="secondContainer mx-auto">
            <h1 class="text-center fil">Fil d'actualité</h1>
            
            <div id="messageSection" v-for="item in messages" :key="item.id">
                    <div class="card mb-4 w-75 mx-auto post">
                        <div class="card-header d-flex justify-content-between">
                            <div class="card-header_name">De <span class="authorPost"> {{item.User.username}} </span> le <span class="dayPost"> {{item.createdAt.split('T')[0]}}</span> à <span class="timePost"> {{item.createdAt.split('T')[1]}} </span></div>
                            <div class="card-header_dot" v-if="user.isAdmin==true || user.userId==item.userId">
                                <router-link to="/feed/modifypost">
                                    <font-awesome-icon :icon="['fas','trash']"/>
                                </router-link>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold text-center">{{item.title}}</h5>
                            <p class="card-text" v-if="item.content !== 'null'"> {{item.content}}</p>
                            <div class="card-img mx-auto px-auto" v-if="item.attachment">
                                <img :src="item.attachment" alt="..." class="urlAttachment" />
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between align-items-center content">
                                <div class="mr-3 content_like">
                                    <font-awesome-icon :icon="['fas','thumbs-up']" class="mr-1" />Like</div>
                                <div class="mr-3 content_comment" data-toggle="collapse" data-target=".displayComments" aria-expanded="true" aria-controls="displayComments">
                                    <font-awesome-icon :icon="['fas','comment']" class="mr-1" />Commenter</div>
                            </div>
                            <div class="content_border"></div>
                            <div class="comment mt-2">
                                <div class="createComment d-flex">
                                    <textarea type="text" id="commentSection" class="form-control" v-model="dataComment.content" placeholder="Ecrivez votre commentaire ..."></textarea>
                                    <button type="submit" class="btn btn-primary" value="Commenter" @click.prevent="createComment(item.id)"><font-awesome-icon :icon="['fas','plus']" /></button>
                                </div>
                                <div class="displayComments">
                                    <div class="comment d-flex" v-for="comment in item.Comments" :key="comment.id">
                                            <div class="mt-2 mr-2 comment_name"></div>
                                            <div class="mt-2 ml-2 comment_commentary">{{comment.content}}</div>
                                            <div class="moderationComment" v-if="user.isAdmin ==true">
                                                <font-awesome-icon :icon="['fas','trash']" class="trash" @click.prevent="deleteComment(comment.id, comment.userId)"/>
                                            </div>
                                    </div>
                                </div>
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
    name: 'feed',
    data() {
        return {
            message: {
                title: null,
                content: null,
                selectedFile: null
            },
            dataComment: {
                content: null
            },
            msgError:"",
            messages: [],
        };
    },
    computed: {
        ...mapState(["user"])
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

    },
    methods: {
        createPost() {
            const fd = new FormData();
            fd.append("title", this.message.title);
            fd.append("content", this.message.content);
            fd.append("file", this.message.selectedFile);
            console.log('Vérification de la récupération', fd.get('title'));
            console.log('Vérification de la récupération', fd.get('content'));
            console.log('Verifiaction de la récupération', fd.get('file'));

            if (fd.get('content') == 'null' || fd.get('title') == "null") {
                alert('Impossible de publier, vérifier votre publicaiton');
            } else {
                axios.post("http://localhost:3000/api/messages/new", fd, {
                        headers: {
                            authorization: "Bearer " + window.localStorage.getItem("userToken")
                        }
                    })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(() => this.msgError = 'Vérifier votre saisi ...')
            }
        },
        onFilechange(content) {
            this.message.selectedFile = content.target.files[0];
            let selected = document.querySelector('.upload');
            selected.innerHTML = ' 1 fichier uploadé';
            selected.classList.add('alreadySelected');
            console.log(this.message.selectedFile);
        },

        //création commentaire
        createComment(messageId) {
            if (this.dataComment.comment !== null) {
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
                    console.log(res);
                }
                )
                .catch(err => console.log(`il s'agit d'une erreur de type ` + err))
        }
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
</style>