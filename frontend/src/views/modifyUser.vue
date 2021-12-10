<template>
<div id="modifyUser" v-if="user.token !== null">
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
    <button type="submit" class="btn btn-danger deleteAccount" @click.prevent="deleteAccount">Supprimer votre compte</button>
  </div>
</form>
</div>
<div id='userNotConnected' v-else>
  <router-link to="/">
  <h1 class="text-center alertUser">Veuillez vous connecter dans un premier temps !
  <font-awesome-icon :icon="['fas','id-card']"/></h1>
  </router-link>
</div>

</template>

<script>
//import axios from "axios";
import { mapState } from "vuex";
import axios from 'axios';

export default {
    name: "modifyUser",
    computed: {
      ...mapState(["user"])
    },
    methods:{
        deleteAccount() {
          if( confirm("Voulez-vous supprimer votre compte?")) {
            axios.delete('http://localhost:3000/api/auth/compte/delete', {
             headers: {
                    authorization: "Bearer " + localStorage.getItem('userToken')
              }
              })
              .then( () => {
              console.log('compte supprimé');
              localStorage.clear();
              location.replace(location.origin);
              this.$router.push('/');
              })
              .catch( err => {
                console.log('impossible de supprimer le compte' + err);
              })
                } else {
                  console.log('compte non supprimé')
                }
          
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Numans');
@import '../assets/_variable.scss';

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
.alertUser{
  color: black;
  font-weight:bold;
  padding-top:25%;
  background-color: $background-color!important;
  font-family: 'Numans', sans-serif;
}

</style>
