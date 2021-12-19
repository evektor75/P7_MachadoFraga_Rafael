<template>
    <div id="modifyUser" v-if="user.token !== null">
        <div class="title">
            <h1 class="text-center mt-4"> <i class="fas fa-user"></i>  Vos informations personnelles</h1>
        </div>
        <form>
            <div class="mb-3 ml-2 mr-2">
                <label for="modifyUsername" class="form-label"> Username</label>
                <p class="form-control"> {{users.user.username}} </p>
            </div>
            <div class="mb-3 ml-2 mr-2">
                <label for="modifyPassword" class="form-label">Mot de passe</label>
                <p class="form-control" id="modifyPassword" type="password"> *********</p>
            </div>
            <div class="mb-3 ml-2 mr-2">
                <label for="modifyEmail" class="form-label">Email</label>
                <p class="form-control" id="modifyEmail" type="text"> {{users.user.email}}</p>
            </div>
            <div class="mb-3 ml-2 mr-2" v-if="users.user.bio !== null">
                <label for="modifyBio" class="form-label">Bio</label>
                <p class="form-control" id="modifyBio" type="text"> {{users.user.bio}}</p>
            </div>
            <div class="mb-3 ml-2 mr-2" v-if="users.user.isAdmin !== false">
                <label for="modifyBio" class="form-label">Modérateur</label>
                <p class="form-control" id="modifyBio" type="text">Droit de modérateur</p>
            </div>
            <div class="buttonSection d-flex justify-content-between">
                <button type="submit" class="btn btn-danger deleteAccount mx-auto" @click.prevent="deleteAccount(users.user.id, users.user.id)">Supprimer votre compte</button>
            </div>
        </form>
    </div>
    <div id='userNotConnected' v-else>
        <router-link to="/login">
            <h1 class="text-center alertUser">Veuillez vous connecter dans un premier temps !
                <font-awesome-icon :icon="['fas','id-card']" />
            </h1>
        </router-link>
    </div>
</template>

<script>
//import axios from "axios";
import { mapState } from "vuex";
import axios from 'axios';

export default {
    name: "modifyUser",
    data() {
        return {
            users: []
        }
    },
    computed: {
        ...mapState(["user"])
    },
    mounted() {
        axios.get("http://localhost:3000/api/auth/compte", {
                headers: {
                    authorization: "Bearer " + localStorage.getItem('userToken')
                }
            })
            .then(res => {
                this.users = res.data;
                console.log(this.users);
            })
            .catch(err => console.log(err))
    },
    methods: {
        deleteAccount(id, userIdOrder) {
            console.log(id);
          console.log(userIdOrder);
          if(window.confirm("Êtes vous sur de vouloir supprimer ce compte ?")) 
            axios.delete("http://localhost:3000/api/auth/compte/delete/"+id , {
              data: {userIdOrder},
              headers : {
                authorization : "Bearer " + window.localStorage.getItem("userToken")
              }
            })
            .then( res => {
              console.log('compte supprimé' + res);
              localStorage.clear();
              location.replace(location.origin);
              this.$router.push('/login');
            })
            .catch(err => console.log('imposssible de supprimer le compte' + err))
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Numans');
@import '../assets/_variable.scss';
.title h1 {
    font-size: 2em;
    margin-top: 15px;
    margin-bottom: 15px;
    & i {
        margin-right: 10px;
    }
}

textarea {
    height: 38px !important;
    resize: none;
}

.deleteAccount {
    border: 1px solid red;
}

.alertUser {
    color: black;
    font-weight: bold;
    padding-top: 25%;
    background-color: $background-color !important;
    font-family: 'Numans', sans-serif;
}
.modal-content{
  color: black!important;
}
</style>
