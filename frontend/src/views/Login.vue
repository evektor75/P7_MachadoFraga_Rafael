<template>
	<div class="container">
		<div class="d-flex justify-content-center h-100">
			<div class="card">
				<div class="card-header">
					<h3>Se connecter</h3>
					<div class="d-flex justify-content-end social_icon">
						<span><i class="fab fa-facebook-square"></i></span>
						<span><i class="fab fa-google-plus-square"></i></span>
						<span><i class="fab fa-twitter-square"></i></span>
					</div>
				</div>
				<div class="card-body">
					<form>
						<div class="input-group form-group">
							<div class="input-group-prepend">
								<span class="input-group-text"><i class="fas fa-user"></i></span>
							</div>
							<input id="email" type="email" class="form-control selected" v-model="login.email" placeholder="utilisateur@groupomania.com">
						</div>
						<div class="input-group form-group">
							<div class="input-group-prepend">
								<span class="input-group-text"><i class="fas fa-key"></i></span>
							</div>
							<input id="password" type="password" v-model="login.password" class="form-control selectedbis" placeholder="Mot de passe">
						</div>
						<div class="form-group">
							<input type="submit" @click.prevent="sendLogin" value="Connexion" class="btn float-right login_btn">
						</div>
						<div class="text-center error" v-if="msg !== null">
						{{msg}}
						{{msgError}}
						</div>
					</form>
				</div>
				<div class="card-footer">
					<div class="d-flex justify-content-center links">
						Vous n'avez pas encore de compte?
						<router-link to="/signup">S'inscrire</router-link>
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
	name: "Login",
	data() {
		return {
			login: {
				email: null,
				password: null
			},
			msg: '',
			msgError:''
		};
	},
	computed: {
		...mapState(['user'])
	},
	methods: {
		sendLogin() {
			if (this.login.email !== null && this.login.password !== null) {
				axios.post("http://localhost:3000/api/auth/login", this.login)
					.then(res => {
						localStorage.setItem('userToken', res.data.token);
						this.$router.push('/feed');
						
					})
					.catch(e => {
						console.log('Connexion impossible ! ' + e.response.status);
						if(e.response.status == 403){
						this.msgError = 'La combinaison adresse email / mot de passe est incorrecte';
						let selected = document.querySelector('.selected');
						let selectedbis = document.querySelector('.selectedbis')
						selected.classList.add('inputError');
						selectedbis.classList.add('inputError');
						}
						if(e.response.status == 404){
							this.msgError = `L'adresse email n'existe pas `;
							let selected = document.querySelector('.selected');
							selected.classList.add('inputError');

						}
						if(e.response.status == 429){
							alert(`Trop de tentatives, l'accès est bloqué pendant 5min`);
						}
						

					})
			} else {
				this.msg = "Paramètre invalide";
			}
		},
	
	}
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Numans');
@import '../assets/_variable.scss';
html,
body {
	background-color: #FFAE9D !important;
	opacity: 0.85;
	background-size: cover;
	background-repeat: no-repeat;
	height: 100%;
	font-family: 'Numans', sans-serif;
}

.container {
	height: 100%;
	align-content: center;
}

.card {
	height: 370px;
	margin-top: 45%;
	width: 400px;
	background-color: rgba(0, 0, 0, 0.5) !important;
}

.social_icon span {
	font-size: 60px;
	margin-left: 10px;
	color: #FFC312;
}

.social_icon span:hover {
	color: white;
	cursor: pointer;
}

.card-header h3 {
	color: white;
}

.social_icon {
	position: absolute;
	right: 20px;
	top: -45px;
}

.input-group-prepend span {
	width: 50px;
	background-color: #FFC312;
	color: black;
	border: 0 !important;
}

input:focus {
	outline: 0 0 0 0 !important;
	box-shadow: 0 0 0 0 !important;
}

.remember {
	color: white;
}

.remember input {
	width: 20px;
	height: 20px;
	margin-left: 15px;
	margin-right: 5px;
}

.login_btn {
	color: black;
	background-color: #FFC312;
	width: 100px;
}

.login_btn:hover {
	color: black;
	background-color: white;
}

.links {
	color: white;
}

.links a {
	margin-left: 4px;
}
.inputError{
	border: 1px solid red!important;
}
.error {
	color:#FFC312;
	font-size:1.1em;
	font-weight:bold;
	margin-top:65px!important;
}

@media all and (min-width: 992px) {
	.container {
		max-width: 720px !important;
	}
}

@media all and (max-width:400px){
	.card-footer{
		font-size:0.8em;
	}
}
</style>