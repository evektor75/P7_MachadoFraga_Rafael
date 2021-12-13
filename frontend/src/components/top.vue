<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <img src="../assets/icon-monochrome.svg" alt="logo groupomania monochromatique" class="w-45" @click.prevent="alreadyConnected"/>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse ml-5" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <router-link to="/" class="nav-link" v-if="user.token == null">Se connecter</router-link>
        <div id="userConnected" v-if="user.token !== null " >
          <div class="barre">
            <router-link to="/feed" class="nav-link">Mon Feed</router-link>
            <router-link to="/user" class="nav-link" >Mon compte</router-link>
            <button type="button" id="disconnect" class="btn btn-danger logout" @click.prevent="disconnect">Déconnexion</button>       
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>


<script>
 import { mapState } from "vuex";

export default {
 
  name: 'top',
  methods: {
    disconnect() {
      localStorage.clear();
      location.replace(location.origin);
      this.$router.push('/');
    },
    alreadyConnected() {
    if(this.user.token !== null ) {
      alert('Vous êtes déja connecté');
      this.$router.push('/feed');
    } else {
      this.$router.push('/');
    }
    
  }
  }, 
  computed: {
    ...mapState(["user"])
  }
  }
</script>

<style lang="scss">

@import '../assets/_variable.scss';

nav {
  width: 100%;
}
.navbarColor {
    background-color:#FAF2EA!important;
}
img{
  width: 250px;
}


.logout{
 width:125px;
  &:hover{
    font-weight:bold;
  }
}
.nav-link:hover {
  font-weight:bold;
}

@media all and (min-width:990px) {
  .barre{
    display: flex;
    justify-content: flex-end!important;
    text-align:center;
  }
}

</style>