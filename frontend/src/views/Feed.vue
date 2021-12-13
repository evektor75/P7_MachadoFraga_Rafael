<template>
    <div id="feed">
    <div class="container">
	<div class="d-flex justify-content-center h-100">
		<div class="card">
			<div class="card-header text-center">
				<h3>Créer une publication</h3>
			</div>
			<div class="card-body">
				<form  action="/new" method="post">
					<div class="form-group">
						<label for="title">Titre</label>
						<input id="title" type="text" class="form-control" v-model="message.title">
					</div>
                    <div class="input-group form-group">
						<label for="post">Quoi de neuf ?</label>
						<input id="post" type="text" class="form-control" v-model="message.content">
					</div>

                    <div class="input-group">
						<input id="file" type="file" class="custom-file-input" @change="onFilechange">
                        <label class="custom-file-label" for="file"></label>
					</div>
					<div class="form-group">
						<input type="submit" value="Publier" class="btn float-right login_btn publish_btn" @click.prevent="createPost">
						<span id='msgReturnAPI' class="mx-3 text-danger" v-if="user.token==null">Veuillez vous connecter</span> 
					</div>
				</form>
			</div>
		</div>
	</div>
</div> 

<div class="secondContainer mx-auto">
    <h1 class="text-center fil">Fil d'actualité</h1>
    <ul id="messageSection">
        <li v-for="item in messages" :key="item.id">
        <div class="card mb-4 w-75 mx-auto post">
        <div class="card-header d-flex justify-content-between">
        <div class="card-header_name">De <span class="authorPost"> {{item.User.username}} </span> le <span class="dayPost"> {{item.createdAt.split('T')[0]}}</span> à <span class="timePost"> {{item.createdAt.split('T')[1]}} </span></div>
        <div class="card-header_dot" v-if="user.isAdmin == true || user.username == item.User.username"><router-link to="/feed/modifypost"><font-awesome-icon :icon="['fas','bars']"/></router-link></div>
        </div>
        <div class="card-body">
            <h5 class="card-title">{{item.title}}</h5>
                <p class="card-text" v-if="item.content !== 'null'"> {{item.content}}</p>
        <div class="card-img mx-auto" v-if="item.attachement">
             <img :src="item.attachement" alt="..." class="urlAttachment"/>
        </div>
        </div>
        <div class="card-footer">
            <div class="d-flex justify-content-between align-items-center content">
              <div class="mr-3 content_like"><font-awesome-icon :icon="['fas','thumbs-up']" class="mr-1"/>Like</div>
              <div class="mr-3 content_comment"><font-awesome-icon :icon="['fas','comment']" class="mr-1"/>Commenter</div>
            </div>
        <div class="content_border"></div>
            <div class="comment d-flex ">
                <textarea type="text" id="commentSection" class="form-control" placeholder="Ecrivez votre commentaire" v-model="dataComment.content"></textarea>
                <button type="submit" class="btn btn-primary" @click.prevent="createComment(item.id)" value="Commenter"></button>
                <div class="thirdContainer">
                    <ul>
                    <li v-for="comment in item.Comments" :key="comment.id">
                        <div class="mt-2 mr-2 comment_name">{{comment.User.username}}</div>
                        <div class="mt-2 ml-2 comment_commentary">{{comment.content}}</div>
                            <div class="moderationComment" v-if="user.id==comment.userId || user.isAdmin==true">
                                <button @click.prevent="deleteComment(comment.id, comment.userId)" type="submit" class="btn btn-primary"></button>
                                <font-awesome-icon :icon="['fas','trash']"/>
                            </div>
                    </li>
                    </ul>

                    
                </div>
                
        </div>
        </div>
        </div>
        </li>
    </ul>
  
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
                attachment: null
            },
            dataComment:{
                content: null
            },
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
			fd.append("title",this.message.title);
			fd.append("content", this.message.content);
			fd.append("file", this.message.attachment);
			console.log('Vérification de la récupération', fd.get('title'));
			console.log('Vérification de la récupération', fd.get('content'));
			console.log('Verifiaction de la récupération', fd.get('file'));
			
			if( fd.get("file") == "null" && fd.get('content') == 'null' && fd.get('title') == "null") {
				alert('Impossible de publier, vérifier votre publicaiton');
			} else {
				axios.post("http://localhost:3000/api/messages/new", fd, {
					headers: {
						authorization: "Bearer " + window.localStorage.getItem("userToken")
					}
				})
				.then( res => {
                    console.log(res); 
				})
				.catch( err => this.msgError = err)
			}
		}, 
        onFilechange(content){
            this.message.attachement = content.target.files[0];
        },

        //création commentaire
        createComment(messageId) {
            if(this.dataComment.comment !==null) {
                console.log(this.dataComment)
                axios.post("http://localhost:3000/api/messages/:messageId/comment",
                {
                    content: this.dataComment.content,
                    messageId: messageId
                },
                {
                    headers: {
						authorization: "Bearer " + window.localStorage.getItem("userToken")
				}
                }
                )
                .then( res => {
                    console.log(res);
                })
                .catch(err => console.log(err))
            }
        },

        //Suppression du commentaire
        deleteComment(id, userIdOrder) {
            if(window.confirm("Êtes vous sur de vouloir supprimer ce commentaire ?"))
            axios.delete("http://localhost:3000/api/messages/:messageId/comment/:id", {
                data: userIdOrder
            },
            {
                headers: {
						authorization: "Bearer " + window.localStorage.getItem("userToken")
				}
            }
            
            )
            .then( res => console.log(res))
            .catch(err => console.log(err))
        }
    },
};
</script>

<style lang="scss">
@import '../assets/_variable.scss';
li  {
    list-style:none;
}
body{
    font-family:'Numans'!important;
    color:white!important;
}
.card{
    margin-top:3em!important;
}
.fil{
    margin-top:25px;
}
</style>