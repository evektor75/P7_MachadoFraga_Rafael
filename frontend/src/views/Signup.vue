<template>
	<div class="container">
		<div class="return">
			<router-link to="/login"><font-awesome-icon class="returnLogo" :icon="['fas','chevron-left']"/></router-link>
		</div>
		<div class="d-flex justify-content-center h-100">
			<div class="card">
				<div class="card-header">
					<h3>S'inscrire</h3>
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
								<span class="input-group-text"><font-awesome-icon :icon="['fas','font']"/></span>
							</div>
							<input id="username" type="text" class="form-control" v-model="signup.username" placeholder="Pseudo *" required>
						</div>
						<p class="remove_username text-center font-weight-bold">Pas de caractère spéciaux !</p>
						<div class="input-group form-group">
							<div class="input-group-prepend">
								<span class="input-group-text"><i class="fas fa-user"></i></span>
							</div>
							<input id="email" type="email" class="form-control" v-model="signup.email" placeholder="utilisateur@groupomania.com *" required>
						</div>
						<p class="remove_email labelStyle text-center font-weight-bold">Veuillez saisir une adresse email valide</p>
						<div class="input-group form-group">
							<div class="input-group-prepend">
								<span class="input-group-text"><font-awesome-icon :icon="['fas','font']"/></span>
							</div>
							<input id="bio" type="text" class="form-control" v-model="signup.bio" placeholder="Bio">
						</div>
						<p class="remove_bio labelStyle text-center font-weight-bold">Pas de caractère spéciaux !</p>
						<div class="input-group form-group">
							<div class="input-group-prepend">
								<span class="input-group-text"><i class="fas fa-key"></i></span>
							</div>
							<input id="password" type="password" v-model="signup.password" class="form-control" placeholder="Mot de passe *" required>
						</div>
						<p class="remove_password labelStyle text-center font-weight-bold">Le mot de passe doit contenir au moins 8 caractères dont 1 chiffre, une lettre et un caractère spécial</p>
						<div class="requiredInput text-center">
							<p>* : Champ obligatoire</p>
						</div>
						<div class="form-group">
							<input @click.prevent="sendSignup" type="submit" value="S'inscrire" class="btn float-right login_btn">
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
	name: "signup",
	data() {
		return {
			signup: {
				username: null,
				email: null,
				password: null,
				bio: null
			},
			msg: ""
		};
	},
	computed: {
		...mapState(["user"])
	},
	methods: {
		sendSignup() {
			const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
			const regexEmail = /^[a-z0-9!#$ %& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
			const bioRegex = /^[a-zA-Z0-9 ]*$/;
			
			//Infos saisies
			const password = this.signup.password;
			const email = this.signup.email;
			const bio = this.signup.bio;
			const username = this.signup.username;

			console.log(this.signup.password);
			console.log(this.signup.username);
			console.log(this.signup.email);
			console.log(this.signup.bio);

			
			if (
				(email !== null || username !== null || password !== null)
			) 
				{
					if( regexEmail.test(email) && regexPassword.test(password) && bioRegex.test(bio) && bioRegex.test(username)) {
					axios.post("http://localhost:3000/api/auth/signup", this.signup)
					.then(res => {
						console.log(res);
						axios.post("http://localhost:3000/api/auth/login", this.signup)
						.then(res => {
						localStorage.setItem('userToken', res.data.token);
						this.$router.push('/feed');
						
					})
					.catch(err => {
						console.log('Connexion impossible ! ' + err);
					})
						//on réinitialise les saisies
						this.signup.email = null;
						this.signup.username = null;
						this.signup.bio = null;
						this.signup.password = null;
						

					})
					.catch(err => {
						if(err.response.status == 501){
							alert('Adresse email existante');
							let inputEmail = document.querySelector('#email');
							inputEmail.classList.add('redBorder');
						}
							

						if(err.response.status == 400){
							alert('Username existant');
							let inputUsername = document.querySelector('#username');
							inputUsername.classList.add('redBorder');
						}
						
					});
				} else {
					console.log("impossible d'effectuer les regex")
					if(!regexEmail.test(email)){
						let selectedEmail = document.querySelector('.remove_email');
						let inputEmail = document.querySelector('#email');
						selectedEmail.classList.remove('remove_email');
						inputEmail.classList.add('redBorder');
					}
					if(!regexPassword.test(password)){
						let selectedPassword = document.querySelector('.remove_password');
						let inputPassword = document.querySelector('#password');
						selectedPassword.classList.remove('remove_password');
						inputPassword.classList.add('redBorder');
					}
					if(!bioRegex.test(bio)){
						let selectedBio = document.querySelector('.remove_bio');
						let inputBio = document.querySelector('#bio');
						selectedBio.classList.remove('remove_bio');
						inputBio.classList.add('redBorder');
					}
					if(!bioRegex.test(username)){
						let selectedUsername = document.querySelector('.remove_username');
						let inputUsername = document.querySelector('#username');
						selectedUsername.classList.remove('remove_username');
						inputUsername.classList.add('redBorder');
					}

				}
				
			} else {
					console.log(" Un problème est survenue avec vos saisies" );
					alert('Veuillez remplir les champs ! ');

				
			}

		}
	}
};
</script>

<style lang="scss">
.card {
	height: auto!important;
	background-color: rgba(0, 0, 0, 0.5) !important;
}

.return {
	margin-top:25px;
	width: 1.5em;
	height: 1.5em;
	
}

.returnLogo {
	font-size: 1.8rem;
	color:black;
}
.remove {
	&_username {
		display:none;
	}
	&_email {
		display:none
	}
	&_bio {
		display:none;
	}
	&_password {
		display:none;
	}
}

.labelStyle{
	color:#FFC312!important;

}
.redBorder {
	border: 1px solid red!important;
}
.requiredInput {
	color:white!important;
}
.card-body{
	padding-top:5px!important;
}
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