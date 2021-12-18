<template>
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
                                <input id="title" type="text" class="form-control" v-model="contentMessage.title">
                            </div>
                            <div class="input-group form-group">
                                <label for="post" class="mr-1 mt-2">Quoi de neuf ? </label>
                                <input id="post" type="text" class="form-control" v-model="contentMessage.content">
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
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
    name: "createPost",
	data() {
		return {
			contentMessage: {
				title: null,
				content: null,
				attachment: null
			},
			msgError:"",
		};
	},
	computed: {
		...mapState(["user"])
	},
	methods: {
		createPost() {
            const fd = new FormData();
            fd.append("title", this.contentMessage.title);
            fd.append("content", this.contentMessage.content);
            fd.append("file", this.contentMessage.selectedFile);
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
            this.contentMessage.selectedFile = content.target.files[0];
            let selected = document.querySelector('.upload');
            selected.innerHTML = ' 1 fichier uploadé';
            selected.classList.add('alreadySelected');
            console.log(this.contentMessage.selectedFile);
        },

	}
}
</script>

<style lang="scss">
.publish_btn{
	margin-top:10px!important;
}
</style>