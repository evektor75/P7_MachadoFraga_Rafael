<template>
    <div class="container">
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
						<input id="surname" type="text" class="form-control" placeholder="Nom de famille">
					</div>
                    <div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><font-awesome-icon :icon="['fas','font']"/></span>
						</div>
						<input id="name" type="text" class="form-control" placeholder="Prénom">
					</div>
					<div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-user"></i></span>
						</div>
						<input id="email" type="email" class="form-control" placeholder="utilisateur@groupomania.com">
						
					</div>
					<div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-key"></i></span>
						</div>
						<input id="password" type="password" class="form-control" placeholder="Mot de passe">
					</div>
                    <div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-key"></i></span>
						</div>
						<input id="confirmPassword" type="password" class="form-control" placeholder="Vérification du mot de passe">
					</div>
					<div class="form-group">
						<input type="submit" value="S'inscrire" class="btn float-right login_btn">
					</div>
				</form>
			</div>
		</div>
	</div>
</div>  
</template>

<script>

export default {
   name: "signup"
}
</script>

<style>
.card{
    height:100%;
}
.return{
    position: absolute;
    left: 15px;
    top: 15px;
    width: 1.5em;
    height: 1.5em;
    
}
.return i{
    size: 1.5rem;
}

</style>