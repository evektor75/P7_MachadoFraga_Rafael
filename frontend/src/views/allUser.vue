<template>
    <div class="container" v-if="user.token !== null">
      <h1 class="mt-4 text-center">Liste des utilisateurs</h1>
        <h2 class="mt-3">Il y a <span class="font-weight-bold"> {{users.users.length}}</span> utilisateurs</h2>
      <div class="table-responsive mt-5">
      <table class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Modérateur</th>
            <th v-if="userConnected.user.isAdmin" class="text-danger">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users.users" :key="user.id">
            <td>{{user.username}}</td>
            <td>{{user.email}}</td>
            <td class="text-center"><span v-if="user.isAdmin" class="font-weight-bold">Oui</span> <span v-if="user.isAdmin == false"> Non</span></td>
            <td v-if="userConnected.user.isAdmin" class="text-center text-danger align-middle"><font-awesome-icon :icon="['fas','trash']" class="trashUser" @click.prevent="deleteUserProfile(user.id, userConnected.user.id)"/></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
    name:'allUser',
    data() {
      return{
        users:[],
        userConnected:[]
      }
    },
    computed: {
        ...mapState(["user"])
    },
    mounted() {
      //Récuperation de tous les utilisateurs
        axios.get("http://localhost:3000/api/auth/allProfiles", {
                headers: {
                    authorization: "Bearer " + localStorage.getItem('userToken')
                }
            })
            .then(res => {
                console.log(res.data);
                this.users = res.data;
                console.log(this.users);
            })
            .catch(err => console.log(err))

      //Recuperation de l'utilisateur
        axios.get("http://localhost:3000/api/auth/compte", {
                headers: {
                    authorization: "Bearer " + localStorage.getItem('userToken')
                }
            })
            .then(res => {
                this.userConnected = res.data;
                console.log('Utilisateur', this.userConnected);
            })
            .catch(err => console.log(err))
    },
    methods:{
      
        //Suppression du profil d'un utilisateur

        deleteUserProfile(id, userIdOrder) {
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
              this.$router.push('/feed');
            })
            .catch(err => console.log('imposssible de supprimer le compte' + err))
        }
    }
}
</script>
<style>
.trashUser{
  font-size:1.3em;
   cursor:pointer;
}
table {
  font-size:14px;
}


</style>