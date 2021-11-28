<template>
 <div class="container">
	<div class="d-flex justify-content-center h-100">
		<div class="card">
			<div class="card-header text-center">
				<h3>Créer une publication</h3>
			</div>
			<div class="card-body">
				<form>
                    <div class="input-group form-group">
						<input id="post" type="text" class="form-control" placeholder="Quoi de neuf ?">
					</div>

                    <div class="input-group">
						<input id="file" type="file" class="custom-file-input" >
                        <label class="custom-file-label" for="file">Fichier</label>
					</div>
					<div class="form-group">
						<input type="submit" value="Publier" class="btn float-right login_btn publish_btn">
					</div>
				</form>
			</div>
		</div>
	</div>
</div> 
</template>

<script>
export default {
    name: "createPost"
}
</script>

<style lang="scss">
.publish_btn{
	margin-top:10px!important;
}
</style>