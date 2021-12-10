<template>
	<div class="container">
		<div class="return">
			<router-link to="/"><font-awesome-icon class="returnLogo" :icon="['fas','chevron-left']"/></router-link>
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
	
							<input id="username" type="text" class="form-control" v-model="signup.username" placeholder="Pseudo">
	
						</div>
	
						<div class="input-group form-group">
	
							<div class="input-group-prepend">
	
								<span class="input-group-text"><i class="fas fa-user"></i></span>
	
							</div>
	
							<input id="email" type="email" class="form-control" v-model="signup.email" placeholder="utilisateur@groupomania.com">
	
	
	
						</div>
	
						<div class="input-group form-group">
	
							<div class="input-group-prepend">
	
								<span class="input-group-text"><font-awesome-icon :icon="['fas','font']"/></span>
	
							</div>
	
							<input id="bio" type="text" class="form-control" v-model="signup.bio" placeholder="Bio">
	
						</div>
	
						<div class="input-group form-group">
	
							<div class="input-group-prepend">
	
								<span class="input-group-text"><i class="fas fa-key"></i></span>
	
							</div>
	
							<input id="password" type="password" v-model="signup.password" class="form-control" placeholder="Mot de passe">
	
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
				username: '',
				email: '',
				password: '',
				bio: ''
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
			//const bioRegex = /^([a-z]|[A-Z]|[0-9,;.]){4,8}$/;
			
			//Infos saisies
			const password = this.signup.password;
			const email = this.signup.email;
			//const bio = this.signup.bio;
			const username = this.signup.username;

			console.log(this.signup.password);
			console.log(this.signup.username);
			console.log(this.signup.email);
			console.log(this.signup.bio);

			
			if (
				(email !== null || username !== null || password !== null)
			) 
				{
					if( regexEmail.test(email) && regexPassword.test(password)) {
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
					.catch(err => console.log(err));
				} else {
					console.log("impossible d'effectuer les regex")
				}
				
			} else {
					console.log(" Un problème est survenue avec vos saisies" );

				
			}

		}
	}
};
</script>

<style>
.card {
	height: 100%;
}

.return {
	position: absolute;
	left: 35px;
	top: 85px;
	width: 1.5em;
	height: 1.5em;
	
}

.returnLogo {
	font-size: 1.8rem;
	color:black;
}
</style>