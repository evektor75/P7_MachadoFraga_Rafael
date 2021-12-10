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
      userId: '',
      token: null,
      isAdmin: false

    },
    messages: [],
    users: [],
    editOption:""
  },
  getters:{
    messages(state) {
      return state.messages;
    },
    users(state) {
       return state.users;
    }
  },
  mutations: {

    //Users
    userInformations(state, [email, username, bio, userId, isAdmin]) {
      state.user.email = email,
        state.user.username = username,
        state.user.bio = bio,
        state.user.userId = userId,
        state.user.token = localStorage.getItem('userToken'),
        state.user.isAdmin = isAdmin
    },
    editStyle(state, value) {
      state.editOption = value;
    },

    //Publications

    GET_POSTS(state, messages) {
      (state.messages = messages)
    }
  },
  actions: {
    //Users
    getUserProfile(content) {
      axios.get("http://localhost:3000/api/auth/compte", {
        headers: {
          authorization: "Bearer " + localStorage.getItem('userToken')
        }
      })
        .then( res => {content.commit('userInformations', [res.data.username, res.data.id, res.data.email, res.data.bio, res.data.isAdmin])})
        .catch(err => console.log('erreur requête API' + err))
    },
    //Publications
  },
  modules: {
  }
})
