<template>
<div id="modifyUser">
<div class="title">
  <h1 class="text-center"> <i class="fas fa-user"></i> Modifier vos informations personnelles</h1>
</div>
<form>
  <div class="mb-3">
    <label for="modifyEmail" class="form-label">Adresse mail</label>
    <textarea class="form-control" id="modifyEmail" type="email" v-model="user.email"> </textarea>
    <div id="emailHelp" class="form-text" rows='1'></div>
  </div>
  <div class="mb-3">
    <label for="modifyPassword" class="form-label">Mot de passe</label>
    <textarea class="form-control" id="modifyPassword" type="password"> *********</textarea>
    <div id="passwordHelp" class="form-text"> Doit contenir au moins 8 caractères dont 1 chiffre, une lettre et un caractère spécial</div>
  </div>
  <div class="mb-3">
    <label for="modifyUsername" class="form-label">Username</label>
    <textarea class="form-control" id="modifyUsername" type="text" v-model="user.username"> </textarea>
    <div id="usernameHelp" class="form-text"> Le pseudo doit etre compris entre 5 et 15 caractères</div>
  </div>
  <div class="mb-3">
    <label for="modifyBio" class="form-label">Bio</label>
    <textarea class="form-control" id="modifyBio" type="text" v-model="user.bio"></textarea>
  </div>
  <div class="buttonSection d-flex justify-content-between">
    <button type="submit" class="btn btn-primary updateAccount">Modifier</button>
    <button type="submit" class="btn btn-danger deleteAccount">Supprimer votre compte</button>
  </div>
</form>
</div>

</template>

<script>
//import axios from "axios";
import { mapState } from "vuex";

export default {
    name: "modifyUser",
    computed: {
      ...mapState(["user"])
    },
    methods:{
     
    }
}
</script>

<style lang="scss">

.title h1 {
  font-size:2em;
  margin-top: 15px;
  margin-bottom: 15px;
  & i {
    margin-right:10px;
  }
}

textarea {
  height:38px!important;
  resize:none;
}

.deleteAccount{
border: 1px solid red;
}

</style>
