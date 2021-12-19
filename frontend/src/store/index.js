import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import PortalVue from 'portal-vue';

Vue.use(Vuex)
Vue.use(PortalVue)

export default new Vuex.Store({
  state: {
    user: {
      email: '',
      username: '',
      bio: '',
      id: '',
      token: null,
      isAdmin: ''

    },
    editOption:""
  },
  mutations: {

    //Users
    userInformations(state, [email, username, bio, id, isAdmin]) {
      state.user.email = email,
        state.user.username = username,
        state.user.bio = bio,
        state.user.id = id,
        state.user.token = localStorage.getItem('userToken'),
        state.user.isAdmin = isAdmin
    },
    editStyle(state, value) {
      state.editOption = value;
    },
  },
  actions: {
    //Users
    getUserProfile(content) {
      axios.get("http://localhost:3000/api/auth/compte", {
        headers: {
          authorization: "Bearer " + localStorage.getItem('userToken')
        }
      })
        .then( res => {content.commit('userInformations', [res.data.username, res.data.id, res.data.email, res.data.bio, res.data.isAdmin])         
      })
        .catch(err => console.log('erreur requête API' + err))
    },
  },
  
})
