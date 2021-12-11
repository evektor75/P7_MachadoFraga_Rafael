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
                <div class="mt-2 mr-2 comment_name">Nom</div>
                <div class="mt-2 ml-2 comment_commentary">Commentaire</div>
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
					if(res) {
						window.location.reload();
					}
				})
				.catch( err => this.msgError = err)
			}
		}, 
        onFilechange(content){
            this.message.attachement = content.target.files[0];
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